package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterCustomerRoutes registers endpoints available to customers.
func RegisterCustomerRoutes(group *gin.RouterGroup, products *controllers.ProductController, categories *controllers.CategoryController, tables *controllers.TableController, orders *controllers.OrderController, payments *controllers.PaymentController, reservations *controllers.ReservationController) {
	customer := group.Group("/customer")

	customer.GET("/products", products.GetAll)
	customer.GET("/products/:id", products.GetByID)
	customer.GET("/categories", categories.GetAll)
	customer.GET("/tables", tables.GetAll)
	customer.GET("/tables/number/:number", tables.GetByNumber)
	customer.GET("/tables/:id", tables.GetByID)
	customer.POST("/orders", orders.Create)
	customer.GET("/orders/:id", orders.GetByID)
	customer.POST("/payments", payments.Create)
	customer.POST("/reservations", reservations.Create)
}
