# IT Troubleshooting & Diagnostic Case Portfolio
**Student Candidate:** Marcial Lawrence Jr V. Caronan  
**Degree:** Bachelor of Science in Information Technology (BSIT)  
**Institution:** Datamex College of Saint Adeline (DCSA)  

---

## CASE 01: Barcode Scanner Hardware Handshake & Buffer Overflow in Warehouse Dispatch

### 1. Problem Statement
During peak dispatch hours at the supermarket warehouse terminal, high-speed USB barcode scanners began dropping digits from 14-digit Global Trade Item Numbers (GTIN) or inserting corrupted ASCII characters (e.g., `4800012??5678`), causing shipment barcode validation to fail and stopping pallet dispatching.

### 2. Possible Causes
1. **Serial-to-USB Keyboard Emulation Buffer Overflow:** The scanner's internal transmission delay (inter-character delay) was set to 0ms, overwhelming the operating system's keyboard buffer.
2. **Missing EOL Terminator:** Lack of an automatic Carriage Return / Line Feed (`CR/LF`) suffix causing consecutive scans to concatenate on a single line.
3. **Electromagnetic Interference (EMI):** Unshielded USB cable run near high-voltage conveyor motors.

### 3. Diagnostic Procedure
1. Connected the barcode scanner to a clean test workstation running a plain text editor (`Notepad`) and a serial port monitor (`PuTTY`).
2. Performed rapid consecutive scans of standardized Code 128 and EAN-13 barcodes.
3. Observed that when scanning at speed, characters dropped after the 8th digit, confirming a buffer overrun rather than optical sensor degradation.

### 4. Solution
1. Scanned the manufacturer programming barcodes to reconfigure the scanner:
   - Set the inter-character delay to **20ms** to allow the OS input buffer to flush between bytes.
   - Appended a persistent **CR/LF suffix** to ensure automated enter keystrokes after every scan.
2. Replaced the unshielded USB cable with a ferrite-choked, shielded USB cable.

### 5. Lesson Learned
Hardware input peripherals must always be calibrated with sufficient transmission delay tolerances to prevent input race conditions on high-throughput data entry terminals.

---

## CASE 02: Kitchen / POS Order Display Monitor Freeze During Peak Volume Hours

### 1. Problem Statement
The order-taking display monitor at the fast-food station froze every day during the lunch rush (12:00 PM – 1:30 PM). The screen failed to clear completed tickets and refused to display incoming drive-thru orders, forcing managers to power-cycle the physical terminal.

### 2. Possible Causes
1. **JavaScript Memory Leak in Polling Script:** Detached DOM nodes accumulating in the browser instance without explicit garbage collection.
2. **Unmanaged WebSocket Reconnection Storm:** Continuous reconnection loops flooding the local network adapter upon transient packet drops.
3. **Hardware Overheating:** Thin-client POS terminal passively cooled with clogged exhaust ports.

### 3. Diagnostic Procedure
1. Remotely accessed the terminal using PowerShell during operation: `Get-Process | Sort-Object WorkingSet64 -Descending`.
2. Found the Chrome rendering process consuming 3.6 GB of RAM with CPU pegged at 99%.
3. Inspected the browser DevTools Memory panel; discovered over 8,500 detached HTML table elements persisting in memory because event listeners were never unbound upon ticket dismissal.

### 4. Solution
1. Refactored the frontend ticket rendering script:
   - Implemented a circular queue capping active displayed orders to the 50 most recent tickets.
   - Explicitly unlinked DOM nodes and event listeners upon order completion:
     ```javascript
     function dismissTicket(element, eventHandler) {
         element.removeEventListener('click', eventHandler);
         element.remove();
     }
     ```
2. Scheduled an automated daily lightweight browser refresh at 4:00 AM.

### 5. Lesson Learned
Continuous-duty display terminals must be engineered with defensive client-side memory management, as uncollected DOM elements inevitably lead to memory exhaustion.

---

## CASE 03: MySQL Relational Database Connection Starvation & Pool Timeouts

### 1. Problem Statement
During promotional e-commerce traffic spikes, the web application crashed with HTTP 500 error:  
`SQLSTATE[HY000] [1040] Too many connections`  
All subsequent customer checkout attempts were denied.

### 2. Possible Causes
1. **Unclosed PDO Connections:** Backend PHP scripts instantiated new database connection objects inside loops without closing them.
2. **Default MySQL Configuration Limits:** Default `max_connections = 151` insufficient for concurrent checkout threads.
3. **Zombie / Sleeping Threads:** Long `wait_timeout` allowing idle connections to linger indefinitely.

### 3. Diagnostic Procedure
1. Connected to the MySQL server via terminal: `mysqladmin -u root -p processlist`.
2. Noticed 148 active threads with `Command: Sleep` and `Time > 280`, indicating clients were holding connections open after script termination.
3. Inspected `php_error.log` and traced the leak to an unclosed database handle in the cart checkout controller.

### 4. Solution
1. Re-architected database access into a strict Singleton Pattern with connection re-use:
   ```php
   class Database {
       private static $instance = null;
       public static function getInstance() {
           if (self::$instance === null) {
               self::$instance = new PDO("mysql:host=localhost;dbname=ecommerce_db", "user", "pass", [
                   PDO::ATTR_PERSISTENT => false,
                   PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
               ]);
           }
           return self::$instance;
       }
   }
   ```
2. Tuned `my.cnf`:
   - Increased `max_connections = 400`
   - Decreased `wait_timeout = 30` (dropped sleeping threads from 28800s to 30s)
   - Decreased `interactive_timeout = 30`

### 5. Lesson Learned
Database connections are finite, high-cost resources; applications must leverage connection reuse and aggressive timeout reclamation to remain resilient under traffic surges.

---

## CASE 04: High-Volume Inventory Spreadsheet Formula Corruption & Circular References

### 1. Problem Statement
A 15,000-row warehouse inventory master spreadsheet in MS Excel began displaying `#REF!` errors across all calculated fields (Total Stock Valuation, Reorder Level, and Out-of-Stock Flags), preventing the generation of the weekly store replenishment dispatch report.

### 2. Possible Causes
1. **Manual Column Deletion:** A staff member deleted a helper column containing unit costs during a manual sort.
2. **Relative Reference Drift:** Inserting new SKU rows caused dynamic cell pointers (e.g., `=D2*E2`) to point to blank or textual headers.
3. **Circular Reference Loop:** A summary formula at the footer accidentally included its own cell in the summation range `=SUM(G2:G15002)`.

### 3. Diagnostic Procedure
1. Opened the workbook and checked Excel's bottom status bar, which flagged `Circular References: G15002`.
2. Utilized the **Formula Auditing Toolbar**:
   - Executed **Error Checking** to locate the origin of the `#REF!` cascade.
   - Used **Trace Precedents** to identify which deleted column triggered the lookup failure.

### 4. Solution
1. Restored the deleted Unit Cost column from the automated hourly backup archive.
2. Converted the raw spreadsheet data range into an **Excel Structured Table (`ListObject`)**:
   - Replaced fragile relative cell references with structured table references:
     `=[@[QuantityOnHand]] * [@[UnitCost]]`
   - Structured formulas automatically propagate to new rows without manual dragging or reference drift.
3. Enabled **Worksheet Protection**, locking all formula columns and allowing staff entry only in designated input fields (Quantity and SKU).

### 5. Lesson Learned
Operational spreadsheets must be engineered like software databases: using structured schema tables, strictly typed data validation, and cell protection to eliminate human operator corruption.

---

## CASE 05: E-Commerce Payment Gateway Webhook HMAC-SHA256 Signature Mismatch

### 1. Problem Statement
Customers completed credit card and e-wallet payments successfully through the payment provider sandbox, but the store database never transitioned order records from `Pending` to `Paid`. Orders remained stuck, preventing automatic dispatch.

### 2. Possible Causes
1. **JSON Re-Encoding Discrepancy:** The backend decoded the incoming webhook JSON and re-encoded it before computing the HMAC-SHA256 signature, causing key-order and whitespace variations.
2. **Incorrect Secret Key Environment:** Development environment utilizing the Live API secret key rather than the Sandbox Webhook Signing Secret.
3. **HTTP 301 Redirect Stripping Headers:** Server `.htaccess` redirecting `http://` to `https://`, dropping custom `X-Signature` headers during the redirect.

### 3. Diagnostic Procedure
1. Created an isolated webhook logging endpoint:
   ```php
   file_put_contents('webhook_debug.log', print_r([
       'headers' => getallheaders(),
       'raw_body' => file_get_contents('php://input')
   ], true));
   ```
2. Triggered a test webhook event from the payment provider dashboard.
3. Discovered that `hash_hmac('sha256', json_encode($data), $secret)` generated a different checksum than the provider's `X-Signature` header due to escaped forward slashes (`\/`).

### 4. Solution
1. Modified the signature verification code to compute HMAC strictly against the unmodified, raw binary input stream:
   ```php
   $rawPayload = file_get_contents('php://input');
   $receivedSignature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
   $calculatedSignature = hash_hmac('sha256', $rawPayload, WEBHOOK_SECRET);

   if (!hash_equals($calculatedSignature, $receivedSignature)) {
       http_response_code(401);
       exit('Invalid Signature');
   }
   // Proceed with order update
   ```
2. Used `hash_equals()` to provide timing-attack resistance.

### 5. Lesson Learned
Cryptographic signature validation on webhooks must always operate directly on the raw incoming byte stream, never on re-serialized or modified objects.
