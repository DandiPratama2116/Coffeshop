package internal

import "time"

type Promo struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Discount    float64   `gorm:"type:decimal(10,2);not null" json:"discount"`
	Type        string    `gorm:"size:50;not null;default:'percent'" json:"type"` 
	Code        string    `gorm:"size:100;not null;uniqueIndex" json:"code"`
	StartDate   string    `gorm:"size:50" json:"start_date"` 
	EndDate     string    `gorm:"size:50" json:"end_date"`
	ProductID   *uint     `json:"product_id"`
	Product     *Product  `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Active      bool      `gorm:"default:true" json:"active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
