# Cybersecurity Case Study & AI Usage Audit Log
**Author:** Marcial Lawrence Jr V. Caronan  
**Program:** Bachelor of Science in Information Technology (BSIT)  
**Institution:** Datamex College of Saint Adeline (DCSA)  

---

# PART 1: Cybersecurity Case Study
## Subject: Mitigating Insecure Direct Object References (IDOR) & SQL Injection (SQLi) in E-Commerce Transactions

---

### 1. Executive Summary
In e-commerce architectures, order tracking and receipt generation endpoints are prime targets for unauthorized data exfiltration. Two of the most prevalent vulnerabilities affecting web applications are **Insecure Direct Object References (IDOR)** and **SQL Injection (SQLi)**. 

When user-supplied identifiers are trusted without cryptographic sanitization and session-bound authorization checks, malicious actors can view arbitrary customer records, steal personal identifiable information (PII), or compromise the entire database server.

---

### 2. Anatomy of the Vulnerabilities

#### A. The IDOR Vulnerability (Broken Object Level Authorization)
- **Mechanism:** The application accepts an `order_id` directly from user input (e.g., query parameters or POST bodies) and queries the database without verifying whether the currently logged-in user owns that specific order record.
- **Attack Scenario:**
  1. Attacker (Customer A, User ID 405) purchases an item and receives invoice URL:
     `https://store.example.com/view_invoice.php?order_id=1089`
  2. Attacker modifies the URL parameter:
     `https://store.example.com/view_invoice.php?order_id=1088`
  3. The server immediately returns Customer B's complete invoice, including full name, home address, phone number, and purchased items.

#### B. The SQL Injection Vulnerability
- **Mechanism:** If the input parameter is concatenated directly into the dynamic SQL query string without pre-compilation, an attacker can append SQL syntax to alter the query logic.
- **Attack Scenario:**
  ```sql
  -- Insecure query in backend:
  $sql = "SELECT * FROM orders WHERE order_id = " . $_GET['order_id'];

  -- Attacker payload:
  order_id = 1088 UNION SELECT 1, user(), password_hash, 4, 5, 6, 7 FROM users--
  ```
  The database dumps administrative password hashes directly into the HTML invoice table.

---

### 3. Vulnerable vs. Defensive Implementation (Code Comparison)

#### Insecure Code (Vulnerable to IDOR and SQLi):
```php
<?php
// INSECURE: Vulnerable to both SQL Injection and IDOR
session_start();
require_once 'db.php';

$order_id = $_GET['order_id']; // Untrusted input

// Directly concatenated into query without parameterization or user ownership check
$query = "SELECT * FROM orders WHERE order_id = '$order_id'";
$result = mysqli_query($conn, $query);

if ($row = mysqli_fetch_assoc($result)) {
    // Displays invoice regardless of who requested it!
    echo "<h1>Invoice for Order #" . htmlspecialchars($row['order_id']) . "</h1>";
    echo "<p>Recipient: " . htmlspecialchars($row['recipient_name']) . "</p>";
    echo "<p>Shipping Address: " . htmlspecialchars($row['shipping_address']) . "</p>";
}
?>
```

#### Secure Defense (PDO Parameterized Query + Strict Ownership Authorization):
```php
<?php
// SECURE: Enforces strict session authentication, role checks, and PDO parameter binding
session_start();
require_once 'db.php';

// 1. Mandatory Authentication Check
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('Error: Unauthorized access. Please log in.');
}

$user_id = (int)$_SESSION['user_id'];
$is_admin = ($_SESSION['role'] === 'admin');

// 2. Validate and Cast Input Parameter
$order_id = filter_input(INPUT_GET, 'order_id', FILTER_VALIDATE_INT);
if (!$order_id) {
    http_response_code(400);
    exit('Error: Invalid Order Identifier.');
}

// 3. Defensive Query with Prepared Statements & Bound Parameters
// The WHERE clause mandates that EITHER the user is an Admin OR the customer_id matches!
$sql = "SELECT o.order_id, o.total_amount, o.order_status, o.shipping_address, u.full_name 
        FROM orders o
        JOIN users u ON o.customer_id = u.user_id
        WHERE o.order_id = :order_id 
        AND (:is_admin = 1 OR o.customer_id = :user_id)
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'order_id' => $order_id,
    'is_admin' => ($is_admin ? 1 : 0),
    'user_id'  => $user_id
]);

$order = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$order) {
    // Returns 404/403 to avoid disclosing whether the order ID even exists
    http_response_code(403);
    exit('Error: You do not have permission to access this order record.');
}

// Render secure data safely
echo "<h1>Invoice for Order #" . htmlspecialchars($order['order_id'], ENT_QUOTES, 'UTF-8') . "</h1>";
echo "<p>Recipient: " . htmlspecialchars($order['full_name'], ENT_QUOTES, 'UTF-8') . "</p>";
echo "<p>Shipping Address: " . htmlspecialchars($order['shipping_address'], ENT_QUOTES, 'UTF-8') . "</p>";
?>
```

---

### 4. Comprehensive Defense-in-Depth Strategy
1. **Parameterized Queries (PDO):** Treat all inputs strictly as data literals; SQL engine compiles query structure before parameters are bound.
2. **Session-Level Object Ownership Verification:** Never authorize actions based solely on client-submitted record IDs. Always cross-verify ownership against immutable session cookies.
3. **Principle of Least Privilege (PoLP):** Configure database user credentials with minimal permissions (e.g., `SELECT`, `INSERT`, `UPDATE` on specific tables only; revoke `DROP`, `ALTER`, or `FILE` privileges).
4. **Context-Aware Output Escaping:** Use `htmlspecialchars($str, ENT_QUOTES, 'UTF-8')` to neutralize Cross-Site Scripting (XSS) vectors.

---

# PART 2: Responsible AI Usage Audit Log
**Guiding Principle:** AI tools serve as collaborative engineering accelerators; every generated snippet must be empirically audited, verified against official documentation, and tested under real execution conditions.

| Log ID | Date | Development Milestone | AI Prompt & Tool Used | AI-Assisted Output | Human Verification & Testing Procedure | Final Engineering Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AI-01** | Oct 2026 | E-Commerce Payment Gateway Webhook | *"Write a PHP script to verify an HMAC-SHA256 signature from an incoming webhook request body."* (Claude / ChatGPT) | Generated a skeleton script using `hash_hmac()` with `json_encode($data)` as the payload argument. | **Identified Flaw:** Re-encoded JSON caused key ordering and whitespace shifts, breaking signature parity. <br>**Fix:** Refactored code to read raw byte stream via `file_get_contents('php://input')`. | 100% reliable webhook validation against payment sandbox. |
| **AI-02** | Sep 2026 | Employee Management System (Payroll Module) | *"Draft a MySQL query that calculates monthly gross pay, late deductions, and SSS contributions based on an employee hourly rate."* | Provided an SQL query with multiple subqueries and static deduction thresholds. | **Identified Flaw:** SSS contribution brackets were based on outdated 2020 table rates. <br>**Fix:** Updated brackets to match current 2024–2026 Philippine SSS statutory schedules. | Accurate payroll calculation verified against official manual pay slips. |
| **AI-03** | Aug 2026 | IoT Soil Monitoring System | *"Provide an Arduino C++ algorithm to smooth analog capacitive moisture sensor readings and trigger an alarm."* | Suggested a basic rolling average filter array with floating-point arithmetic. | **Identified Flaw:** Floating-point operations on Arduino Uno created memory overhead. <br>**Fix:** Converted arithmetic to integer-based scaled math and verified ADC sensor calibration in physical moist soil. | Responsive, low-memory sensor sampling on ATmega328P. |
| **AI-04** | Jul 2026 | Portfolio Website CSS Architecture | *"Create a glassmorphic dark theme CSS design system with an electric blue palette inspired by high-end tech agencies."* | Generated CSS custom properties, backdrop filters, and gradient utilities. | Audited cross-browser compatibility; added fallback solid backgrounds for browsers with disabled backdrop-filter and verified high-contrast readability. | Sleek, modern, performant visual design system. |
