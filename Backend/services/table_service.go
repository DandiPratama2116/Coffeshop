package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type TableService struct{ db *gorm.DB }

func NewTableService(db *gorm.DB) TableService { return TableService{db: db} }
func (s TableService) GetAll() (any, error) {
	var tables []internal.Table
	err := s.db.Preload("Location").Find(&tables).Error
	return tables, err
}
func (s TableService) GetByID(id uint) (any, error) {
	var table internal.Table
	err := s.db.Preload("Location").First(&table, id).Error
	return table, err
}
func (s TableService) GetByNumber(number uint) (any, error) {
	var table internal.Table
	err := s.db.Preload("Location").Where("table_number = ?", number).First(&table).Error
	return table, err
}
func (s TableService) Create(request dto.CreateTableRequest) (any, error) {
	table := internal.Table{TableNumber: request.TableNumber, LocationID: request.LocationID, SeatingArea: request.SeatingArea, Status: "available"}
	if table.SeatingArea == "" {
		table.SeatingArea = "Indoor"
	}
	err := s.db.Create(&table).Error
	return table, err
}
func (s TableService) Update(id uint, request dto.UpdateTableRequest) (any, error) {
	var table internal.Table
	if err := s.db.First(&table, id).Error; err != nil {
		return nil, err
	}
	table.TableNumber, table.LocationID, table.Status, table.SeatingArea = request.TableNumber, request.LocationID, request.Status, request.SeatingArea
	if table.SeatingArea == "" {
		table.SeatingArea = "Indoor"
	}
	err := s.db.Save(&table).Error
	return table, err
}
func (s TableService) Delete(id uint) error { return s.db.Delete(&internal.Table{}, id).Error }
