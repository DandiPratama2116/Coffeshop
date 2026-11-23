package config

import (
	"fmt"
	"log"

	"backend/internal"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDatabase(cfg Config) *gorm.DB {
	// Koneksi awal tanpa nama database untuk memastikan database ada / otomatis dibuat
	baseDSN := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort)
	serverDB, err := gorm.Open(mysql.Open(baseDSN), &gorm.Config{})
	if err == nil {
		createDBSQL := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cfg.DBName)
		if err := serverDB.Exec(createDBSQL).Error; err != nil {
			log.Printf("warning: failed to auto-create database %s: %v", cfg.DBName, err)
		}
		if sqlDB, err := serverDB.DB(); err == nil {
			_ = sqlDB.Close()
		}
	} else {
		log.Printf("info: connecting directly to database %s: %v", cfg.DBName, err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("warning: failed to connect to MySQL: %v", err)
		return nil
	}

	return db
}

func EnsureDefaultAdmin(db *gorm.DB) error {
	var count int64
	if err := db.Model(&internal.Admin{}).Where("username = ?", "admin").Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	hash, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return db.Create(&internal.Admin{Username: "admin", Name: "Admin Coffee Shop", PasswordHash: string(hash)}).Error
}
