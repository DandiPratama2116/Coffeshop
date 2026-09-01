package internal

import "time"

type Customer struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Nama        string    `gorm:"size:80;not null" json:"nama"`
	Meja        string    `gorm:"size:20;not null" json:"meja"`
	LokasiDuduk string    `gorm:"size:80;not null" json:"lokasi_duduk"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
