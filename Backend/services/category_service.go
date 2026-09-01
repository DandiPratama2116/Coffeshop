package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type CategoryService struct{ db *gorm.DB }

func NewCategoryService(db *gorm.DB) CategoryService { return CategoryService{db: db} }
func (s CategoryService) GetAll() (any, error) {
	var categories []internal.Category
	err := s.db.Find(&categories).Error
	return categories, err
}
func (s CategoryService) GetByID(id uint) (any, error) {
	var category internal.Category
	err := s.db.First(&category, id).Error
	return category, err
}
func (s CategoryService) Create(request dto.CreateCategoryRequest) (any, error) {
	category := internal.Category{NamaKategori: request.NamaKategori, Deskripsi: request.Deskripsi}
	err := s.db.Create(&category).Error
	return category, err
}
func (s CategoryService) Update(id uint, request dto.UpdateCategoryRequest) (any, error) {
	var category internal.Category
	if err := s.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	category.NamaKategori, category.Deskripsi = request.NamaKategori, request.Deskripsi
	err := s.db.Save(&category).Error
	return category, err
}
func (s CategoryService) Delete(id uint) error { return s.db.Delete(&internal.Category{}, id).Error }
