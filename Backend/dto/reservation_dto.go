package dto

type CreateReservationRequest struct {
	Name            string `json:"name" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	ReservationDate string `json:"reservation_date" binding:"required"`
	ReservationTime string `json:"reservation_time" binding:"required"`
	NumberOfPeople  uint   `json:"number_of_people" binding:"required,min=1"`
	Description     string `json:"description"`
}
