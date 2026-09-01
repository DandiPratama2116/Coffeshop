package internal

import "time"

type Reservation struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	CustomerID      uint      `gorm:"index" json:"customer_id"`
	CustomerName    string    `gorm:"size:80;not null" json:"customer_name"`
	CustomerEmail   string    `gorm:"size:191;not null" json:"customer_email"`
	TableID         uint      `gorm:"not null;index" json:"table_id"`
	ReservationDate time.Time `gorm:"type:date;not null" json:"reservation_date"`
	ReservationTime string    `gorm:"size:50;not null" json:"reservation_time"`
	NumberOfPeople  uint      `gorm:"not null" json:"number_of_people"`
	Description     string    `gorm:"type:text" json:"description"`
	Status          string    `gorm:"size:20;not null;default:'pending'" json:"status"`
	Table           Table     `gorm:"foreignKey:TableID" json:"table,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
