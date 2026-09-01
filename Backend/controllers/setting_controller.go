package controllers

import (
	"backend/dto"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SettingController struct {
	service services.SettingService
}

func NewSettingController(service services.SettingService) *SettingController {
	return &SettingController{service: service}
}

func (c *SettingController) GetSettings(ctx *gin.Context) {
	data, err := c.service.GetSettings()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil pengaturan cafe",
			"error":   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

func (c *SettingController) UpdateSettings(ctx *gin.Context) {
	var request dto.UpdateSettingRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
			"error":   err.Error(),
		})
		return
	}

	data, err := c.service.UpdateSettings(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal memperbarui pengaturan cafe",
			"error":   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Pengaturan berhasil diperbarui",
		"data":    data,
	})
}
