package controllers

import (
	"net/http"
	"strconv"

	"backend/dto"
	"backend/services"

	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	service services.CategoryService
}

func NewCategoryController(service services.CategoryService) *CategoryController {
	return &CategoryController{
		service: service,
	}
}

func (c *CategoryController) GetAll(ctx *gin.Context) {
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

func (c *CategoryController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID category tidak valid",
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

func (c *CategoryController) Create(ctx *gin.Context) {
	var request dto.CreateCategoryRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data category tidak valid",
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
		"message": "Category berhasil dibuat",
		"data":    data,
	})
}

func (c *CategoryController) Update(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID category tidak valid",
		})
		return
	}

	var request dto.UpdateCategoryRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data category tidak valid",
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
		"message": "Category berhasil diperbarui",
		"data":    data,
	})
}

func (c *CategoryController) Delete(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID category tidak valid",
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
		"message": "Category berhasil dihapus",
	})
}
