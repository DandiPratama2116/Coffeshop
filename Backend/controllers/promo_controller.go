package controllers

import (
	"net/http"
	"strconv"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type PromoController interface {
	GetAllPromos(c *gin.Context)
	GetPromoByCode(c *gin.Context)
	CreatePromo(c *gin.Context)
	UpdatePromo(c *gin.Context)
	DeletePromo(c *gin.Context)
}

type promoController struct {
	promoService services.PromoService
}

func NewPromoController(s services.PromoService) PromoController {
	return &promoController{s}
}

func (ctrl *promoController) GetAllPromos(c *gin.Context) {
	promos, err := ctrl.promoService.GetAllPromos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch promos", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": promos})
}

func (ctrl *promoController) GetPromoByCode(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Code parameter is required"})
		return
	}

	promo, err := ctrl.promoService.GetPromoByCode(code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": promo})
}

func (ctrl *promoController) CreatePromo(c *gin.Context) {
	var req dto.PromoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Format input tidak valid", "error": err.Error()})
		return
	}

	promo, err := ctrl.promoService.CreatePromo(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal membuat promo", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Promo berhasil ditambahkan", "data": promo})
}

func (ctrl *promoController) UpdatePromo(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "ID promo tidak valid"})
		return
	}

	var req dto.PromoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Format input tidak valid"})
		return
	}

	promo, err := ctrl.promoService.UpdatePromo(uint(id), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal update promo", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Promo berhasil diupdate", "data": promo})
}

func (ctrl *promoController) DeletePromo(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "ID promo tidak valid"})
		return
	}

	if err := ctrl.promoService.DeletePromo(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menghapus promo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Promo berhasil dihapus"})
}
