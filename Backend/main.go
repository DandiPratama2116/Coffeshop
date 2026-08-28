package main

import (
	"log"
	"net/http"

	"backend/config"
	"backend/controllers"
	"backend/internal"
	"backend/middleware"
	"backend/routes"
	"backend/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration dari .env
	cfg := config.LoadConfig()

	// Connect ke database MySQL
	db := config.ConnectDatabase(cfg)

	// Pastikan database berhasil digunakan
	if db == nil {
		log.Fatal("Database connection failed")
	}
	if err := db.AutoMigrate(&internal.Admin{}, &internal.AdminSession{}, &internal.Location{}, &internal.Table{}, &internal.Category{}, &internal.Product{}, &internal.Reservation{}, &internal.Order{}, &internal.OrderItem{}, &internal.Payment{}); err != nil {
		log.Fatal("Failed to prepare database tables:", err)
	}
	if err := config.EnsureDefaultAdmin(db); err != nil {
		log.Fatal("Failed to prepare default admin:", err)
	}
	if err := config.SeedDummyData(db); err != nil {
		log.Fatal("Failed to seed dummy data:", err)
	}

	// Membuat Gin router
	router := gin.Default()
	router.Use(middleware.CORS())
	authController := controllers.NewAuthController(services.NewAuthService(db))
	dashboardController := controllers.NewDashboardController(services.NewDashboardService(db))
	productController := controllers.NewProductController(services.NewProductService(db))
	categoryController := controllers.NewCategoryController(services.NewCategoryService(db))
	tableController := controllers.NewTableController(services.NewTableService(db))
	orderController := controllers.NewOrderController(services.NewOrderService(db))
	paymentController := controllers.NewPaymentController(services.NewPaymentService(db))
	reportController := controllers.NewReportController(services.NewReportService(db))
	reservationController := controllers.NewReservationController(services.NewReservationService(db))
	api := router.Group("/api")
	routes.RegisterAdminRoutes(api, authController, dashboardController, productController, categoryController, tableController, orderController, paymentController, reportController, reservationController)
	routes.RegisterCustomerRoutes(api, productController, categoryController, tableController, orderController, paymentController, reservationController)

	// Test endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Coffee Shop API berhasil berjalan",
		})
	})

	// Menjalankan server
	log.Println("Server running on port", cfg.AppPort)

	err := router.Run(":" + cfg.AppPort)

	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
