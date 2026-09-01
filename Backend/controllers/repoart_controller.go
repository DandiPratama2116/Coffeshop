package controllers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
)

type ReportController struct {
	service services.ReportService
}

func NewReportController(service services.ReportService) *ReportController {
	return &ReportController{
		service: service,
	}
}

func (c *ReportController) GetSalesReport(ctx *gin.Context) {
	startDate := ctx.Query("start_date")
	endDate := ctx.Query("end_date")

	data, err := c.service.GetSalesReport(startDate, endDate)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
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

func (c *ReportController) GetBestSellingProducts(ctx *gin.Context) {
	data, err := c.service.GetBestSellingProducts()

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
