package services

import (
	"errors"
	"strings"

	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type PromoService interface {
	GetAllPromos() ([]internal.Promo, error)
	GetPromoByCode(code string) (*internal.Promo, error)
	CreatePromo(req dto.PromoRequest) (*internal.Promo, error)
	UpdatePromo(id uint, req dto.PromoRequest) (*internal.Promo, error)
	DeletePromo(id uint) error
}

type promoService struct {
	db *gorm.DB
}

func NewPromoService(db *gorm.DB) PromoService {
	return &promoService{db}
}

func (s *promoService) GetAllPromos() ([]internal.Promo, error) {
	var promos []internal.Promo
	err := s.db.Preload("Product").Order("created_at desc").Find(&promos).Error
	return promos, err
}

func (s *promoService) GetPromoByCode(code string) (*internal.Promo, error) {
	var promo internal.Promo
	err := s.db.Preload("Product").Where("code = ?", strings.ToUpper(code)).First(&promo).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("Promo code tidak ditemukan")
		}
		return nil, err
	}
	return &promo, nil
}

func (s *promoService) CreatePromo(req dto.PromoRequest) (*internal.Promo, error) {
	promo := internal.Promo{
		Name:        req.Name,
		Description: req.Description,
		Discount:    req.Discount,
		Type:        req.Type,
		Code:        strings.ToUpper(req.Code),
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		ProductID:   req.ProductID,
		Active:      req.Active,
	}

	if err := s.db.Create(&promo).Error; err != nil {
		return nil, err
	}
	return &promo, nil
}

func (s *promoService) UpdatePromo(id uint, req dto.PromoRequest) (*internal.Promo, error) {
	var promo internal.Promo
	if err := s.db.First(&promo, id).Error; err != nil {
		return nil, errors.New("Promo not found")
	}

	promo.Name = req.Name
	promo.Description = req.Description
	promo.Discount = req.Discount
	promo.Type = req.Type
	promo.Code = strings.ToUpper(req.Code)
	promo.StartDate = req.StartDate
	promo.EndDate = req.EndDate
	promo.ProductID = req.ProductID
	promo.Active = req.Active

	if err := s.db.Save(&promo).Error; err != nil {
		return nil, err
	}

	return &promo, nil
}

func (s *promoService) DeletePromo(id uint) error {
	return s.db.Delete(&internal.Promo{}, id).Error
}
