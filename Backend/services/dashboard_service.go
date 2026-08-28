package services

import "gorm.io/gorm"

type DashboardService struct{ db *gorm.DB }

func NewDashboardService(db *gorm.DB) DashboardService { return DashboardService{db: db} }

func (s DashboardService) GetDashboard() (any, error) {
	var revenue float64
	var orders int64
	if err := s.db.Model(&struct{ TotalAmount float64 }{}).Table("orders").Where("status = ?", "completed").Select("COALESCE(SUM(total_amount), 0)").Scan(&revenue).Error; err != nil {
		return nil, err
	}
	if err := s.db.Table("orders").Where("status = ?", "completed").Count(&orders).Error; err != nil {
		return nil, err
	}
	return map[string]any{"revenue": revenue, "completed_orders": orders}, nil
}
