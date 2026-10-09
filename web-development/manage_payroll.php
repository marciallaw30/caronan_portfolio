<?php
session_start();
// Check for user login and admin status
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';

$message = '';
$employees = [];
$dateSubmitted = false;
$submittedStartDate = '';
$submittedEndDate = '';
$submittedPayDate = '';

// --- Enhanced Message Handling Logic (Unchanged) ---
if (isset($_SESSION['payroll_success'])) {
    $message = $_SESSION['payroll_success'];
    unset($_SESSION['payroll_success']);
} elseif (isset($_SESSION['payroll_error'])) {
    $message = $_SESSION['payroll_error'];
    unset($_SESSION['payroll_error']);
} elseif (isset($_GET['success_save'])) {
    $message = "Payslip saved successfully!";
} elseif (isset($_GET['success_delete'])) {
    $message = "Payslip deleted successfully.";
} elseif (isset($_GET['error'])) {
    $message = "An error occurred. Please try again.";
}

// --- NEW: DATE VALIDATION LOGIC ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['fetch_summary'])) {
    $submittedStartDate = $_POST['payPeriodStart'] ?? '';
    $submittedEndDate = $_POST['payPeriodEnd'] ?? '';
    $submittedPayDate = $_POST['payDaySchedule'] ?? '';
    $dateSubmitted = true;

    $payPeriodStartTimestamp = strtotime($submittedStartDate);
    $payPeriodEndTimestamp = strtotime($submittedEndDate);
    $currentDate = strtotime(date('Y-m-d'));
    
    // Calculate the difference in days and enforce integer comparison
    $diffSeconds = $payPeriodEndTimestamp - $payPeriodStartTimestamp;
    $diffDays = (int)round($diffSeconds / (60 * 60 * 24)); // Cast result to strict integer

    // --- Start Validation Sequence ---
    
    // 1. Check Pay Period Duration (MUST be exactly 14 days difference)
    if ($diffDays !== 14) {
        $message = "Error: The payroll period must cover exactly 15 days (a date difference of 14 days). Selected period duration: " . ($diffDays + 1) . " days. (Calculated Difference: {$diffDays} days).";
    } 
    // 2. Check Future Date (Only if Duration passed)
    elseif ($payPeriodEndTimestamp > $currentDate) {
        $message = "Error: Payroll computation is not allowed until the pay period has finished. Today's date must be on or after the Payroll End Date (" . date('F j, Y', $payPeriodEndTimestamp) . ").";
    } 
    // 3. Validation Passed (Only if both checks passed)
    else {
        // If validation passes, redirect to the payslip generation script
        header("Location: generate_payslip.php?employeeNo=" . urlencode($_POST['employeeNo']) . "&payPeriodStart=" . urlencode($submittedStartDate) . "&payPeriodEnd=" . urlencode($submittedEndDate) . "&payDaySchedule=" . urlencode($submittedPayDate));
        exit();
    }
}


// Fetch employees to populate the dropdown
$sql = "SELECT employeeNo, firstName, lastName FROM employees ORDER BY lastName, firstName";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Payroll</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .payroll-form-group {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
            margin-bottom: 20px;
        }
        .payroll-form-group h3 {
            color: #333;
            margin-top: 0;
            border-bottom: 2px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        .form-row .input-group {
            flex: 1;
            margin-bottom: 0;
        }
        /* --- NEW STYLING FOR MESSAGES --- */
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
            font-weight: bold;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <h1>Manage Employee Payroll</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2>Payroll Generator</h2>

            <?php if ($message): ?>
                <div class="message <?php echo (strpos($message, 'Error') !== false || strpos($message, 'missing') !== false) ? 'error-message' : 'success-message'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <div class="payroll-form-group">
                <h3 style="color: #f3ba00ff;">Select Employee and Pay Period</h3>
                <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                    <input type="hidden" name="fetch_summary" value="1">
                    <div class="input-group">
                        <label style="color: #941616ff;" for="employeeNo">Employee:</label>
                        <select id="employeeNo" name="employeeNo" required>
                            <?php foreach ($employees as $employee): ?>
                                <option value="<?php echo htmlspecialchars($employee['employeeNo']); ?>"
                                    <?php echo (($_POST['employeeNo'] ?? '') == $employee['employeeNo']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($employee['lastName'] . ', ' . $employee['firstName'] . ' (' . $employee['employeeNo'] . ')'); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="input-group">
                            <label style="color: #941616ff;" for="payPeriodStart">Payroll Start Date:</label>
                            <input type="date" id="payPeriodStart" name="payPeriodStart" required value="<?php echo htmlspecialchars($submittedStartDate); ?>">
                        </div>
                        <div class="input-group">
                            <label style="color: #941616ff;" for="payPeriodEnd">Payroll End Date:</label>
                            <input type="date" id="payPeriodEnd" name="payPeriodEnd" required value="<?php echo htmlspecialchars($submittedEndDate); ?>">
                        </div>
                    </div>
                    <div class="input-group">
                        <label style="color: #941616ff;" for="payDaySchedule">Pay Day Schedule:</label>
                            <input type="date" id="payDaySchedule" name="payDaySchedule" required value="<?php echo htmlspecialchars($submittedPayDate); ?>">
                    </div>
                    <button type="submit">Generate Payslip</button>
                </form>
            </div>
        </div>

        <aside class="side-menu">
            <h2>Payroll Tools</h2>
            <ul>
                <li><a href="admin_dashboard.php">Back to Admin Dashboard</a></li>
                <li><a href="payslip_history.php">View All Payslips</a></li> 
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>