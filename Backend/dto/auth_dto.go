package dto

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	SessionID string `json:"session_id"`
	AdminID   uint   `json:"admin_id"`
	Name      string `json:"name"`
}

type LogoutRequest struct {
	SessionID string `json:"session_id" binding:"required"`
}