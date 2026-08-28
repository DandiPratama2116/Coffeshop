package services

import (
	"backend/dto"
	"backend/internal"
	"time"

	"gorm.io/gorm"
)

type PaymentService struct{ db *gorm.DB }

func NewPaymentService(db *gorm.DB) PaymentService { return PaymentService{db: db} }
func (s PaymentService) GetAll() (any, error) {
	var payments []internal.Payment
	err := s.db.Find(&payments).Error
	return payments, err
}
func (s PaymentService) GetByID(id uint) (any, error) {
	var payment internal.Payment
	err := s.db.First(&payment, id).Error
	return payment, err
}
func (s PaymentService) Create(request dto.CreatePaymentRequest) (any, error) {
	payment := internal.Payment{OrderID: request.OrderID, PaymentMethod: request.PaymentMethod, Amount: request.Amount, TransactionID: request.TransactionID, PaymentStatus: "pending"}
	err := s.db.Create(&payment).Error
	return payment, err
}
func (s PaymentService) UpdateStatus(id uint, request dto.UpdatePaymentStatusRequest) (any, error) {
	var payment internal.Payment
	if err := s.db.First(&payment, id).Error; err != nil {
		return nil, err
	}
	payment.PaymentStatus = request.Status
	if request.Status == "paid" {
		now := time.Now()
		payment.PaidAt = &now
	}
	err := s.db.Save(&payment).Error
	return payment, err
}
