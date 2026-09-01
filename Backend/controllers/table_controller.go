package controllers

import (
	"net/http"
	"strconv"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type TableController struct {
	service services.TableService
}

func NewTableController(service services.TableService) *TableController {
	return &TableController{
		service: service,
	}
}

func (c *TableController) GetAll(ctx *gin.Context) {
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

func (c *TableController) GetSummary(ctx *gin.Context) {
	data, err := c.service.GetSummary()
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

func (c *TableController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID table tidak valid",
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

func (c *TableController) GetByNumber(ctx *gin.Context) {
	number, err := strconv.ParseUint(ctx.Param("number"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Nomor meja tidak valid"})
		return
	}

	data, err := c.service.GetByNumber(uint(number))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Meja tidak ditemukan"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"success": true, "data": data})
}

func (c *TableController) Create(ctx *gin.Context) {
	var request dto.CreateTableRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data table tidak valid",
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
		"message": "Table berhasil dibuat",
		"data":    data,
	})
}

func (c *TableController) Update(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID table tidak valid",
		})
		return
	}

	var request dto.UpdateTableRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data table tidak valid",
			"error":   err.Error(),
		})
		return
	}

	data, err := c.service.Update(uint(id), request)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Table berhasil diperbarui",
		"data":    data,
	})
}

func (c *TableController) Delete(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID table tidak valid",
		})
		return
	}

	err = c.service.Delete(uint(id))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Table berhasil dihapus",
	})
}
