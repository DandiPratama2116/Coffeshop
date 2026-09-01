package controllers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
)

type DashboardController struct {
	service services.DashboardService
}

func NewDashboardController(service services.DashboardService) *DashboardController {
	return &DashboardController{
		service: service,
	}
}

func (c *DashboardController) GetDashboard(ctx *gin.Context) {
	data, err := c.service.GetDashboard()

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
