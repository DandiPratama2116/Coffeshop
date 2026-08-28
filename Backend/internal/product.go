package internal

import "time"

type Product struct {
	ID         uint        `gorm:"primaryKey" json:"id"`
	CategoryID uint        `gorm:"not null;index" json:"category_id"`
	NamaMenu   string      `gorm:"size:150;not null" json:"nama_menu"`
	Deskripsi  string      `gorm:"type:text" json:"deskripsi"`
	Harga      float64     `gorm:"type:decimal(12,2);not null;default:0" json:"harga"`
	Image      string      `gorm:"size:500" json:"image"`
	Status     string      `gorm:"size:20;not null;default:'available'" json:"status"`
	Category   Category    `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	OrderItems []OrderItem `gorm:"foreignKey:MenuID" json:"order_items,omitempty"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

func (Product) TableName() string { return "menus" }
