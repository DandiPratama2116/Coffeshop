package dto

type UpdateSettingRequest struct {
	Name       string  `json:"name"`
	Tagline    string  `json:"tagline"`
	Address    string  `json:"address"`
	Phone      string  `json:"phone"`
	Email      string  `json:"email"`
	OpenTime         string  `json:"open_time"`
	CloseTime        string  `json:"close_time"`
	OpenDays         string  `json:"open_days"`
	OperationalHours string  `json:"operational_hours"`
	IsOpen           *bool   `json:"is_open"`
	Instagram  string  `json:"instagram"`
	Wifi       string  `json:"wifi"`
	MinOrder   float64 `json:"min_order"`
	Currency   string  `json:"currency"`
	TaxPercent float64 `json:"tax_percent"`
}
