package controllers

import (
	"net/http"
	"strconv"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type PaymentController struct {
	service services.PaymentService
}

func NewPaymentController(service services.PaymentService) *PaymentController {
	return &PaymentController{
		service: service,
	}
}

func (c *PaymentController) GetAll(ctx *gin.Context) {
	data, err := c.service.GetAll()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

func (c *PaymentController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID payment tidak valid",
		})
		return
	}

	data, err := c.service.GetByID(uint(id))
	
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

func (c *PaymentController) Create(ctx *gin.Context) {
	var request dto.CreatePaymentRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data payment tidak valid",
			"error":   err.Error(),
		})
		return
	}

	data, err := c.service.Create(request)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Payment berhasil dibuat",
		"data":    data,
	})
}

func (c *PaymentController) UpdateStatus(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID payment tidak valid",
		})
		return
	}

	var request dto.UpdatePaymentStatusRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Status payment tidak valid",
			"error":   err.Error(),
		})
		return
	}

	data, err := c.service.UpdateStatus(uint(id), request)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status payment berhasil diperbarui",
		"data":    data,
	})
}
