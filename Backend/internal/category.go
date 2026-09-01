package internal

import "time"

type Category struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	NamaKategori string    `gorm:"size:100;not null;uniqueIndex" json:"nama_kategori"`
	Deskripsi    string    `gorm:"type:text" json:"deskripsi"`
	Menus        []Product `gorm:"foreignKey:CategoryID" json:"menus,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
