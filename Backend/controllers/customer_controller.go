package controllers

import (
	"backend/dto"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CustomerController struct {
	service services.CustomerService
}

func NewCustomerController(service services.CustomerService) *CustomerController {
	return &CustomerController{service: service}
}

func (c *CustomerController) CreateCustomer(ctx *gin.Context) {
	var request dto.CreateCustomerRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data tidak valid",
			"error":   err.Error(),
		})
		return
	}

	customer, err := c.service.Create(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan data customer ke database",
			"error":   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Data customer berhasil disimpan ke database",
		"data":    customer,
	})
}
