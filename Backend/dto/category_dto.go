package dto

type CreateCategoryRequest struct {
	NamaKategori string `json:"nama_kategori" binding:"required"`
	Deskripsi    string `json:"deskripsi"`
}

type UpdateCategoryRequest struct {
	NamaKategori string `json:"nama_kategori"`
	Deskripsi    string `json:"deskripsi"`
}
