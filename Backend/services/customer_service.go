package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type CustomerService struct {
	db *gorm.DB
}

func NewCustomerService(db *gorm.DB) CustomerService {
	return CustomerService{db: db}
}

func (s CustomerService) Create(request dto.CreateCustomerRequest) (internal.Customer, error) {
	customer := internal.Customer{
		Nama:        request.Nama,
		Meja:        request.Meja,
		LokasiDuduk: request.LokasiDuduk,
	}
	err := s.db.Create(&customer).Error
	if err == nil && request.Meja != "" {
		// Ubah status meja menjadi occupied saat customer mulai memesan di meja ini
		s.db.Model(&internal.Table{}).Where("table_number = ?", request.Meja).Update("status", "occupied")
	}
	return customer, err
}
