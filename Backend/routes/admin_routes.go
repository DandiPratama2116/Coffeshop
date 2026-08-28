package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterAdminRoutes registers endpoints used by the admin panel.
func RegisterAdminRoutes(group *gin.RouterGroup, auth *controllers.AuthController, dashboard *controllers.DashboardController, products *controllers.ProductController, categories *controllers.CategoryController, tables *controllers.TableController, orders *controllers.OrderController, payments *controllers.PaymentController, reports *controllers.ReportController, reservations *controllers.ReservationController) {
	admin := group.Group("/admin")

	admin.POST("/login", auth.Login)
	admin.POST("/logout", auth.Logout)
	admin.GET("/dashboard", dashboard.GetDashboard)

	admin.GET("/products", products.GetAll)
	admin.GET("/products/:id", products.GetByID)
	admin.POST("/products", products.Create)
	admin.PUT("/products/:id", products.Update)
	admin.DELETE("/products/:id", products.Delete)

	admin.GET("/categories", categories.GetAll)
	admin.GET("/categories/:id", categories.GetByID)
	admin.POST("/categories", categories.Create)
	admin.PUT("/categories/:id", categories.Update)
	admin.DELETE("/categories/:id", categories.Delete)

	admin.GET("/tables", tables.GetAll)
	admin.GET("/tables/:id", tables.GetByID)
	admin.POST("/tables", tables.Create)
	admin.PUT("/tables/:id", tables.Update)
	admin.DELETE("/tables/:id", tables.Delete)

	admin.GET("/orders", orders.GetAll)
	admin.GET("/orders/:id", orders.GetByID)
	admin.POST("/orders", orders.Create)
	admin.PATCH("/orders/:id/status", orders.UpdateStatus)

	admin.GET("/payments", payments.GetAll)
	admin.GET("/payments/:id", payments.GetByID)
	admin.POST("/payments", payments.Create)
	admin.PATCH("/payments/:id/status", payments.UpdateStatus)

	admin.GET("/reports/sales", reports.GetSalesReport)
	admin.GET("/reports/best-selling", reports.GetBestSellingProducts)

	admin.GET("/reservations", reservations.GetAll)
	admin.PATCH("/reservations/:id/status", reservations.UpdateStatus)
}
