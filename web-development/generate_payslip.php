<?php
session_start();
// Check for user login and admin status
if (!isset($_SESSION['employee_no']) || (($_SESSION['account_type'] ?? '') !== 'admin')) {
    header("Location: index.php");
    exit();
}

// FIX: Corrected include path logic based on common setup
if (file_exists('database/db_conn.php')) {
    include 'database/db_conn.php';
} else {
    // Fallback path if the file is in the root directory
    include 'db_conn.php'; 
}


$message = '';
$employees = [];

// --- PAYROLL CONSTANTS (Default values, will be overridden by employee data) ---
const MIN_WAGE_DEFAULT = 695.00;
$employeeHourlyRate = MIN_WAGE_DEFAULT / 8; 
$employeeDailyRate = MIN_WAGE_DEFAULT;
$LATE_DEDUCTION_PER_MINUTE = 0; 
$OVERTIME_RATE_MULTIPLIER = 1.25;

// Variables that will be set by the rate function
$REGULAR_HOLIDAY_RATE_DAILY;
$REGULAR_HOLIDAY_OT_RATE_HOURLY;
$SPECIAL_HOLIDAY_RATE_DAILY;
$SPECIAL_HOLIDAY_OT_RATE_HOURLY;

// --- DEDICATED FUNCTION TO SET ALL RATES ---
function setDynamicRates(float $rate) {
    global $employeeDailyRate, $employeeHourlyRate, $LATE_DEDUCTION_PER_MINUTE, 
           $REGULAR_HOLIDAY_RATE_DAILY, $REGULAR_HOLIDAY_OT_RATE_HOURLY, 
           $SPECIAL_HOLIDAY_RATE_DAILY, $SPECIAL_HOLIDAY_OT_RATE_HOURLY;

    $employeeDailyRate = $rate;
    $employeeHourlyRate = $rate / 8;

    $LATE_DEDUCTION_PER_MINUTE = $employeeHourlyRate / 60;
    $REGULAR_HOLIDAY_RATE_DAILY = $employeeDailyRate * 2.0;
    $REGULAR_HOLIDAY_OT_RATE_HOURLY = $employeeHourlyRate * 2.6;
    $SPECIAL_HOLIDAY_RATE_DAILY = $employeeDailyRate * 1.30;
    $SPECIAL_HOLIDAY_OT_RATE_HOURLY = $employeeHourlyRate * 1.69;
}


// --- INITIAL PRE-FILL DATA STRUCTURE ---
$prefill = [
    'employeeNo' => '', 'regularDays' => 0.00, 'overtimeHours' => 0.00,
    'regularHolidayDays' => 0.00, 'regularHolidayOvertimeHours' => 0.00,
    'specialHolidayDays' => 0.00, 'specialHolidayOvertimeHours' => 0.00,
    'lateMinutes' => 0, 'lateDeductions' => 0.00,
    'philhealthContribution' => 0.00, 'sssContribution' => 0.00, 
    'pagibigContribution' => 0.00, 'tinContribution' => 0.00,
    'otherDeductionName' => '', 'otherDeductions' => 0.00,
    'grossPay' => 0.00, 'totalDeductions' => 0.00, 'netPay' => 0.00,
    'payPeriodStart' => '', 'payPeriodEnd' => '', 'payDaySchedule' => '',
    'payslipID' => null, 'halfMonthDeductions' => 0.00
];

// --- HELPER FUNCTIONS ---
function getEmployeeByNo($conn, $employeeNo) {
    if (empty($employeeNo)) return null; 
    
    $stmt = $conn->prepare("SELECT employeeNo, firstName, lastName, ratePerHour FROM employees WHERE employeeNo = ?");
    if ($stmt === false) return false; 
    $stmt->bind_param("s", $employeeNo);
    $stmt->execute();
    $result = $stmt->get_result();
    return ($result->num_rows > 0) ? $result->fetch_assoc() : null;
}
function generateHolidays($year) {
    $holidays = [
        'regular' => ["{$year}-01-01", "{$year}-04-09", "{$year}-05-01", "{$year}-06-12", "{$year}-08-26", "{$year}-11-30", "{$year}-12-25", "{$year}-12-30"],
        'special' => ["{$year}-08-21", "{$year}-11-01", "{$year}-12-08", "{$year}-12-24", "{$year}-12-31"],
    ];
    return $holidays;
}
function getHolidayType($date, $holidays) {
    if (in_array($date, $holidays['regular'])) return 'Regular Holiday';
    if (in_array($date, $holidays['special'])) return 'Special Holiday';
    return 'Regular Day';
}
function getPayslipByEmployeeAndPeriod($conn, $employeeNo, $startDate, $endDate) {
    $stmt = $conn->prepare("SELECT * FROM payroll WHERE employeeNo = ? AND pay_period_start = ? AND pay_period_end = ?");
    if ($stmt === false) return false;
    $stmt->bind_param("sss", $employeeNo, $startDate, $endDate);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}
function getHalfMonthDeductionsTotal($conn, $startDate) {
    $day = (int)date('j', strtotime($startDate));
    $half = ($day > 15) ? 'second_half' : 'first_half';
    
    $check_sql = $conn->query("SHOW TABLES LIKE 'half_month_deductions'");
    if (!$check_sql || $check_sql->num_rows == 0) return 0.00; 

    $sql = "SELECT COALESCE(SUM(amount), 0) AS total FROM half_month_deductions WHERE applies_to IN ('both', ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) return 0.00; // Guard against prepare failure
    $stmt->bind_param("s", $half);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return floatval($row['total'] ?? 0);
}


// --- FETCH EMPLOYEES (Optional but good practice) ---
$sql_employees = "SELECT employeeNo, firstName, lastName FROM employees";
$result_employees = $conn->query($sql_employees);
if ($result_employees->num_rows > 0) {
    while ($row = $result_employees->fetch_assoc()) {
        $employees[] = $row;
    }
}


// --- 1. DETERMINE EMPLOYEE NO AND PAY PERIOD TO PROCESS ---
// Uses GET parameters from manage_payroll.php submission
$employeeNoToProcess = $_GET['employeeNo'] ?? '';
$payPeriodStart = $_GET['payPeriodStart'] ?? '';
$payPeriodEnd = $_GET['payPeriodEnd'] ?? '';
$payDaySchedule = $_GET['payDaySchedule'] ?? '';

// If GET is empty (e.g. page refresh), check POST (e.g. save button pressed)
if (empty($employeeNoToProcess) && isset($_POST['employeeNo'])) {
    $employeeNoToProcess = $_POST['employeeNo'] ?? '';
    $payPeriodStart = $_POST['payPeriodStart'] ?? '';
    $payPeriodEnd = $_POST['payPeriodEnd'] ?? '';
    $payDaySchedule = $_POST['payDaySchedule'] ?? '';
} elseif (empty($employeeNoToProcess) && isset($_GET['edit_payslip_id'])) {
    $sql_fetch_eno = "SELECT employeeNo FROM payroll WHERE id = ?";
    $stmt_eno = $conn->prepare($sql_fetch_eno);
    if ($stmt_eno === false) { /* Handle error */ } else {
        $stmt_eno->bind_param("i", $_GET['edit_payslip_id']);
        $stmt_eno->execute();
        $employeeNoToProcess = $stmt_eno->get_result()->fetch_assoc()['employeeNo'] ?? '';
        $stmt_eno->close();
    }
}


// --- 2. CRITICAL: FETCH EMPLOYEE DATA AND SET RATES ---
$selectedEmployee = null;
if (!empty($employeeNoToProcess)) {
    $selectedEmployee = getEmployeeByNo($conn, $employeeNoToProcess);
    $prefill['employeeNo'] = $employeeNoToProcess;

    if ($selectedEmployee) {
        $rate = floatval($selectedEmployee['ratePerHour'] ?? 0);
        
        if ($rate > 0) {
            setDynamicRates($rate);
        } else {
            $message = "Error: Employee **Hourly Rate** is missing or zero in the database. Please update the employee profile before generating a payslip.";
        }
    } else {
        $message = "Error: Employee not found in the database.";
    }
}

// --- DEFINE DISPLAY VARIABLES HERE TO AVOID WARNINGS ---
$employeeFullName = htmlspecialchars($selectedEmployee['firstName'] ?? 'N/A') . ' ' . htmlspecialchars($selectedEmployee['lastName'] ?? 'N/A');


// --- 3. LOAD OR AGGREGATE DATA (Only if no critical rate error) ---
if (empty($message) && !empty($employeeNoToProcess)) {
    
    // 3A. Handle Payslip Edit (Load data from history link)
    if (isset($_GET['edit_payslip_id'])) {
        $payslipID = $_GET['edit_payslip_id'];
        $sql_edit = "SELECT * FROM payroll WHERE id = ?";
        $stmt_edit = $conn->prepare($sql_edit);
        if ($stmt_edit === false) { /* Handle error */ } else {
            $stmt_edit->bind_param("i", $payslipID);
            $stmt_edit->execute();
            $editPayslip = $stmt_edit->get_result()->fetch_assoc();
            $stmt_edit->close();
        }

        if ($editPayslip) {
            $editEmployee = getEmployeeByNo($conn, $editPayslip['employeeNo']);
            if ($editEmployee && floatval($editEmployee['ratePerHour'] ?? 0) > 0) {
                 setDynamicRates(floatval($editEmployee['ratePerHour']));
            }

            $prefill = array_merge($prefill, $editPayslip);
            $prefillBenefits = json_decode($editPayslip['benefitsData'], true) ?? [];
            $prefill['philhealthContribution'] = $prefillBenefits['PhilHealth'] ?? 0;
            $prefill['sssContribution'] = $prefillBenefits['SSS'] ?? 0;
            $prefill['pagibigContribution'] = $prefillBenefits['PAG-IBIG'] ?? 0;
            $prefill['tinContribution'] = $prefillBenefits['TIN'] ?? 0;
            $prefill['otherDeductionName'] = $prefillBenefits['OtherDeductionName'] ?? '';
            $prefill['otherDeductions'] = $editPayslip['other_deductions'] ?? 0;
            $prefill['payslipID'] = $editPayslip['id'];
            $prefill['payPeriodStart'] = $editPayslip['pay_period_start'];
            $prefill['payPeriodEnd'] = $editPayslip['pay_period_end'];
            $prefill['payDaySchedule'] = $editPayslip['pay_day_schedule'];

            $prefill['halfMonthDeductions'] = getHalfMonthDeductionsTotal($conn, $prefill['payPeriodStart']);
            $message = "Payslip #{$payslipID} loaded for editing.";
        } else {
            $message = "Payslip not found.";
        }
    } 
    // 3B. Handle Payslip Generation (Data Aggregation from Attendance) - Only if required period variables are set
    else if (!empty($payPeriodStart) && !empty($payPeriodEnd)) {
        
        $holidays = generateHolidays(date('Y', strtotime($payPeriodStart)));

        $sql_attendance = "SELECT date, working_hours, overtime_hours, late_minutes FROM attendance WHERE employeeNo = ? AND date BETWEEN ? AND ?";
        $stmt_attendance = $conn->prepare($sql_attendance);
        if ($stmt_attendance === false) { /* Handle error */ } else {
            $stmt_attendance->bind_param("sss", $employeeNoToProcess, $payPeriodStart, $payPeriodEnd);
            $stmt_attendance->execute();
            $result_attendance = $stmt_attendance->get_result();
            // Don't close $stmt_attendance yet, as we need it later
        }
        
        $existingPayslip = getPayslipByEmployeeAndPeriod($conn, $employeeNoToProcess, $payPeriodStart, $payPeriodEnd);
        
        if ($existingPayslip) {
            $message = "A payslip for this employee and period already exists. Loading data for review/edit.";
            $prefill = array_merge($prefill, $existingPayslip);
            $prefill['payslipID'] = $existingPayslip['id'];
            $prefillBenefits = json_decode($existingPayslip['benefitsData'], true) ?? [];
            $prefill['philhealthContribution'] = $prefillBenefits['PhilHealth'] ?? 0;
            $prefill['sssContribution'] = $prefillBenefits['SSS'] ?? 0;
            $prefill['pagibigContribution'] = $prefillBenefits['PAG-IBIG'] ?? 0;
            $prefill['tinContribution'] = $prefillBenefits['TIN'] ?? 0;
            $prefill['otherDeductionName'] = $prefillBenefits['OtherDeductionName'] ?? '';
            $prefill['otherDeductions'] = $existingPayslip['other_deductions'] ?? 0;
        } else {
            // Aggregate attendance data if no existing payslip
            if (isset($result_attendance) && $result_attendance && $result_attendance->num_rows > 0) { 
                while ($row = $result_attendance->fetch_assoc()) {
                    $holidayType = getHolidayType($row['date'], $holidays);
                    if ($row['working_hours'] > 0) {
                        if ($holidayType === 'Regular Holiday') {
                            $prefill['regularHolidayDays']++;
                            $prefill['regularHolidayOvertimeHours'] += $row['overtime_hours'];
                        } elseif ($holidayType === 'Special Holiday') {
                            $prefill['specialHolidayDays']++;
                            $prefill['specialHolidayOvertimeHours'] += $row['overtime_hours'];
                        } else {
                            $prefill['regularDays'] += $row['working_hours'] / 8; 
                            $prefill['overtimeHours'] += $row['overtime_hours'];
                        }
                    }
                    $prefill['lateMinutes'] += $row['late_minutes'];
                }
                $prefill['lateDeductions'] = $prefill['lateMinutes'] * $LATE_DEDUCTION_PER_MINUTE;
            } else {
                 $message = "Warning: No attendance records were found for the period {$payPeriodStart} to {$payPeriodEnd}. Payroll is calculated using zero hours.";
            }
        }
        
        // Finalize period data
        $prefill['payPeriodStart'] = $payPeriodStart;
        $prefill['payPeriodEnd'] = $payPeriodEnd;
        $prefill['payDaySchedule'] = $payDaySchedule;
        $prefill['employeeNo'] = $employeeNoToProcess;
        $prefill['halfMonthDeductions'] = getHalfMonthDeductionsTotal($conn, $payPeriodStart);
        
        // Close statement after data is aggregated
        if (isset($stmt_attendance)) { $stmt_attendance->close(); }
    }
}


// --- 4. Handle Payslip Saving (Save/Update to DB) ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_payroll'])) {
    // Check if connection is closed and reconnect if necessary
    if (!$conn || $conn->connect_error) {
         include 'db_conn.php';
         if ($conn->connect_error) { 
             $_SESSION['payroll_error'] = "Critical Database Error on Save: Connection failed.";
             header("Location: manage_payroll.php");
             exit();
         }
    }
    
    // ... (Data Collection from POST - Unchanged)
    $employeeNo = $_POST['employeeNo'] ?? '';
    $payPeriodStart = $_POST['payPeriodStart'] ?? '';
    $payPeriodEnd = $_POST['payPeriodEnd'] ?? '';
    $payDaySchedule = $_POST['payDaySchedule'] ?? '';
    $payslipID = $_POST['payslipID'] ?? null;
    $regularDays = $_POST['regularDays'] ?? 0.00;
    $overtimeHours = $_POST['overtimeHours'] ?? 0.00;
    $regularHolidayDays = $_POST['regularHolidayDays'] ?? 0.00;
    $regularHolidayOvertimeHours = $_POST['regularHolidayOvertimeHours'] ?? 0.00;
    $specialHolidayDays = $_POST['specialHolidayDays'] ?? 0.00;
    $specialHolidayOvertimeHours = $_POST['specialHolidayOvertimeHours'] ?? 0.00;
    $lateMinutes = $_POST['lateMinutes'] ?? 0;
    $lateDeductions = $_POST['lateDeductions'] ?? 0.00;
    $otherDeductionName = $_POST['otherDeductionName'] ?? '';
    $otherDeductions = $_POST['otherDeductions'] ?? 0.00;
    $grossPay = $_POST['grossPay'] ?? 0.00;
    $totalDeductions = $_POST['totalDeductions'] ?? 0.00;
    $netPay = $_POST['netPay'] ?? 0.00;
    $philhealthContribution = $_POST['philhealthContribution'] ?? 0.00;
    $sssContribution = $_POST['sssContribution'] ?? 0.00;
    $pagibigContribution = $_POST['pagibigContribution'] ?? 0.00;
    $tinContribution = $_POST['tinContribution'] ?? 0.00;
    $halfMonthDeductions = $_POST['halfMonthDeductions'] ?? 0.00; 

    $serverCalculatedDeductions = (float)$totalDeductions + (float)$halfMonthDeductions;
    $serverCalculatedNetPay = (float)$grossPay - $serverCalculatedDeductions;

    if (empty($employeeNo)) {
        $_SESSION['payroll_error'] = "Critical Error: Employee Number is missing during save.";
        header("Location: manage_payroll.php");
        exit();
    }

    $benefitsData = json_encode([
        'PhilHealth' => $philhealthContribution,
        'SSS' => $sssContribution,
        'PAG-IBIG' => $pagibigContribution,
        'TIN' => $tinContribution,
        'OtherDeductionName' => $otherDeductionName
    ]);

    // --- FIX: Define the column list with commas for clarity and stability ---
    $col_list = "regular_days, overtime_hours, regular_holiday_days, regular_holiday_ot_hours, special_holiday_days, special_holiday_ot_hours, late_minutes, late_deductions, other_deduction_name, other_deductions, gross_pay, total_deductions, net_pay, benefitsData, pay_period_start, pay_period_end, pay_day_schedule";
    
    // --- FIX: Construct the placeholder list for UPDATE ---
    // The placeholder list should look like: col1=?, col2=?, ...
    $placeholder_update = preg_replace('/([a-zA-Z0-9_]+)/', '$1=?', $col_list); 

    if ($payslipID) {
        $sql = "UPDATE payroll SET {$placeholder_update} WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
             $_SESSION['payroll_error'] = "Database Error (UPDATE): " . $conn->error;
             header("Location: manage_payroll.php");
             exit();
        }
        // Bind parameters: 17 d/i/s types + 1 'i' for ID = 18 types
        $stmt->bind_param("ddddddidssdssssssi",
            $regularDays, $overtimeHours, $regularHolidayDays, $regularHolidayOvertimeHours,
            $specialHolidayDays, $specialHolidayOvertimeHours, $lateMinutes, $lateDeductions,
            $otherDeductionName, $otherDeductions, $grossPay, $serverCalculatedDeductions, $serverCalculatedNetPay,
            $benefitsData, $payPeriodStart, $payPeriodEnd, $payDaySchedule, $payslipID
        );
    } else {
        // Construct the list of 17 value placeholders for INSERT
        $value_placeholders = str_repeat('?,', 17);
        $value_placeholders = trim($value_placeholders, ','); 
        
        $sql = "INSERT INTO payroll (employeeNo, {$col_list}) VALUES (?, {$value_placeholders})";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
             $_SESSION['payroll_error'] = "Database Error (INSERT): " . $conn->error;
             header("Location: manage_payroll.php");
             exit();
        }
        // Bind parameters: 1 's' (employeeNo) + 17 d/i/s types = 18 types
        $stmt->bind_param("sddddddidssdssssss",
            $employeeNo, $regularDays, $overtimeHours, $regularHolidayDays, $regularHolidayOvertimeHours,
            $specialHolidayDays, $specialHolidayOvertimeHours, $lateMinutes, $lateDeductions,
            $otherDeductionName, $otherDeductions, $grossPay, $serverCalculatedDeductions, $serverCalculatedNetPay,
            $benefitsData, $payPeriodStart, $payPeriodEnd, $payDaySchedule
        );
    }
    
    if ($stmt->execute()) {
        $msg = $payslipID ? 'Payslip updated successfully!' : 'Payslip generated and saved successfully!';
        $_SESSION['payroll_success'] = $msg;
        header("Location: manage_payroll.php");
        exit();
    } else {
        $_SESSION['payroll_error'] = "Database Error: " . $stmt->error;
        header("Location: manage_payroll.php");
        exit();
    }
    $stmt->close();
}

// Close connection only if it's open (avoids the previous problem in helper functions)
if ($conn && method_exists($conn, 'close')) {
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate Payslip</title>
    <link rel="stylesheet" href="style.css">
<style>
    /* ----------------------------------------------------- */
    /* GENERAL VISIBILITY FIXES */
    /* ----------------------------------------------------- */
    .main-content {
        /* Set the base text color for the main content area to white */
        color: #fff; 
    }
    .payroll-form-group { 
        /* Kept light background for contrast inside the form group */
        background-color: rgba(255, 255, 255, 0.1); 
        max-width: 900px; 
        margin: 20px auto; 
        padding: 20px; 
        border-radius: 8px; 
        box-shadow: 0 0 10px rgba(0,0,0,0.1); 
    }
    
    /* Ensure all major headers are visible (H3 and H4 section breaks) */
    .payroll-form-group h3,
    .section-header {
        /* Forces all section headers to be a bright color (Gold) */
        color: #FFD700 !important; 
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    /* FIX: Ensure all labels inside the input groups are white */
    .input-group label {
        color: #fff !important; 
        font-weight: bold;
    }

    /* FIX: Ensure the labels for the 'Late / Other Deductions' section are white */
    /* This targets the input group labels and headers specifically */
    .form-grid h4.section-header {
        color: #FFD700 !important;
    }

    /* ----------------------------------------------------- */
    /* INPUT FIELD STYLING */
    /* ----------------------------------------------------- */
    .form-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 20px; 
        margin-bottom: 20px; 
    }
    .input-group input, .input-group select { 
        width: 100%; 
        padding: 8px; 
        box-sizing: border-box; 
        color: #333; /* Keep input text dark */
    }
    .input-group input[readonly], .input-group input[disabled] {
        background-color: #eee;
        color: #555;
        cursor: default;
    }

    /* ----------------------------------------------------- */
    /* SUMMARY STYLING */
    /* ----------------------------------------------------- */
    .summary-details { 
        background-color: #e0f7fa; 
        padding: 15px; 
        border-radius: 5px; 
        margin-top: 20px; 
    }
    .summary-details p { 
        font-size: 1.1em; 
        margin: 5px 0; 
        color: #333; /* Ensure text inside the light summary box is dark */
    }
    .message-success { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-weight: bold; }
    .error-message { background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-weight: bold; }

</style>
</head>
<body>
    <header>
        <h1><?php echo $prefill['payslipID'] ? 'Edit Payslip' : 'Generate Payslip'; ?></h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <?php if (!empty($message)): ?>
                <div class="<?php echo (strpos($message, 'Error') !== false || strpos($message, 'exists') !== false || strpos($message, 'Warning') !== false) ? 'error-message' : 'message-success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <div class="payroll-form-group">
                <h3>Payslip Details for <?php echo $employeeFullName; ?> (<?php echo htmlspecialchars($prefill['employeeNo']); ?>)</h3>
                
                <?php if (empty($message) || strpos($message, 'Error') === false || strpos($message, 'exists') !== false): ?>
                    <form id="savePayrollForm" action="generate_payslip.php" method="POST">
                        <input type="hidden" name="save_payroll" value="1">
                        <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($prefill['employeeNo']); ?>">
                        <input type="hidden" name="payPeriodStart" value="<?php echo htmlspecialchars($prefill['payPeriodStart']); ?>">
                        <input type="hidden" name="payPeriodEnd" value="<?php echo htmlspecialchars($prefill['payPeriodEnd']); ?>">
                        <input type="hidden" name="payslipID" value="<?php echo htmlspecialchars($prefill['payslipID']); ?>">
                        <input type="hidden" name="payDaySchedule" value="<?php echo htmlspecialchars($prefill['payDaySchedule']); ?>">
                        <input type="hidden" id="halfMonthDeductions" name="halfMonthDeductions" value="<?php echo number_format($prefill['halfMonthDeductions'], 2, '.', ''); ?>">
                        
                        <div class="form-grid">
                            <h4 class="section-header">Earnings (Based on Rate: ₱<?php echo number_format($employeeHourlyRate, 2); ?>/hr)</h4>
                            <h4 class="section-header">Mandatory Deductions</h4>

                            <div class="input-group">
                                <label for="regularDays">Regular Days Worked (8hr units):</label>
                                <input type="number" step="0.01" id="regularDays" name="regularDays" value="<?php echo number_format($prefill['regularDays'], 2, '.', ''); ?>" required>
                            </div>
                            <div class="input-group">
                                <label for="philhealthContribution">PhilHealth Contribution:</label>
                                <input type="number" step="0.01" id="philhealthContribution" name="philhealthContribution" value="<?php echo number_format($prefill['philhealthContribution'], 2, '.', ''); ?>">
                            </div>

                            <div class="input-group">
                                <label for="overtimeHours">Regular Overtime Hours:</label>
                                <input type="number" step="0.01" id="overtimeHours" name="overtimeHours" value="<?php echo number_format($prefill['overtimeHours'], 2, '.', ''); ?>" required>
                            </div>
                            <div class="input-group">
                                <label for="sssContribution">SSS Contribution:</label>
                                <input type="number" step="0.01" id="sssContribution" name="sssContribution" value="<?php echo number_format($prefill['sssContribution'], 2, '.', ''); ?>">
                            </div>

                            <div class="input-group">
                                <label for="regularHolidayDays">Reg Holiday Days:</label>
                                <input type="number" step="0.01" id="regularHolidayDays" name="regularHolidayDays" value="<?php echo number_format($prefill['regularHolidayDays'], 2, '.', ''); ?>">
                            </div>
                            <div class="input-group">
                                <label for="pagibigContribution">Pag-IBIG Contribution:</label>
                                <input type="number" step="0.01" id="pagibigContribution" name="pagibigContribution" value="<?php echo number_format($prefill['pagibigContribution'], 2, '.', ''); ?>">
                            </div>

                            <div class="input-group">
                                <label for="regularHolidayOvertimeHours">Reg Holiday OT Hours:</label>
                                <input type="number" step="0.01" id="regularHolidayOvertimeHours" name="regularHolidayOvertimeHours" value="<?php echo number_format($prefill['regularHolidayOvertimeHours'], 2, '.', ''); ?>">
                            </div>
                            <div class="input-group">
                                <label for="tinContribution">TIN Tax (If Applicable):</label>
                                <input type="number" step="0.01" id="tinContribution" name="tinContribution" value="<?php echo number_format($prefill['tinContribution'], 2, '.', ''); ?>">
                            </div>
                            
                            <div class="input-group">
                                <label for="specialHolidayDays">Special Holiday Days:</label>
                                <input type="number" step="0.01" id="specialHolidayDays" name="specialHolidayDays" value="<?php echo number_format($prefill['specialHolidayDays'], 2, '.', ''); ?>">
                            </div>
                            <div class="input-group">
                                </div>
                            
                            <div class="input-group">
                                <label for="specialHolidayOvertimeHours">Special Holiday OT Hours:</label>
                                <input type="number" step="0.01" id="specialHolidayOvertimeHours" name="specialHolidayOvertimeHours" value="<?php echo number_format($prefill['specialHolidayOvertimeHours'], 2, '.', ''); ?>">
                            </div>
                            <div class="input-group">
                                </div>
                            
                            <h4 class="section-header">Late / Other Deductions</h4>
                            <h4 class="section-header"></h4>

                            <div class="input-group">
                                <label for="lateMinutes">Late Minutes:</label>
                                <input type="number" step="1" id="lateMinutes" name="lateMinutes" value="<?php echo htmlspecialchars($prefill['lateMinutes']); ?>">
                            </div>
                            <div class="input-group">
                                <label for="lateDeductions">Late Deductions (Auto-Calculated):</label>
                                <input type="number" step="0.01" id="lateDeductions" name="lateDeductions" value="<?php echo number_format($prefill['lateDeductions'], 2, '.', ''); ?>" readonly>
                            </div>
                            
                            <div class="input-group">
                                <label for="otherDeductionName">Other Deduction Name (e.g., Loan):</label>
                                <input type="text" id="otherDeductionName" name="otherDeductionName" value="<?php echo htmlspecialchars($prefill['otherDeductionName']); ?>">
                            </div>
                            <div class="input-group">
                                <label for="otherDeductions">Other Deduction Amount:</label>
                                <input type="number" step="0.01" id="otherDeductions" name="otherDeductions" value="<?php echo number_format($prefill['otherDeductions'], 2, '.', ''); ?>">
                            </div>

                        </div> <hr>
                        
                        <div class="summary-details">
                            <p><strong>Gross Pay:</strong> ₱<span id="grossPayDisplay"><?php echo number_format($prefill['grossPay'], 2); ?></span></p>
                            <p><strong>Half-Month Deductions:</strong> ₱<span id="halfMonthDisplay"><?php echo number_format($prefill['halfMonthDeductions'], 2); ?></span> (Server Calculated)</p>
                            <p><strong>Total Deductions:</strong> ₱<span id="totalDeductionsDisplay"><?php echo number_format($prefill['totalDeductions'], 2); ?></span></p>
                            <p><strong>Net Pay:</strong> ₱<span id="netPayDisplay"><?php echo number_format($prefill['netPay'], 2); ?></span></p>
                            <input type="hidden" name="grossPay" id="grossPay" value="<?php echo number_format($prefill['grossPay'], 2, '.', ''); ?>">
                            <input type="hidden" name="totalDeductions" id="totalDeductions" value="<?php echo number_format($prefill['totalDeductions'], 2, '.', ''); ?>">
                            <input type="hidden" name="netPay" id="netPay" value="<?php echo number_format($prefill['netPay'], 2, '.', ''); ?>">
                        </div>
                        
                        <div class="summary-actions" style="margin-top: 20px;">
                            <button type="submit"><?php echo $prefill['payslipID'] ? 'Update Payslip' : 'Save Payslip'; ?></button>
                            <a href="manage_payroll.php" class="button">Cancel</a>
                        </div>
                    </form>
                <?php endif; ?>
            </div>
        </div>

        <aside class="side-menu">
            <h2>Payroll Tools</h2>
            <ul>
                <li><a href="manage_payroll.php">Manage Payroll</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>

    <script>
        // --- JAVASCRIPT PAYROLL CALCULATOR (Must mirror PHP constants) ---
        function calculatePayroll() {
            // Get values from input fields
            const regularDays = parseFloat(document.getElementById('regularDays').value) || 0;
            const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
            const regularHolidayDays = parseFloat(document.getElementById('regularHolidayDays').value) || 0;
            const regularHolidayOvertimeHours = parseFloat(document.getElementById('regularHolidayOvertimeHours').value) || 0;
            const specialHolidayDays = parseFloat(document.getElementById('specialHolidayDays').value) || 0;
            const specialHolidayOvertimeHours = parseFloat(document.getElementById('specialHolidayOvertimeHours').value) || 0;
            const lateMinutes = parseFloat(document.getElementById('lateMinutes').value) || 0;
            const philhealthContribution = parseFloat(document.getElementById('philhealthContribution').value) || 0;
            const sssContribution = parseFloat(document.getElementById('sssContribution').value) || 0;
            const pagibigContribution = parseFloat(document.getElementById('pagibigContribution').value) || 0;
            const tinContribution = parseFloat(document.getElementById('tinContribution').value) || 0;
            const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;
            const halfMonthDeductions = parseFloat(document.getElementById('halfMonthDeductions').value) || 0;

            // --- IMPORTANT: Dynamically get the Hourly Rate from the H4 element ---
            const hourlyRateText = document.querySelector('h4.section-header').textContent;
            const hourlyRateMatch = hourlyRateText.match(/₱(\d+\.?\d*)\/hr/);
            // Default to 86.875 if rate isn't found in the heading (safety fallback for 695/8)
            const REGULAR_HOURLY_RATE = hourlyRateMatch ? parseFloat(hourlyRateMatch[1]) : (695.00 / 8); 
            const REGULAR_DAILY_RATE = REGULAR_HOURLY_RATE * 8;
            
            // Constants (MUST match PHP constants)
            const LATE_DEDUCTION_PER_MINUTE = REGULAR_HOURLY_RATE / 60;
            const OVERTIME_RATE_MULTIPLIER = 1.25;
            const REGULAR_HOLIDAY_RATE_DAILY = REGULAR_DAILY_RATE * 2.0;
            const REGULAR_HOLIDAY_OT_RATE_HOURLY = REGULAR_HOURLY_RATE * 2.6;
            const SPECIAL_HOLIDAY_RATE_DAILY = REGULAR_DAILY_RATE * 1.30;
            const SPECIAL_HOLIDAY_OT_RATE_HOURLY = REGULAR_HOURLY_RATE * 1.69;

            // 1. Calculate Gross Pay
            const regularPay = regularDays * REGULAR_DAILY_RATE;
            const regularOvertimePay = overtimeHours * REGULAR_HOURLY_RATE * OVERTIME_RATE_MULTIPLIER;
            // FIX: Holiday calculation needs to be based on the DAILY rate for the day portion
            const regularHolidayPay = regularHolidayDays * REGULAR_HOLIDAY_RATE_DAILY;
            const regularHolidayOTPay = regularHolidayOvertimeHours * REGULAR_HOURLY_RATE * REGULAR_HOLIDAY_OT_RATE_HOURLY;
            const specialHolidayPay = specialHolidayDays * REGULAR_HOLIDAY_RATE_DAILY;
            const specialHolidayOTPay = specialHolidayOvertimeHours * REGULAR_HOURLY_RATE * SPECIAL_HOLIDAY_OT_RATE_HOURLY;
            
            const totalGross = regularPay + regularOvertimePay + regularHolidayPay + regularHolidayOTPay + specialHolidayPay + specialHolidayOTPay;

            // 2. Calculate Deductions
            const lateDeductions = lateMinutes * LATE_DEDUCTION_PER_MINUTE;
            const mandatoryDeductions = philhealthContribution + sssContribution + pagibigContribution + tinContribution;
            
            const totalDeductions = mandatoryDeductions + lateDeductions + otherDeductions + halfMonthDeductions;
            
            // 3. Calculate Net Pay
            const netPay = totalGross - totalDeductions;

            // 4. Update fields and display
            document.getElementById('lateDeductions').value = lateDeductions.toFixed(2);
            
            document.getElementById('grossPayDisplay').textContent = totalGross.toFixed(2);
            document.getElementById('grossPay').value = totalGross.toFixed(2);
            
            document.getElementById('halfMonthDisplay').textContent = halfMonthDeductions.toFixed(2);
            
            document.getElementById('totalDeductionsDisplay').textContent = totalDeductions.toFixed(2);
            document.getElementById('totalDeductions').value = totalDeductions.toFixed(2);
            
            document.getElementById('netPayDisplay').textContent = netPay.toFixed(2);
            document.getElementById('netPay').value = netPay.toFixed(2);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const saveForm = document.getElementById('savePayrollForm');
            if (saveForm) {
                const inputs = saveForm.querySelectorAll('input[type="number"], input[type="text"]');
                inputs.forEach(input => {
                    input.addEventListener('input', calculatePayroll);
                });
                
                calculatePayroll();
            }
        });
    </script>
</body>
</html>