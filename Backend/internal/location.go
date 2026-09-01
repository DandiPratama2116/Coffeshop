package internal

import "time"

type Location struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	NamaTempat string    `gorm:"size:120;not null" json:"nama_tempat"`
	Keterangan string    `gorm:"type:text" json:"keterangan"`
	Tables     []Table   `gorm:"foreignKey:LocationID" json:"tables,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
