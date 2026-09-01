package dto

type CreateTableRequest struct {
	TableNumber uint   `json:"table_number" binding:"required"`
	LocationID  uint   `json:"location_id" binding:"required"`
	SeatingArea string `json:"seating_area" binding:"required"`
	Capacity    uint   `json:"capacity"`
}

type UpdateTableRequest struct {
	TableNumber uint   `json:"table_number"`
	LocationID  uint   `json:"location_id"`
	Status      string `json:"status"`
	SeatingArea string `json:"seating_area"`
	Capacity    uint   `json:"capacity"`
}
