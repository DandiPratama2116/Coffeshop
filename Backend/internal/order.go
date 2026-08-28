package internal

import "time"

type Order struct {
	ID          uint        `gorm:"primaryKey" json:"id"`
	CustomerName string      `gorm:"size:80;not null" json:"customer_name"`
	TableID     uint        `gorm:"not null;index" json:"table_id"`
	TotalAmount float64     `gorm:"type:decimal(12,2);not null;default:0" json:"total_amount"`
	Status      string      `gorm:"size:20;not null;default:'pending';index" json:"status"`
	Table       Table       `gorm:"foreignKey:TableID" json:"table,omitempty"`
	Items       []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	Payments    []Payment   `gorm:"foreignKey:OrderID" json:"payments,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}
