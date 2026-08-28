package dto

type CreateOrderItemRequest struct {
	MenuID   uint `json:"menu_id" binding:"required"`
	Quantity uint `json:"quantity" binding:"required,min=1"`
}

type CreateOrderRequest struct {
	CustomerID    uint                     `json:"customer_id"`
	CustomerName  string                   `json:"customer_name"`
	TableID       uint                     `json:"table_id" binding:"required"`
	Items         []CreateOrderItemRequest `json:"items" binding:"required,min=1"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}
