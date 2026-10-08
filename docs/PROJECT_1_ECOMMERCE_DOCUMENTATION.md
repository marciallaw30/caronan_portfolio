# Technical System Documentation & README
## Project 1: Enterprise E-Commerce Web Application
**Lead Developer:** Marcial Lawrence Jr V. Caronan  
**Program:** Bachelor of Science in Information Technology (BSIT)  
**Institution:** Datamex College of Saint Adeline (DCSA)  

---

## 1. Project Overview & Problem Statement

### 1.1 Overview
The **Enterprise E-Commerce Web Application** is a full-featured digital retail and inventory orchestration platform. It is engineered to bridge online customer purchasing with backend warehouse inventory synchronization, automated payment verification, and order dispatch tracking.

### 1.2 Problem Statement
Traditional small-to-medium retail operations in the Philippines often suffer from:
1. **Overselling & Inventory Race Conditions:** Inaccurate manual stock updates cause multiple customers to purchase out-of-stock items simultaneously.
2. **Disconnected Payment Reconciliation:** Cashier verification of proof-of-payment receipts is manual, error-prone, and slow.
3. **Disjointed Customer Communications:** Order status updates rely on third-party SMS or messaging apps rather than a unified portal.
4. **Data Security Vulnerabilities:** Exposure to Insecure Direct Object References (IDOR) and SQL Injection attacks in order lookups.

This project solves these operational bottlenecks by integrating atomic database transactions, secure payment gateway webhooks, an interactive administration dashboard, and direct customer-store messaging.

---

## 2. Project Objectives & Target Users

### 2.1 Core Objectives
- Provide a responsive, multi-device catalog allowing customers to search, filter, and purchase products.
- Integrate automated online payment processing (PayPal / PayMongo API) with cryptographic signature validation.
- Implement real-time order lifecycle tracking (`Pending` -> `Paid` -> `Processing` -> `Dispatched` -> `Delivered`).
- Maintain atomic stock decrements via MySQL database transactions (`ACID`) to eliminate overselling.
- Deliver an executive admin panel for store owners to monitor daily sales velocity, inventory re-order alerts, and customer inquiries.

### 2.2 Target Users
- **End Consumers / Customers:** Individuals browsing catalog items, placing orders, executing digital payments, and tracking deliveries.
- **Store Owners & Inventory Managers:** Personnel managing SKU catalogs, monitoring real-time stock levels, and replying to inquiries.
- **System Administrators:** Technical staff auditing access logs, user roles, and database integrity.

---

## 3. Technologies Used

| Layer | Technologies | Justification |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3 | Rapid responsive prototyping, mobile-first compatibility, accessible UX. |
| **Backend Logic** | PHP 8.2 & Python Scripts | High-performance server-side routing, session management, and scheduled automation scripts. |
| **Database** | MySQL / MariaDB (InnoDB Engine) | ACID compliance, foreign key integrity, row-level locking for inventory operations. |
| **Security Layer** | PDO Prepared Statements, Bcrypt, HMAC-SHA256 | SQL Injection immunity, secure password hashing, and webhook tamper verification. |
| **APIs & Data Interchange** | RESTful JSON, Fetch API | Asynchronous client-server communication without page reloads. |

---

## 4. Key System Features

1. **Multi-Role Authentication & Access Control:**
   - Role-Based Access Control (RBAC) segregating Customer, Merchant, and Administrator portals.
   - Passwords secured using PHP `password_hash()` with `PASSWORD_BCRYPT` (Cost factor 12).
2. **Real-Time Dynamic Inventory Management:**
   - Automatic deduction of stock levels upon verified payment.
   - Configurable low-stock thresholds triggering red warning badges on the admin dashboard.
3. **Secure Payment Gateway & Webhook Engine:**
   - Integration with digital payment sandbox environments.
   - HMAC-SHA256 signature verification on inbound webhooks to prevent forged order payment confirmations.
4. **Order Lifecycle & Delivery Tracking:**
   - Unique tracking numbers (e.g., `ORD-2026-XXXX`) allowing buyers to inspect live parcel dispatch stages.
5. **Customer-Owner Communication Hub:**
   - Threaded messaging module attached to specific order IDs for return requests and item inquiries.
6. **Executive Analytics Dashboard:**
   - Sales revenue metrics, monthly turnover charts, and inventory stock-out risk indicators.

---

## 5. System Architecture & Database Design (ERD)

### 5.1 Architecture Diagram
```
[ Client Browser (Customer / Admin) ]
              │  ▲ (HTTPS / JSON)
              ▼  │
      [ Web Server / Apache ]
              │  ▲
              ▼  │ (PHP Controllers / Auth Middleware)
   [ Business Logic & Security Engine ]
      ├── PDO Parameterized Queries
      ├── HMAC Webhook Verification
      └── Session RBAC Validator
              │  ▲
              ▼  │ (InnoDB Row-Level Locking)
      [ MySQL Database (3NF) ]
```

### 5.2 Relational Database Schema (Normalized to 3NF)

```sql
-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    delivery_address TEXT,
    role ENUM('customer', 'merchant', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    category VARCHAR(50),
    image_url VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('pending', 'paid', 'processing', 'dispatched', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('online_gateway', 'cod') NOT NULL,
    payment_reference VARCHAR(100),
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Order Items Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_at_purchase DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Customer Messages Table
CREATE TABLE order_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

---

## 6. Installation, Usage & Testing Procedures

### 6.1 Installation Requirements
- PHP 8.0 or higher
- MySQL / MariaDB 10.4 or higher
- Apache Web Server (XAMPP / WAMP / LAMP)
- Modern web browser (Chrome, Edge, Firefox)

### 6.2 Deployment Steps
1. Clone the repository into your web server's root directory:
   ```bash
   git clone https://github.com/marcialcaronan/ecommerce-web-app.git
   ```
2. Import the database schema into MySQL using phpMyAdmin or CLI:
   ```bash
   mysql -u root -p ecommerce_db < database/schema.sql
   ```
3. Configure the database credentials in `config/database.php`:
   ```php
   $host = 'localhost';
   $db   = 'ecommerce_db';
   $user = 'root';
   $pass = '';
   ```
4. Access the application in your browser:
   `http://localhost/ecommerce-web-app/`

### 6.3 Test Cases & Results
| Test ID | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Attempt SQL Injection in Login (`' OR '1'='1`) | Login rejected; query treated as literal string | Rejected with HTTP 401 | **PASSED** |
| **TC-02** | Simultaneous checkout of last inventory unit | One order succeeds, second receives out-of-stock warning | Atomic transaction locks row; second order rejected | **PASSED** |
| **TC-03** | Webhook verification with invalid HMAC key | Webhook rejects execution and logs unauthorized attempt | HTTP 403 Forbidden returned | **PASSED** |
| **TC-04** | Access order belonging to another customer | Access blocked; user can only view their own invoice | HTTP 403 Forbidden returned | **PASSED** |
