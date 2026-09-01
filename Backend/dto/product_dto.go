package dto

type CreateProductRequest struct {
	CategoryID uint    `json:"category_id" binding:"required"`
	NamaMenu   string  `json:"nama_menu" binding:"required"`
	Deskripsi  string  `json:"deskripsi"`
	Harga      float64 `json:"harga" binding:"required,min=0"`
	Image      string  `json:"image"`
	Status     string  `json:"status"`
}

type UpdateProductRequest = CreateProductRequest
