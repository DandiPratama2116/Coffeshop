package services

import (
	"errors"
	"time"

	"backend/dto"
	"backend/internal"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService interface {
	Login(req dto.LoginRequest) (*dto.LoginResponse, error)
	Logout(sessionID string) error
}

type authService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) AuthService {
	return &authService{db: db}
}

func (s *authService) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
	var admin internal.Admin
	if err := s.db.Where("username = ?", req.Username).First(&admin).Error; err != nil {
		return nil, errors.New("username atau password salah")
	}

	// Verifikasi Password Hash
	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("username atau password salah")
	}

	// Catat Session Login Baru ke Database
	session := internal.AdminSession{
		ID:      uuid.New().String(),
		AdminID: admin.ID,
		LoginAt: time.Now(),
	}

	if err := s.db.Create(&session).Error; err != nil {
		return nil, err
	}

	return &dto.LoginResponse{
		SessionID: session.ID,
		AdminID:   admin.ID,
		Name:      admin.Name,
	}, nil
}

func (s *authService) Logout(sessionID string) error {
	now := time.Now()

	// Update kolom logout_at pada baris session yang aktif (logout_at masih NULL)
	result := s.db.Model(&internal.AdminSession{}).
		Where("id = ? AND logout_at IS NULL", sessionID).
		Update("logout_at", &now)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("session tidak ditemukan atau sudah logout")
	}

	return nil
}