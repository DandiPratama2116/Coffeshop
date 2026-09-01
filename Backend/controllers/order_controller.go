package controllers

import (
	"net/http"
	"strconv"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type OrderController struct {
	service services.OrderService
}

func NewOrderController(service services.OrderService) *OrderController {
	return &OrderController{
		service: service,
	}
}

func (c *OrderController) GetAll(ctx *gin.Context) {
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

func (c *OrderController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID order tidak valid",
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

func (c *OrderController) Create(ctx *gin.Context) {
	var request dto.CreateOrderRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data order tidak valid",
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
		"message": "Order berhasil dibuat",
		"data":    data,
	})
}

func (c *OrderController) UpdateStatus(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID order tidak valid",
		})
		return
	}

	var request dto.UpdateOrderStatusRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Status order tidak valid",
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
		"message": "Status order berhasil diperbarui",
		"data":    data,
	})
}
