package services

import (
	"backend/dto"
	"backend/internal"

	"gorm.io/gorm"
)

type OrderService struct{ db *gorm.DB }

func NewOrderService(db *gorm.DB) OrderService { return OrderService{db: db} }
func (s OrderService) GetAll() (any, error) {
	var orders []internal.Order
	err := s.db.Preload("Items.Menu").Preload("Items").Preload("Customer").Preload("Promo").Order("created_at desc").Find(&orders).Error
	return orders, err
}
func (s OrderService) GetByID(id uint) (any, error) {
	var order internal.Order
	err := s.db.Preload("Items.Menu").Preload("Items").Preload("Customer").Preload("Promo").First(&order, id).Error
	return order, err
}
func (s OrderService) Create(request dto.CreateOrderRequest) (any, error) {
	var order internal.Order
	err := s.db.Transaction(func(tx *gorm.DB) error {
		var custID *uint
		if request.CustomerID > 0 {
			custID = &request.CustomerID
		}

		order = internal.Order{
			CustomerID:   custID,
			CustomerName: request.CustomerName,
			TableID:      request.TableID,
			Status:       "pending",
		}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}
		for _, item := range request.Items {
			var menu internal.Product
			if err := tx.First(&menu, item.MenuID).Error; err != nil {
				return err
			}
			subtotal := menu.Harga * float64(item.Quantity)
			order.TotalAmount += subtotal
			if err := tx.Create(&internal.OrderItem{OrderID: order.ID, MenuID: item.MenuID, Quantity: item.Quantity, Price: menu.Harga, Subtotal: subtotal}).Error; err != nil {
				return err
			}
		}

		if request.PromoID != nil && *request.PromoID > 0 {
			var promo internal.Promo
			if err := tx.First(&promo, *request.PromoID).Error; err == nil {
				order.PromoID = &promo.ID
				if promo.Type == "fixed" {
					order.DiscountAmount = promo.Discount
				} else {
					order.DiscountAmount = order.TotalAmount * (promo.Discount / 100)
				}
				if order.DiscountAmount > order.TotalAmount {
					order.DiscountAmount = order.TotalAmount
				}
				order.TotalAmount -= order.DiscountAmount
			}
		} else if request.PromoCode != "" {
			var promo internal.Promo
			if err := tx.Where("code = ? AND active = ?", request.PromoCode, true).First(&promo).Error; err == nil {
				order.PromoID = &promo.ID
				if promo.Type == "fixed" {
					order.DiscountAmount = promo.Discount
				} else {
					order.DiscountAmount = order.TotalAmount * (promo.Discount / 100)
				}
				if order.DiscountAmount > order.TotalAmount {
					order.DiscountAmount = order.TotalAmount
				}
				order.TotalAmount -= order.DiscountAmount
			}
		} else if request.DiscountAmount > 0 {
			order.DiscountAmount = request.DiscountAmount
			if order.DiscountAmount > order.TotalAmount {
				order.DiscountAmount = order.TotalAmount
			}
			order.TotalAmount -= order.DiscountAmount
		}

		if err := tx.Model(&internal.Table{}).Where("id = ?", request.TableID).Update("status", "occupied").Error; err != nil {
			return err
		}
		return tx.Save(&order).Error
	})
	return order, err
}
func (s OrderService) UpdateStatus(id uint, request dto.UpdateOrderStatusRequest) (any, error) {
	var order internal.Order
	if err := s.db.First(&order, id).Error; err != nil {
		return nil, err
	}
	order.Status = request.Status
	err := s.db.Save(&order).Error
	if err == nil && (request.Status == "completed" || request.Status == "done") {
		// Kosongkan kembali meja jika pesanan telah selesai
		s.db.Model(&internal.Table{}).Where("id = ?", order.TableID).Update("status", "available")
	}
	return order, err
}
