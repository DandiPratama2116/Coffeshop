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
	err := s.db.Preload("Items").Find(&orders).Error
	return orders, err
}
func (s OrderService) GetByID(id uint) (any, error) {
	var order internal.Order
	err := s.db.Preload("Items").First(&order, id).Error
	return order, err
}
func (s OrderService) Create(request dto.CreateOrderRequest) (any, error) {
	order := internal.Order{CustomerName: request.CustomerName, TableID: request.TableID, Status: "pending"}
	err := s.db.Transaction(func(tx *gorm.DB) error {
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
	return order, err
}
