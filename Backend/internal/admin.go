package internal

import "time"

type Admin struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"size:80;not null;uniqueIndex" json:"username"`
	Name         string    `gorm:"size:120;not null" json:"name"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (Admin) TableName() string { return "admins" }

type AdminSession struct {
	ID       string     `gorm:"primaryKey;size:36" json:"id"`
	AdminID  uint       `gorm:"not null;index" json:"admin_id"`
	LoginAt  time.Time  `gorm:"not null" json:"login_at"`
	LogoutAt *time.Time `json:"logout_at"`
	Admin    Admin      `gorm:"foreignKey:AdminID" json:"admin,omitempty"`
}

func (AdminSession) TableName() string { return "admin_sessions" }