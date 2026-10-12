-- =====================================================================
-- TAROTKNIGHT CRYSTAL ART - OFFICIAL RELATIONAL DATABASE SCHEMA (3NF)
-- Datamex College of Saint Adeline - Parañaque City
-- Bachelor of Science in Information Technology | Course: E-Business
-- Research Lead: Marcial Lawrence Jr V. Caronan & Team
-- Faculty Adviser: Mr. Randy Villanueva
-- Engine: MySQL 8.0+ / MariaDB 10.4+ | InnoDB | utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `tarotknight_db` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `tarotknight_db`;

-- ---------------------------------------------------------------------
-- TABLE 1: users (Central Identity & Role Access Hub)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(30) DEFAULT NULL,
  `role` ENUM('customer', 'practitioner', 'admin') NOT NULL DEFAULT 'customer',
  `delivery_address` TEXT DEFAULT NULL,
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 2: products (Handcrafted Crystal Catalog & Real-Time Stock)
-- Categories: Pendants, Bracelets, Rings, Earrings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `product_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('Pendants', 'Bracelets', 'Rings', 'Earrings') NOT NULL,
  `chakra` VARCHAR(80) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT UNSIGNED NOT NULL DEFAULT 5,
  `tag` VARCHAR(50) DEFAULT 'Artisan Handcrafted',
  `image_url` VARCHAR(255) NOT NULL,
  `wire_material` VARCHAR(150) NOT NULL,
  `metaphysical_meaning` TEXT NOT NULL,
  `cleansing_ritual` VARCHAR(255) DEFAULT 'Full Moon Light, Selenite Slab',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 3: orders (Fintech & J&T Express Logistics Fulfillment)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` VARCHAR(30) PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(120) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `delivery_address` TEXT NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 120.00,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` VARCHAR(80) NOT NULL DEFAULT 'PayMongo (GCash / Maya / Card)',
  `paymongo_session_id` VARCHAR(120) DEFAULT NULL,
  `status` ENUM('Pending', 'Paid', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `courier` VARCHAR(80) NOT NULL DEFAULT 'J&T Express Philippines',
  `tracking_number` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 4: order_items (Detailed Line-Item Breakdown)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `item_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(30) NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) 
    REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) 
    REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 5: bookings (Spiritual Consultations & Real-Time Calendar)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `booking_id` VARCHAR(30) PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `client_name` VARCHAR(120) NOT NULL,
  `client_email` VARCHAR(150) NOT NULL,
  `client_phone` VARCHAR(30) DEFAULT NULL,
  `service_type` VARCHAR(100) NOT NULL,
  `booking_date` DATE NOT NULL,
  `booking_time` VARCHAR(50) NOT NULL,
  `fee` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `payment_method` VARCHAR(80) NOT NULL DEFAULT 'PayMongo Online Gateway',
  `paymongo_payment_id` VARCHAR(120) DEFAULT NULL,
  `practitioner_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_schedule_slot` (`booking_date`, `booking_time`),
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 6: reviews (Unified Polymorphic Feedback Architecture)
-- Nullable foreign keys support both Product feedback and Service feedback
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `review_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `product_id` INT UNSIGNED DEFAULT NULL,
  `booking_id` VARCHAR(30) DEFAULT NULL,
  `reviewer_name` VARCHAR(100) NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT NOT NULL,
  `context_type` ENUM('product', 'service') NOT NULL,
  `is_approved` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) 
    REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) 
    REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- TABLE 7: ai_knowledge_base (Spiritual Guide Pattern Matching Logic)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_knowledge_base`;
CREATE TABLE `ai_knowledge_base` (
  `kb_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `keywords` VARCHAR(255) NOT NULL,
  `spiritual_content` TEXT NOT NULL,
  `category` VARCHAR(60) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- SEED DATA: Administrative User & Lead Developer
-- ---------------------------------------------------------------------
INSERT INTO `users` (`full_name`, `email`, `password_hash`, `role`) VALUES
('Marcial Lawrence Jr V. Caronan', 'caronan.marcial@dcsa.edu.ph', '$2y$10$e8Fv2B7jZqK9WpY3G6xU7ue8hJ1K5mN9vB4cW2zY6xU7ue8hJ1K5m', 'admin'),
('Maria Santos', 'maria.santos@gmail.com', '$2y$10$w8Kv3B8jZqL9WpY4G7xV8vf9iK2L6nO0wC5dX3zZ7yV8vf9iK2L6n', 'customer');

-- ---------------------------------------------------------------------
-- SEED DATA: Flagship Crystal Products (Samples from 44 Authentic Items)
-- ---------------------------------------------------------------------
INSERT INTO `products` (`sku`, `name`, `category`, `chakra`, `price`, `stock`, `tag`, `image_url`, `wire_material`, `metaphysical_meaning`) VALUES
('TK-CRY-006', 'Stellar Rain: Labradorite Meteor Flash', 'Pendants', 'Third Eye & Crown', 1350.00, 6, 'Flagship Artisan', 'assets/crystals/6.png', 'Sculpted Sterling Silver-Tone Wire Wrap', 'Deflector of unwanted energies, awakening psychic abilities and spiritual self-discovery.'),
('TK-CRY-007', 'Timeless Devotion: Rose Quartz Heart', 'Pendants', 'Heart Chakra', 1150.00, 8, 'Unconditional Love', 'assets/crystals/7.png', 'Antiqued Copper & Rose Wire Weave', 'Symbolizes unconditional love, tender emotional healing, and gentle heart recovery.'),
('TK-CRY-008', 'The Onyx Nexus: Sovereign Shield', 'Pendants', 'Root Chakra', 1200.00, 5, 'Psychic Shield', 'assets/crystals/8.png', 'Heavy-Gauge Solid Copper Wire Wrap', 'A powerful shield of grounding and discipline, absorbing negative vibrational interference.'),
('TK-CRY-033', 'Golden Ember Ring: Carnelian Solitaire', 'Rings', 'Sacral Chakra', 850.00, 9, 'Artisan Ring', 'assets/crystals/33.png', 'Adjustable Tarnish-Resistant Copper Band', 'Wearable talisman of unstoppable creative motivation, vitality, and sensual confidence.'),
('TK-CRY-B01', 'Timeless Devotion: Rose Quartz Mala', 'Bracelets', 'Heart Chakra', 880.00, 12, 'Bestseller Bracelet', 'assets/crystals/7.png', 'Rose Gold Wire Accent & Elastic Core', 'Promotes self-compassion, relational harmony, and gentle calming of the nervous system.'),
('TK-CRY-E01', 'Aurora Tear: Labradorite Wire Earrings', 'Earrings', 'Third Eye & Throat', 920.00, 7, 'Hypoallergenic', 'assets/crystals/18.png', 'Hypoallergenic Antiqued Copper Wire Hooks', 'Blue-flash Labradorite teardrops wire-wrapped to inspire prophetic dreams and graceful speech.');

-- ---------------------------------------------------------------------
-- SEED DATA: Sample J&T Logistics Orders
-- ---------------------------------------------------------------------
INSERT INTO `orders` (`order_id`, `customer_name`, `customer_email`, `city`, `delivery_address`, `subtotal`, `shipping_fee`, `total_amount`, `payment_method`, `status`, `tracking_number`) VALUES
('TK-ORD-8941', 'Maria Santos', 'maria.santos@gmail.com', 'Parañaque City', '8167 Dr. A. Santos Ave, San Dionisio, Parañaque City', 1350.00, 120.00, 1470.00, 'PayMongo (GCash)', 'In Transit', 'JNT-PH-8201948291'),
('TK-ORD-8930', 'Joshua Reyes', 'joshua.reyes@gmail.com', 'Quezon City', '12 Katipunan Ave, Diliman, Quezon City', 2230.00, 120.00, 2350.00, 'PayMongo (Card)', 'Delivered', 'JNT-PH-7729104829');

-- ---------------------------------------------------------------------
-- SEED DATA: AI Knowledge Base Rules
-- ---------------------------------------------------------------------
INSERT INTO `ai_knowledge_base` (`keywords`, `spiritual_content`, `category`) VALUES
('labradorite, flash, aurora, stellar', 'Labradorite deflects unwanted psychic energies, balances the aura, and awakens innate spiritual intuition.', 'Crystals'),
('rose quartz, love, heart, devotion', 'Rose Quartz is the sovereign stone of unconditional love and heart healing. Softens grief and heals emotional trauma.', 'Crystals'),
('paymongo, payment, gcash, maya', 'PayMongo API gateway provides instant checkout with GCash, Maya, and Visa/Mastercard test credentials.', 'Fintech'),
('j&t, shipping, delivery, track', 'All packages are dispatched via J&T Express Philippines with real-time waybill tracking milestones.', 'Logistics');
