CREATE DATABASE IF NOT EXISTS coffee_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE coffee_shop;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS `tables`;
DROP TABLE IF EXISTS locations;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB;

CREATE TABLE admin_sessions (
  id VARCHAR(36) NOT NULL,
  admin_id BIGINT UNSIGNED NOT NULL,
  login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  logout_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY idx_admin_sessions_admin (admin_id),
  CONSTRAINT fk_admin_sessions_admin
    FOREIGN KEY (admin_id) REFERENCES admins (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE locations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama_tempat VARCHAR(120) NOT NULL,
  keterangan TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE `tables` (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  table_number INT UNSIGNED NOT NULL,
  location_id BIGINT UNSIGNED NOT NULL,
  seating_area VARCHAR(40) NOT NULL DEFAULT 'Indoor',
  status ENUM('available', 'occupied') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tables_location_number (location_id, table_number),
  CONSTRAINT fk_tables_location
    FOREIGN KEY (location_id) REFERENCES locations (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE menus (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  nama_menu VARCHAR(150) NOT NULL,
  deskripsi TEXT NULL,
  harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  image VARCHAR(500) NULL,
  status ENUM('available', 'unavailable') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_menus_category (category_id),
  CONSTRAINT fk_menus_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE reservations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(80) NOT NULL,
  customer_email VARCHAR(191) NOT NULL,
  table_id BIGINT UNSIGNED NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_people INT NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reservations_table (table_id),
  CONSTRAINT fk_reservations_table
    FOREIGN KEY (table_id) REFERENCES `tables` (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(80) NOT NULL,
  table_id BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status ENUM('pending', 'processing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_table (table_id),
  CONSTRAINT fk_orders_table
    FOREIGN KEY (table_id) REFERENCES `tables` (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_menu (menu_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu
    FOREIGN KEY (menu_id) REFERENCES menus (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  transaction_id VARCHAR(191) NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_order (order_id),
  KEY idx_payments_status (payment_status),
  UNIQUE KEY uq_payments_transaction (transaction_id),
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO locations (nama_tempat, keterangan)
VALUES ('Coffee Shop Norma', 'Lokasi utama Coffee Shop Norma');

INSERT INTO categories (nama_kategori, deskripsi)
VALUES
  ('Coffee', 'Aneka minuman kopi'),
  ('Non-Coffee', 'Aneka minuman non-kopi'),
  ('Food', 'Aneka makanan'),
  ('Snacks', 'Aneka camilan'),
  ('Pastry & Dessert', 'Pastry dan hidangan penutup');

-- Insert mock menus
INSERT INTO menus (category_id, nama_menu, deskripsi, harga, image) VALUES
(1, 'Espresso', 'Kopi murni yang diekstrak dengan tekanan tinggi, menghasilkan rasa yang pekat dan aroma yang kuat.', 18000, '/assets/Menu/Espresso.jpeg'),
(1, 'Americano', 'Espresso dengan tambahan air panas, cocok untuk pecinta kopi hitam dengan rasa yang lebih ringan.', 20000, '/assets/Menu/Americano.jpeg'),
(1, 'Cappuccino', 'Paduan espresso, susu steam, dan foam tebal di atasnya. Rasa seimbang antara kopi dan susu.', 25000, '/assets/Menu/Capucino.jpeg'),
(1, 'Cafe Latte', 'Espresso dengan susu steam yang lembut dan sedikit foam. Lebih creamy dari cappuccino.', 25000, '/assets/Menu/Caffe Latte.jpeg'),
(1, 'Vanilla Latte', 'Cafe Latte dengan tambahan sirup vanilla yang manis dan wangi.', 28000, '/assets/Menu/Vanilla Latte.jpeg'),
(1, 'Caramel Macchiato', 'Susu steam dengan sirup vanilla, ditutup dengan espresso dan saus karamel di atasnya.', 30000, '/assets/Menu/Caramel Machiato.jpeg'),
(2, 'Sweet & Cream', 'Signature menu kami: Paduan susu creamy dengan resep rahasia yang manis dan lembut.', 35000, '/assets/Menu/Sweet&Cream.jpeg'),
(2, 'Matcha Latte', 'Serbuk matcha premium yang di-blend dengan susu segar, memberikan rasa teh hijau yang khas.', 28000, '/assets/Menu/Matcha Latte.jpeg'),
(2, 'Chocolate', 'Cokelat pekat pilihan yang dilarutkan dengan susu panas, manis dan menenangkan.', 25000, '/assets/Menu/Chocolate.jpeg'),
(2, 'Taro Latte', 'Rasa unik dari talas ungu (taro) berpadu dengan susu krim yang lembut.', 25000, '/assets/Menu/Taro Latte.jpeg'),
(2, 'Red Velvet', 'Minuman manis dengan cita rasa kue red velvet dan cream cheese yang gurih.', 28000, '/assets/Menu/Redvelvet.jpeg'),
(3, 'Nasi Goreng Spesial', 'Nasi goreng dengan bumbu khas, telur, ayam suwir, sosis, dan kerupuk.', 35000, '/assets/Menu/Nasi goreng spsial.jpeg'),
(3, 'Mie Goreng Gila', 'Mie goreng pedas dengan campuran sosis, bakso, telur, dan sayuran segar.', 30000, '/assets/Menu/MieGorengGila.jpeg'),
(3, 'Chicken Katsu', 'Daging ayam fillet berlapis tepung roti yang renyah, disajikan dengan saus katsu dan salad.', 38000, '/assets/Menu/Chciken Katsu.jpeg'),
(3, 'Spaghetti Carbonara', 'Pasta spaghetti dengan saus krim susu, keju, dan irisan smoked beef.', 42000, '/assets/Menu/SPAGHETI CARBONARA.jpeg'),
(3, 'Spaghetti Bolognese', 'Pasta spaghetti dengan saus tomat daging giling (bolognese) dan taburan keju parmesan.', 40000, '/assets/Menu/Spagheti Bolognize.jpeg'),
(4, 'French Fries', 'Kentang goreng renyah dengan taburan garam dan oregano.', 20000, '/assets/Menu/French Fries.jpeg'),
(4, 'Tahu Cabe Garam', 'Potongan tahu renyah yang ditumis dengan cabai, bawang putih, dan garam. Pedas gurih!', 22000, '/assets/Menu/Tahu cabe garam.jpeg'),
(4, 'Onion Rings', 'Bawang bombay iris berbalut tepung renyah, disajikan dengan saus tar-tar.', 25000, '/assets/Menu/Onion Ring.jpeg'),
(4, 'Nachos', 'Keripik jagung tortila dengan saus keju cair dan daging cincang.', 30000, '/assets/Menu/Nachos.jpeg'),
(4, 'Platter', 'Kombinasi sosis, kentang, dan nugget goreng dalam satu porsi besar.', 45000, '/assets/Menu/Plater.jpeg'),
(5, 'Croissant Butter', 'Roti croissant Prancis klasik dengan aroma butter yang kuat dan tekstur flaky.', 25000, '/assets/Menu/Croisant buter.jpeg'),
(5, 'Croffle', 'Paduan croissant dan waffle, disajikan dengan siraman sirup maple dan gula halus.', 28000, '/assets/Menu/Croffle.jpeg'),
(5, 'Cheese Cake', 'Kue keju lembut yang lumer di mulut, dengan dasar biskuit renyah.', 35000, '/assets/Menu/Cheese cake.jpeg'),
(5, 'Choco Lava', 'Kue cokelat hangat dengan isian cokelat cair yang meleleh saat dipotong.', 30000, '/assets/Menu/Choco lava.jpeg'),
(5, 'Tiramisu', 'Dessert klasik Italia dengan rasa kopi, mascarpone cheese, dan taburan bubuk kakao.', 35000, '/assets/Menu/Tiramisu.jpeg');
