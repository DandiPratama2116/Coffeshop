package internal

import "time"

type Table struct {
	ID           uint          `gorm:"primaryKey" json:"id"`
	TableNumber  uint          `gorm:"not null" json:"table_number"`
	LocationID   uint          `gorm:"not null;index" json:"location_id"`
	SeatingArea  string        `gorm:"size:40;not null;default:'Indoor'" json:"seating_area"`
	Status       string        `gorm:"size:20;not null;default:'available'" json:"status"`
	Location     Location      `gorm:"foreignKey:LocationID" json:"location,omitempty"`
	Reservations []Reservation `gorm:"foreignKey:TableID" json:"reservations,omitempty"`
	Orders       []Order       `gorm:"foreignKey:TableID" json:"orders,omitempty"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
}

func (Table) TableName() string { return "tables" }
