package internal

import "time"

type OrderItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	OrderID   uint      `gorm:"not null;index" json:"order_id"`
	MenuID    uint      `gorm:"not null;index" json:"menu_id"`
	Quantity  uint      `gorm:"not null;default:1" json:"quantity"`
	Price     float64   `gorm:"type:decimal(12,2);not null;default:0" json:"price"`
	Subtotal  float64   `gorm:"type:decimal(12,2);not null;default:0" json:"subtotal"`
	Order     Order     `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Menu      Product   `gorm:"foreignKey:MenuID" json:"menu,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
