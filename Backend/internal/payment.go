package internal

import "time"

type Payment struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	OrderID       uint       `gorm:"not null;index" json:"order_id"`
	PaymentMethod string     `gorm:"size:50;not null" json:"payment_method"`
	PaymentStatus string     `gorm:"size:20;not null;default:'pending';index" json:"payment_status"`
	Amount        float64    `gorm:"type:decimal(12,2);not null;default:0" json:"amount"`
	TransactionID string     `gorm:"size:191;uniqueIndex" json:"transaction_id"`
	PaidAt        *time.Time `json:"paid_at"`
	Order         Order      `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}
