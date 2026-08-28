package dto

type CreatePaymentRequest struct {
	OrderID       uint    `json:"order_id" binding:"required"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Amount        float64 `json:"amount" binding:"required,min=0"`
	TransactionID string  `json:"transaction_id"`
}

type UpdatePaymentStatusRequest struct {
	Status string `json:"status" binding:"required"`
}
