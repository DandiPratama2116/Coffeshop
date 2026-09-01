package dto

type PromoRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Discount    float64 `json:"discount" binding:"required"`
	Type        string  `json:"type" binding:"required"`
	Code        string  `json:"code" binding:"required"`
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
	ProductID   *uint   `json:"product_id"`
	Active      bool    `json:"active"`
}
