package controllers

import (
	"net/http"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type ReservationController struct {
	service services.ReservationService
}

func NewReservationController(service services.ReservationService) *ReservationController {
	return &ReservationController{service: service}
}

func (c *ReservationController) Create(ctx *gin.Context) {
	var request dto.CreateReservationRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data reservasi tidak valid", "error": err.Error()})
		return
	}

	reservation, err := c.service.Create(request)
	if err != nil {
		// Jika error karena email, tapi reservasi tersimpan, berikan response sukses dengan warning
		if reservation.ID != 0 {
			ctx.JSON(http.StatusCreated, gin.H{"success": true, "message": err.Error(), "data": reservation})
			return
		}
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"success": true, "message": "Reservasi berhasil dibuat dan menunggu konfirmasi", "data": reservation})
}

func (c *ReservationController) GetAll(ctx *gin.Context) {
	reservations, err := c.service.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"success": true, "data": reservations})
}

func (c *ReservationController) UpdateStatus(ctx *gin.Context) {
	id := ctx.Param("id")

	var request struct {
		Status string `json:"status" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	if err := c.service.UpdateStatus(id, request.Status); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "message": "Status reservasi berhasil diperbarui"})
}
