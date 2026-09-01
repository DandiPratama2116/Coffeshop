package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type ProductService struct{ db *gorm.DB }

func NewProductService(db *gorm.DB) ProductService { return ProductService{db: db} }
func (s ProductService) GetAll() (any, error) {
	var products []internal.Product
	err := s.db.Preload("Category").Find(&products).Error
	return products, err
}
func (s ProductService) GetByID(id uint) (any, error) {
	var product internal.Product
	err := s.db.Preload("Category").First(&product, id).Error
	return product, err
}
func (s ProductService) Create(request dto.CreateProductRequest) (any, error) {
	product := internal.Product{CategoryID: request.CategoryID, NamaMenu: request.NamaMenu, Deskripsi: request.Deskripsi, Harga: request.Harga, Image: request.Image, Status: request.Status}
	if product.Status == "" {
		product.Status = "available"
	}
	err := s.db.Create(&product).Error
	return product, err
}
func (s ProductService) Update(id uint, request dto.UpdateProductRequest) (any, error) {
	var product internal.Product
	if err := s.db.First(&product, id).Error; err != nil {
		return nil, err
	}
	product.CategoryID, product.NamaMenu, product.Deskripsi, product.Harga, product.Image, product.Status = request.CategoryID, request.NamaMenu, request.Deskripsi, request.Harga, request.Image, request.Status
	err := s.db.Save(&product).Error
	return product, err
}
func (s ProductService) Delete(id uint) error { return s.db.Delete(&internal.Product{}, id).Error }
