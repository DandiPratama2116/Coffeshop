package services

import "gorm.io/gorm"

type ReportService struct{ db *gorm.DB }

func NewReportService(db *gorm.DB) ReportService { return ReportService{db: db} }

func (s ReportService) GetSalesReport(startDate, endDate string) (any, error) {
	var result []struct {
		Date    string  `json:"date"`
		Revenue float64 `json:"revenue"`
		Orders  int64   `json:"orders"`
	}
	query := s.db.Table("orders").Select("DATE(created_at) AS date, SUM(total_amount) AS revenue, COUNT(*) AS orders").Where("status = ?", "completed")
	if startDate != "" {
		query = query.Where("DATE(created_at) >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("DATE(created_at) <= ?", endDate)
	}
	err := query.Group("DATE(created_at)").Order("date").Scan(&result).Error
	return result, err
}
func (s ReportService) GetBestSellingProducts() (any, error) {
	var result []struct {
		MenuID   uint `json:"menu_id"`
		Quantity uint `json:"quantity"`
	}
	err := s.db.Table("order_items").Select("menu_id, SUM(quantity) AS quantity").Group("menu_id").Order("quantity DESC").Scan(&result).Error
	return result, err
}
