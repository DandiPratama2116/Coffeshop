package internal

import "time"

type CafeSetting struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `gorm:"size:120;not null;default:'Coffee Shop'" json:"name"`
	Tagline    string    `gorm:"size:255;default:'Your Daily Coffee Escape'" json:"tagline"`
	Address    string    `gorm:"type:text" json:"address"`
	Phone      string    `gorm:"size:50" json:"phone"`
	Email      string    `gorm:"size:100" json:"email"`
	OpenTime   string    `gorm:"size:20;default:'08:00'" json:"open_time"`
	CloseTime  string    `gorm:"size:20;default:'22:00'" json:"close_time"`
	OpenDays         string    `gorm:"size:100;default:'Senin - Minggu'" json:"open_days"`
	OperationalHours string    `gorm:"type:text" json:"operational_hours"`
	IsOpen           bool      `gorm:"default:true" json:"is_open"`
	Instagram  string    `gorm:"size:100;default:'@coffeeshop'" json:"instagram"`
	Wifi       string    `gorm:"size:100;default:'CoffeeShopWifi123'" json:"wifi"`
	MinOrder   float64   `gorm:"default:0" json:"min_order"`
	Currency   string    `gorm:"size:10;default:'IDR'" json:"currency"`
	TaxPercent float64   `gorm:"default:0" json:"tax_percent"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (CafeSetting) TableName() string { return "cafe_settings" }
