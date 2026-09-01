package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterCustomerRoutes registers endpoints available to customers.
func RegisterCustomerRoutes(group *gin.RouterGroup, customer *controllers.CustomerController, products *controllers.ProductController, categories *controllers.CategoryController, tables *controllers.TableController, orders *controllers.OrderController, payments *controllers.PaymentController, reservations *controllers.ReservationController, settings *controllers.SettingController, promos controllers.PromoController) {
	customerGroup := group.Group("/customer")

	customerGroup.GET("/settings", settings.GetSettings)
	customerGroup.GET("/products", products.GetAll)
	customerGroup.GET("/products/:id", products.GetByID)
	customerGroup.GET("/categories", categories.GetAll)
	customerGroup.GET("/tables", tables.GetAll)
	customerGroup.GET("/tables/summary", tables.GetSummary)
	customerGroup.GET("/tables/number/:number", tables.GetByNumber)
	customerGroup.GET("/tables/:id", tables.GetByID)
	customerGroup.POST("/orders", orders.Create)
	customerGroup.GET("/orders/:id", orders.GetByID)
	customerGroup.POST("/payments", payments.Create)
	customerGroup.POST("/reservations", reservations.Create)
	customerGroup.POST("/customers", customer.CreateCustomer)
	customerGroup.GET("/promos", promos.GetAllPromos)
	customerGroup.GET("/promos/validate", promos.GetPromoByCode)
}
