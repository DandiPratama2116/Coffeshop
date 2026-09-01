package services

import (
	"errors"
	"fmt"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"time"

	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type ReservationService struct {
	db *gorm.DB
}

func NewReservationService(db *gorm.DB) ReservationService {
	return ReservationService{db: db}
}

func (s ReservationService) Create(request dto.CreateReservationRequest) (internal.Reservation, error) {
	if s.db == nil {
		return internal.Reservation{}, errors.New("database belum terhubung")
	}

	reservationDate, err := time.Parse("2006-01-02", request.ReservationDate)
	if err != nil {
		return internal.Reservation{}, errors.New("format tanggal reservasi harus YYYY-MM-DD")
	}
	if _, err := time.Parse("15:04", request.ReservationTime); err != nil {
		return internal.Reservation{}, errors.New("format waktu reservasi harus HH:MM")
	}
	if reservationDate.Before(time.Now().Truncate(24 * time.Hour)) {
		return internal.Reservation{}, errors.New("tanggal reservasi tidak boleh di masa lalu")
	}

	var table internal.Table
	foundTable := false
	re := regexp.MustCompile(`Meja:\s*\(?(\d+)`)
	matches := re.FindStringSubmatch(request.Description)
	if len(matches) > 1 {
		if tblNum, err := strconv.Atoi(matches[1]); err == nil && tblNum > 0 {
			if s.db.Where("table_number = ?", tblNum).First(&table).Error == nil {
				foundTable = true
			}
		}
	}
	if !foundTable {
		if err := s.db.Where("status = ?", "available").First(&table).Error; err != nil {
			if err := s.db.First(&table).Error; err != nil {
				return internal.Reservation{}, errors.New("belum ada data meja di sistem")
			}
		}
	}

	// Pastikan kolom customer_id dan reservation_time di MySQL fleksibel, serta hapus kolom phone yang tidak terpakai
	_ = s.db.Exec("ALTER TABLE `reservations` MODIFY `customer_id` BIGINT UNSIGNED NULL").Error
	_ = s.db.Exec("ALTER TABLE `reservations` MODIFY `reservation_time` VARCHAR(50) NULL").Error
	_ = s.db.Exec("ALTER TABLE `reservations` DROP COLUMN `customer_phone`").Error
	_ = s.db.Exec("ALTER TABLE `reservations` DROP COLUMN `customerphone`").Error
	_ = s.db.Exec("ALTER TABLE `reservations` DROP COLUMN `nomor_phone`").Error
	_ = s.db.Exec("ALTER TABLE `reservations` DROP COLUMN `nomorphone`").Error
	_ = s.db.Exec("ALTER TABLE `customers` DROP COLUMN `phone`").Error
	_ = s.db.Exec("ALTER TABLE `customers` DROP COLUMN `nomor_phone`").Error
	_ = s.db.Exec("ALTER TABLE `customers` DROP COLUMN `nomorphone`").Error

	// Buat record customer untuk relasi customer_id
	customer := internal.Customer{
		Nama:        request.Name,
		Meja:        strconv.FormatUint(uint64(table.TableNumber), 10),
		LokasiDuduk: "Reservasi",
	}
	if err := s.db.Create(&customer).Error; err != nil {
		var existingCustomer internal.Customer
		if s.db.First(&existingCustomer).Error == nil {
			customer.ID = existingCustomer.ID
		}
	}

	reservation := internal.Reservation{
		CustomerID:      customer.ID,
		CustomerName:    request.Name,
		CustomerEmail:   request.Email,
		TableID:         table.ID,
		ReservationDate: reservationDate,
		ReservationTime: request.ReservationTime,
		NumberOfPeople:  request.NumberOfPeople,
		Description:     request.Description,
		Status:          "pending",
	}

	if err := s.db.Create(&reservation).Error; err != nil {
		// Jika MySQL kolom reservation_time bertipe DATETIME, gunakan format YYYY-MM-DD HH:MM:00
		fullDateTime := fmt.Sprintf("%s %s:00", request.ReservationDate, request.ReservationTime)
		reservation.ReservationTime = fullDateTime
		if retryErr := s.db.Create(&reservation).Error; retryErr != nil {
			// Coba format TIME standar HH:MM:SS
			reservation.ReservationTime = request.ReservationTime + ":00"
			if thirdErr := s.db.Create(&reservation).Error; thirdErr != nil {
				return internal.Reservation{}, errors.New("gagal menyimpan reservasi: " + thirdErr.Error())
			}
		}
	}

	// Kirim notifikasi email (jika SMTP aktif) tanpa menggagalkan reservasi jika SMTP belum disetting
	_ = sendReservationEmail(request, reservation.ID, table.TableNumber)

	return reservation, nil
}

func (s ReservationService) GetAll() ([]internal.Reservation, error) {
	var reservations []internal.Reservation
	err := s.db.Preload("Table").Order("reservation_date DESC, reservation_time DESC").Find(&reservations).Error
	return reservations, err
}

func (s ReservationService) UpdateStatus(id string, status string) error {
	var reservation internal.Reservation
	if err := s.db.First(&reservation, id).Error; err != nil {
		return errors.New("reservasi tidak ditemukan")
	}

	reservation.Status = status
	return s.db.Save(&reservation).Error
}

func sendReservationEmail(request dto.CreateReservationRequest, reservationID uint, tableNumber uint) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	recipient := os.Getenv("COFFEE_SHOP_EMAIL")
	if host == "" || port == "" || username == "" || password == "" || recipient == "" {
		return errors.New("konfigurasi SMTP belum lengkap")
	}

	auth := smtp.PlainAuth("", username, password, host)
	subject := "Reservasi Baru Coffee Shop Norma"
	body := fmt.Sprintf("Reservasi #%s\nNama: %s\nEmail: %s\nTanggal: %s\nWaktu: %s\nJumlah orang: %d\nMeja: %d\nCatatan: %s\n", strconv.FormatUint(uint64(reservationID), 10), request.Name, request.Email, request.ReservationDate, request.ReservationTime, request.NumberOfPeople, tableNumber, request.Description)
	message := "From: " + username + "\r\n" + "To: " + recipient + "\r\n" + "Subject: " + subject + "\r\n\r\n" + body
	return smtp.SendMail(host+":"+port, auth, username, []string{recipient, request.Email}, []byte(message))
}
