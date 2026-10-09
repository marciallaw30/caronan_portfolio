<?php
session_start();
// Security Check: Only admins can access
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';
$message = '';
// Retrieve employeeNo from GET parameter initially
$employeeNoToUpdate = $_GET['employeeNo'] ?? '';
$employeeData = null;

// --- A. Handle POST request (Form Submission) ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['employeeNo']) && isset($_POST['new_status'])) {
    // Overwrite with POST data for consistency
    $employeeNoToUpdate = $_POST['employeeNo'];
    $newStatus = $_POST['new_status'];
    
    // Validate status input against allowed values
    $allowedStatuses = ['active', 'leave', 'resign', 'disease', 'awol'];
    if (!in_array($newStatus, $allowedStatuses)) {
        $message = "Invalid status selected.";
    } else {
        // Update the employee status
        $update_sql = "UPDATE employees SET status = ? WHERE employeeNo = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ss", $newStatus, $employeeNoToUpdate);
        
        if ($update_stmt->execute()) {
            // Set success message in session before redirect
            $_SESSION['message'] = "Employee " . htmlspecialchars($employeeNoToUpdate) . " status updated to **" . ucfirst($newStatus) . "** successfully.";
            // Redirect back to the employee list with a success message
            header("Location: manage_employees.php");
            exit();
        } else {
            $message = "Error updating status: " . $update_stmt->error;
        }
        $update_stmt->close();
    }
}

// --- B. Fetch employee data for display (GET request or failed POST) ---
if (!empty($employeeNoToUpdate)) {
    // Need to re-connect if the connection was closed during a failed POST attempt
    if (!$conn || $conn->connect_error) {
        include 'db_conn.php';
    }
    
    $sql_fetch = "SELECT firstName, lastName, status FROM employees WHERE employeeNo = ?";
    $stmt_fetch = $conn->prepare($sql_fetch);
    $stmt_fetch->bind_param("s", $employeeNoToUpdate);
    $stmt_fetch->execute();
    $result_fetch = $stmt_fetch->get_result();
    $employeeData = $result_fetch->fetch_assoc();
    $stmt_fetch->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Employee Status</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .status-container {
            max-width: 450px;
            margin: 50px auto;
            padding: 30px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .current-status {
            font-size: 1.1em;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .message-error {
            color: #dc3545;
            margin-bottom: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <h1>Update Employee Status</h1>
    </header>
    <div class="status-container">
        <?php if (!empty($message)): ?>
            <p class="message-error"><?php echo htmlspecialchars($message); ?></p>
        <?php endif; ?>

        <?php if ($employeeData): ?>
            <h3>Change status for: <?php echo htmlspecialchars($employeeData['firstName'] . ' ' . $employeeData['lastName']); ?></h3>
            <p>Employee No: **<?php echo htmlspecialchars($employeeNoToUpdate); ?>**</p>
            <div class="current-status">
                Current Status: <?php echo htmlspecialchars(ucfirst($employeeData['status'])); ?>
            </div>
            
            <form method="POST" action="update_employee_status.php">
                <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($employeeNoToUpdate); ?>">
                
                <div class="input-group">
                    <label for="new_status">Select New Status</label>
                    <select id="new_status" name="new_status" required style="width: 100%; padding: 10px; margin-top: 5px;">
                        <option value="active" <?php echo ($employeeData['status'] == 'active') ? 'selected' : ''; ?>>Active</option>
                        <option value="leave" <?php echo ($employeeData['status'] == 'leave') ? 'selected' : ''; ?>>On Leave</option>
                        <option value="resign" <?php echo ($employeeData['status'] == 'resign') ? 'selected' : ''; ?>>Resigned</option>
                        <option value="disease" <?php echo ($employeeData['status'] == 'disease') ? 'selected' : ''; ?>>Disease/Medical</option>
                        <option value="awol" <?php echo ($employeeData['status'] == 'awol') ? 'selected' : ''; ?>>AWOL</option>
                    </select>
                </div>
                <button type="submit" style="margin-top: 15px;">Update Status</button>
            </form>
        <?php else: ?>
            <p>Employee not found or no employee selected.</p>
        <?php endif; ?>

        <div style="text-align: center; margin-top: 20px;">
            <a href="manage_employees.php" class="back-link">← Back to Manage Employees</a>
        </div>
    </div>
</body>
</html>