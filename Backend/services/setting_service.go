package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type SettingService struct {
	db *gorm.DB
}

func NewSettingService(db *gorm.DB) SettingService {
	return SettingService{db: db}
}

func (s SettingService) GetSettings() (internal.CafeSetting, error) {
	var setting internal.CafeSetting
	err := s.db.First(&setting).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Inisialisasi pengaturan default
			setting = internal.CafeSetting{
				Name:       "Coffee Shop",
				Tagline:    "Your Daily Coffee Escape",
				Address:    "Pekanbaru, Riau, Indonesia",
				Phone:      "+62 812 3456 7890",
				Email:            "hello@coffeeshop.com",
				OpenTime:         "08:00",
				CloseTime:        "22:00",
				OpenDays:         "Senin - Minggu",
				OperationalHours: "[{\"day\":\"Senin\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Selasa\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Rabu\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Kamis\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Jumat\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Sabtu\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false},{\"day\":\"Minggu\",\"open\":\"09:00\",\"close\":\"22:00\",\"isClosed\":false}]",
				IsOpen:           true,
				Instagram:  "@coffeeshop",
				Wifi:       "CoffeeShopWifi123",
				MinOrder:   0,
				Currency:   "IDR",
				TaxPercent: 0,
			}
			s.db.Create(&setting)
			return setting, nil
		}
		return setting, err
	}
	return setting, nil
}

func (s SettingService) UpdateSettings(request dto.UpdateSettingRequest) (internal.CafeSetting, error) {
	setting, err := s.GetSettings()
	if err != nil {
		return setting, err
	}

	if request.Name != "" {
		setting.Name = request.Name
	}
	if request.Tagline != "" {
		setting.Tagline = request.Tagline
	}
	if request.Address != "" {
		setting.Address = request.Address
	}
	if request.Phone != "" {
		setting.Phone = request.Phone
	}
	if request.Email != "" {
		setting.Email = request.Email
	}
	if request.OpenTime != "" {
		setting.OpenTime = request.OpenTime
	}
	if request.CloseTime != "" {
		setting.CloseTime = request.CloseTime
	}
	if request.OpenDays != "" {
		setting.OpenDays = request.OpenDays
	}
	if request.OperationalHours != "" {
		setting.OperationalHours = request.OperationalHours
	}
	if request.IsOpen != nil {
		setting.IsOpen = *request.IsOpen
	}
	if request.Instagram != "" {
		setting.Instagram = request.Instagram
	}
	if request.Wifi != "" {
		setting.Wifi = request.Wifi
	}
	setting.MinOrder = request.MinOrder
	if request.Currency != "" {
		setting.Currency = request.Currency
	}
	setting.TaxPercent = request.TaxPercent

	err = s.db.Save(&setting).Error
	return setting, err
}
