-- Database: web_ban_hang_tai_nha

CREATE DATABASE IF NOT EXISTS `web_ban_hang_tai_nha` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `web_ban_hang_tai_nha`;

-- 1. Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100),
    `role` ENUM('admin', 'staff') DEFAULT 'staff',
    `status` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products table
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT,
    `sku` VARCHAR(50) UNIQUE,
    `name` VARCHAR(200) NOT NULL,
    `alias` VARCHAR(255), -- Search friendly name
    `unit` VARCHAR(50),
    `cost_price` DECIMAL(15, 2) DEFAULT 0,
    `selling_price` DECIMAL(15, 2) DEFAULT 0,
    `stock_quantity` INT DEFAULT 0,
    `min_stock` INT DEFAULT 10,
    `description` TEXT,
    `image` VARCHAR(255),
    `status` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- 4. Customers table
CREATE TABLE IF NOT EXISTS `customers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15),
    `address` TEXT,
    `debt` DECIMAL(15, 2) DEFAULT 0,
    `note` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Suppliers table
CREATE TABLE IF NOT EXISTS `suppliers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15),
    `address` TEXT,
    `email` VARCHAR(100),
    `supply_items` TEXT,
    `note` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Purchase Orders table (Stock In)
CREATE TABLE IF NOT EXISTS `purchase_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `supplier_id` INT,
    `user_id` INT,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `total_amount` DECIMAL(15, 2) DEFAULT 0,
    `status` ENUM('completed', 'draft', 'cancelled') DEFAULT 'completed',
    `note` TEXT,
    FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 7. Purchase Order Details table
CREATE TABLE IF NOT EXISTS `purchase_order_details` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `po_id` INT,
    `product_id` INT,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(15, 2) NOT NULL,
    `subtotal` DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- 8. Sales Orders table (Invoices)
CREATE TABLE IF NOT EXISTS `sales_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT DEFAULT NULL, -- NULL for walk-in customers
    `user_id` INT,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `total_amount` DECIMAL(15, 2) DEFAULT 0,
    `discount` DECIMAL(15, 2) DEFAULT 0,
    `final_amount` DECIMAL(15, 2) DEFAULT 0,
    `paid_amount` DECIMAL(15, 2) DEFAULT 0,
    `change_amount` DECIMAL(15, 2) DEFAULT 0,
    `payment_method` ENUM('cash', 'transfer', 'credit') DEFAULT 'cash',
    `status` ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    `note` TEXT,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 9. Sales Order Details table
CREATE TABLE IF NOT EXISTS `sales_order_details` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `so_id` INT,
    `product_id` INT,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(15, 2) NOT NULL,
    `subtotal` DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (`so_id`) REFERENCES `sales_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- 10. Inventory Logs table
CREATE TABLE IF NOT EXISTS `inventory_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT,
    `type` ENUM('in', 'out', 'adjust') NOT NULL,
    `quantity` INT NOT NULL,
    `reference_id` INT, -- PO ID or SO ID
    `note` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- 11. Settings table
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(50) UNIQUE NOT NULL,
    `setting_value` TEXT,
    `description` VARCHAR(255)
);

-- Seed Initial Data
INSERT INTO `users` (`username`, `password`, `full_name`, `role`) VALUES 
('admin', '$2b$10$NxagxgH0Vtw7QHwAFXrsH.oolZE0W7LJtF0tGTG.3FHVL9.vUPHF.', 'Quản trị viên', 'admin'),
('staff', '$2b$10$NxagxgH0Vtw7QHwAFXrsH.wwfCfzeBRpJQtxZGAEyZObbwTLRTx3K', 'Nhân viên bán hàng', 'staff');
-- Admin: admin / admin123
-- Staff: staff / staff123

INSERT INTO `categories` (`name`, `description`) VALUES 
('Tạp hóa', 'Các mặt hàng thực phẩm, đồ khô'),
('Điện nước', 'Vật tư điện, ống nước, thiết bị vệ sinh'),
('Đồ gia dụng', 'Nồi, chảo, bát đĩa, thiết bị nhỏ'),
('Hàng tiêu dùng', 'Bột giặt, dầu gội, nước tẩy rửa');

INSERT INTO `settings` (`setting_key`, `setting_value`, `description`) VALUES 
('store_name', 'Cửa Hàng Gia Đình', 'Tên cửa hàng'),
('store_address', '123 Đường ABC, Việt Nam', 'Địa chỉ cửa hàng'),
('store_phone', '0901234567', 'Số điện thoại');
