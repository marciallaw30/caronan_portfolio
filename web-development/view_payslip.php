<?php
session_start();
// Check if ANY user is logged in
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}
// Include the database connection file
include 'db_conn.php';

// --- Database Connection Check ---
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$payslipData = null;
$employeeData = null;
$benefits = [];
$message = '';

$currentEmployeeNo = $_SESSION['employee_no'];
$isAdmin = ($_SESSION['account_type'] ?? '') === 'admin';
// Determines if the view is initiated by an admin (e.g., from the history link)
$isAdminView = isset($_GET['is_admin']) && $isAdmin; 

// --- 1. Validation and Data Fetching Preparation ---
$payslipID = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

if (!$payslipID) {
    $message = "Invalid or no payslip ID specified.";
} else {
    // Determine the security clause for fetching the payslip
    $sql_payslip = "SELECT * FROM payroll WHERE id = ?";
    $paramTypes = 'i';
    $bindParams = [&$payslipID]; // Use reference for bind_param arguments

    // If NOT admin viewing from the admin dashboard (or not admin at all), restrict to their own employeeNo
    if (!$isAdminView) {
        $sql_payslip .= " AND employeeNo = ?";
        $paramTypes .= 's';
        
        // Ensure the current employee number is passed by reference
        $bindParams[] = &$currentEmployeeNo; 
    }

    $stmt_payslip = $conn->prepare($sql_payslip);

    if ($stmt_payslip === false) {
        $message = "Database error preparing payslip fetch: " . $conn->error;
    } else {
        // --- Dynamic Binding: More robust method for variable number of parameters ---
        // Prepend the type string to the array of parameters
        $bindParamsWithTypes = array_merge([$paramTypes], $bindParams);
        
        // Use call_user_func_array for binding parameters
        if (!call_user_func_array([$stmt_payslip, 'bind_param'], $bindParamsWithTypes)) {
             $message = "Error binding parameters for payslip fetch.";
        } else {
            $stmt_payslip->execute();
            $result = $stmt_payslip->get_result();
            if ($result) {
                $payslipData = $result->fetch_assoc();
            }
        }
        $stmt_payslip->close();
    }
    
    // --- 2. Data Processing and Employee Fetching ---
    if ($payslipData) {
        $empNoToFetch = $payslipData['employeeNo'];

        // Fetch employee details (Applies regardless of who is logged in)
        $sql_employee = "SELECT employeeNo, firstName, lastName, department, position FROM employees WHERE employeeNo = ?";
        $stmt_employee = $conn->prepare($sql_employee);
        
        if ($stmt_employee === false) {
            $message = "Database error preparing employee fetch.";
        } else {
            $stmt_employee->bind_param("s", $empNoToFetch);
            $stmt_employee->execute();
            $employeeData = $stmt_employee->get_result()->fetch_assoc();
            $stmt_employee->close();
        }

        // Decode benefits data, which is stored as a JSON string in the database
        // Use an empty array fallback if json_decode returns null (e.g., malformed JSON)
        $benefits = json_decode($payslipData['benefitsData'] ?? '[]', true) ?? [];

    } elseif (empty($message)) {
        // This is the message if the payslip wasn't found (either ID is wrong or security clause failed)
        $message = "Payslip not found or you do not have permission to view it.";
    }
}

// Close the connection only if it was successfully opened
if ($conn && $conn->ping()) {
    $conn->close();
}

// Prepare display variables (using null coalescing for safety and ensuring data types)
$payStart = $payslipData['pay_period_start'] ?? 'N/A';
$payEnd = $payslipData['pay_period_end'] ?? 'N/A';
$payDate = $payslipData['pay_day_schedule'] ?? 'N/A';

$grossPay = (float)($payslipData['gross_pay'] ?? 0);
$totalDeductions = (float)($payslipData['total_deductions'] ?? 0);
$netPay = (float)($payslipData['net_pay'] ?? 0);

$employeeFullName = htmlspecialchars(($employeeData['firstName'] ?? '') . ' ' . ($employeeData['lastName'] ?? 'N/A'));
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Payslip - <?php echo htmlspecialchars($employeeData['lastName'] ?? 'N/A'); ?></title>
    <link rel="stylesheet" href="style.css"> 
    <style>
        .payslip-container { max-width: 800px; margin: 30px auto; padding: 30px; background: #fff; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); color: #333; }
        .payslip-header h1 { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
        .payslip-section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .payslip-info { display: grid; grid-template-columns: 1fr 1fr; }
        .payslip-info p { margin: 5px 0; }
        .payslip-info strong { display: inline-block; width: 120px; }
        .payslip-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .payslip-breakdown h3 { color: #007bff; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
        .payslip-breakdown p { display: flex; justify-content: space-between; margin: 4px 0; font-size: 0.95em; }
        .payslip-breakdown p strong { font-weight: 600; }
        .payslip-footer { margin-top: 30px; display: flex; justify-content: flex-end; }
        .net-pay { background-color: #d4edda; color: #155724; padding: 15px 30px; font-size: 1.5em; font-weight: bold; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .action-buttons { text-align: center; margin-top: 20px; }
        .button { padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block; }
        .error-message { color: #dc3545; background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="action-buttons">
        <a href="<?php echo $isAdmin ? 'payslip_history.php' : 'employee_dashboard.php'; ?>" class="button" style="margin-bottom: 20px;">← Back to Dashboard</a>
    </div>

    <?php if ($message): ?>
        <div class="payslip-container">
            <p class="error-message">🚨 <?php echo htmlspecialchars($message); ?></p>
        </div>
    <?php else: ?>
        <div class="payslip-container" id="payslipContent">
            <div class="payslip-header">
                <h1>PAYSLIP</h1>
                <p>DATAMEX</p>
            </div>
            
            <div class="payslip-section payslip-info">
                <div>
                    <p><strong>Employee Name:</strong> <?php echo $employeeFullName; ?></p>
                    <p><strong>Employee No:</strong> <?php echo htmlspecialchars($employeeData['employeeNo'] ?? 'N/A'); ?></p>
                    <p><strong>Position:</strong> <?php echo htmlspecialchars($employeeData['position'] ?? 'N/A'); ?></p>
                    <p><strong>Department:</strong> <?php echo htmlspecialchars($employeeData['department'] ?? 'N/A'); ?></p>
                </div>
                <div>
                    <p><strong>Pay Period Start:</strong> <?php echo htmlspecialchars($payStart); ?></p>
                    <p><strong>Pay Period End:</strong> <?php echo htmlspecialchars($payEnd); ?></p>
                    <p><strong>Pay Date:</strong> <?php echo htmlspecialchars($payDate); ?></p>
                </div>
            </div>

            <div class="payslip-section payslip-breakdown">
                <div>
                    <h3>EARNINGS 💰</h3>
                    <?php $regular_days = (float)($payslipData['regular_days'] ?? 0); ?>
                    <?php $overtime_hours = (float)($payslipData['overtime_hours'] ?? 0); ?>
                    
                    <p><span>Regular Days (Hours):</span> <span><?php echo number_format($regular_days, 2); ?> (<?php echo number_format($regular_days * 8, 2); ?> hrs)</span></p>
                    <p><span>Overtime Hours:</span> <span><?php echo number_format($overtime_hours, 2); ?></span></p>
                    <p><span>Reg Holiday Days:</span> <span><?php echo number_format((float)($payslipData['regular_holiday_days'] ?? 0), 2); ?></span></p>
                    <p><span>Reg Holiday OT Hours:</span> <span><?php echo number_format((float)($payslipData['regular_holiday_ot_hours'] ?? 0), 2); ?></span></p>
                    <p><span>Special Holiday Days:</span> <span><?php echo number_format((float)($payslipData['special_holiday_days'] ?? 0), 2); ?></span></p>
                    <p><span>Special Holiday OT Hours:</span> <span><?php echo number_format((float)($payslipData['special_holiday_ot_hours'] ?? 0), 2); ?></span></p>
                    <p style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;"><strong>GROSS PAY:</strong> <strong>₱<?php echo number_format($grossPay, 2); ?></strong></p>
                </div>
                <div>
                    <h3>DEDUCTIONS 📉</h3>
                    <p><span>SSS Contrib:</span> <span>₱<?php echo number_format((float)($benefits['SSS'] ?? 0), 2); ?></span></p>
                    <p><span>PhilHealth:</span> <span>₱<?php echo number_format((float)($benefits['PhilHealth'] ?? 0), 2); ?></span></p>
                    <p><span>PAG-IBIG:</span> <span>₱<?php echo number_format((float)($benefits['PAG-IBIG'] ?? 0), 2); ?></span></p>
                    <p><span>TIN (Tax):</span> <span>₱<?php echo number_format((float)($benefits['TIN'] ?? 0), 2); ?></span></p>
                    
                    <?php $late_deductions = (float)($payslipData['late_deductions'] ?? 0); ?>
                    <?php $late_minutes = (int)($payslipData['late_minutes'] ?? 0); ?>
                    <p><span>Late Deductions:</span> <span>₱<?php echo number_format($late_deductions, 2); ?> (<?php echo htmlspecialchars($late_minutes); ?> mins)</span></p>
                    
                    <?php $other_deductions = (float)($payslipData['other_deductions'] ?? 0); ?>
                    <p><span><?php echo htmlspecialchars($benefits['OtherDeductionName'] ?? 'Other Deductions'); ?>:</span> <span>₱<?php echo number_format($other_deductions, 2); ?></span></p>
                    
                    <p style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;"><strong>TOTAL DEDUCTIONS:</strong> <strong>₱<?php echo number_format($totalDeductions, 2); ?></strong></p>
                </div>
            </div>

            <div class="payslip-footer">
                <div class="net-pay">
                    NET PAY: ₱<?php echo number_format($netPay, 2); ?>
                </div>
            </div>
            
            <p style="text-align: center; font-style: italic; font-size: 0.9em; margin-top: 30px;">This is a system-generated document. No signature is required.</p>
        </div>
    <?php endif; ?>
</body>
</html>