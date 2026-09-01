package dto

type CreateCustomerRequest struct {
	Nama        string `json:"nama" binding:"required"`
	Meja        string `json:"meja" binding:"required"`
	LokasiDuduk string `json:"lokasi_duduk" binding:"required"`
}
