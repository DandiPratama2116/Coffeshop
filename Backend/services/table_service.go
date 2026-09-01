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
	capacity := request.Capacity
	if capacity == 0 {
		capacity = 4
	}
	table := internal.Table{
		TableNumber: request.TableNumber,
		LocationID:  request.LocationID,
		SeatingArea: request.SeatingArea,
		Capacity:    capacity,
		Status:      "available",
	}
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
	if request.Capacity > 0 {
		table.Capacity = request.Capacity
	}
	if table.SeatingArea == "" {
		table.SeatingArea = "Indoor"
	}
	err := s.db.Save(&table).Error
	return table, err
}
func (s TableService) Delete(id uint) error { return s.db.Delete(&internal.Table{}, id).Error }

type AreaSummary struct {
	Area              string `json:"area"`
	TotalTables       int    `json:"total_tables"`
	AvailableTables   int    `json:"available_tables"`
	OccupiedTables    int    `json:"occupied_tables"`
	TotalCapacity     int    `json:"total_capacity"`
	AvailableCapacity int    `json:"available_capacity"`
	OccupiedCapacity  int    `json:"occupied_capacity"`
}

type TableSummaryResponse struct {
	TotalTables       int           `json:"total_tables"`
	AvailableTables   int           `json:"available_tables"`
	OccupiedTables    int           `json:"occupied_tables"`
	TotalCapacity     int           `json:"total_capacity"`
	AvailableCapacity int           `json:"available_capacity"`
	OccupiedCapacity  int           `json:"occupied_capacity"`
	Areas             []AreaSummary `json:"areas"`
}

func (s TableService) GetSummary() (TableSummaryResponse, error) {
	var tables []internal.Table
	err := s.db.Find(&tables).Error
	if err != nil {
		return TableSummaryResponse{}, err
	}

	areaMap := make(map[string]*AreaSummary)
	summary := TableSummaryResponse{Areas: make([]AreaSummary, 0)}

	for _, t := range tables {
		areaName := t.SeatingArea
		if areaName == "" {
			areaName = "Indoor"
		}
		capVal := int(t.Capacity)
		if capVal <= 0 {
			capVal = 4
		}

		if _, exists := areaMap[areaName]; !exists {
			areaMap[areaName] = &AreaSummary{Area: areaName}
		}
		as := areaMap[areaName]

		as.TotalTables++
		as.TotalCapacity += capVal
		summary.TotalTables++
		summary.TotalCapacity += capVal

		if t.Status == "available" {
			as.AvailableTables++
			as.AvailableCapacity += capVal
			summary.AvailableTables++
			summary.AvailableCapacity += capVal
		} else {
			as.OccupiedTables++
			as.OccupiedCapacity += capVal
			summary.OccupiedTables++
			summary.OccupiedCapacity += capVal
		}
	}

	for _, as := range areaMap {
		summary.Areas = append(summary.Areas, *as)
	}

	return summary, nil
}
