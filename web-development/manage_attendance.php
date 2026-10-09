<?php
session_start();
// Security Check: Only admins can access this page
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

// CRITICAL FIX: Set PHP Timezone for data consistency with Kiosk/DB
date_default_timezone_set('Asia/Manila'); 

include 'db_conn.php';

// --- Database Connection Check ---
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// --- INITIALIZE AND SANITIZE VARIABLES ---
$message = '';
$searchQuery = trim($_GET['search'] ?? '');
$departmentFilter = trim($_GET['department_filter'] ?? ''); 
$selectedEmployeeNo = trim($_GET['employeeNo'] ?? '');
$selectedPeriod = $_GET['pay_period'] ?? null;
$selectedMonth = $_GET['month'] ?? date('m');
$selectedYear = $_GET['year'] ?? date('Y');

// Calculation variables
$selectedEmployee = null;
$employeeList = [];
$attendanceRecords = [];
$totalLateMinutes = 0;
$totalOvertimeHours = 0;
$regularWorkDays = 0;
$regularHolidays = 0;
$specialHolidays = 0;
$regularHolidayOvertimeHours = 0;
$specialHolidayOvertimeHours = 0;

// --- HOLIDAY LOGIC (Kept as is - functional) ---
/**
 * Dynamically generates a list of Philippine holidays for a given year.
 */
function generateHolidays($year) {
    // Maundy Thursday is the day before Good Friday, which is two days before Easter.
    $easterDate = new DateTime("@" . easter_date($year));
    $maundyThursday = (clone $easterDate)->modify('-3 days')->format('Y-m-d');
    $goodFriday = (clone $easterDate)->modify('-2 days')->format('Y-m-d');
    $blackSaturday = (clone $easterDate)->modify('-1 day')->format('Y-m-d');

    $holidays = [
        'regular' => [
            "{$year}-01-01", // New Year's Day
            $maundyThursday, // Maundy Thursday
            $goodFriday, // Good Friday
            "{$year}-04-09", // Araw ng Kagitingan
            "{$year}-05-01", // Labor Day
            "{$year}-06-12", // Independence Day
            // Note: National Heroes' Day (Last Monday of August) can be tricky to calculate purely, 
            // but for simplicity, we keep the original logic which may need manual checking.
            // Simplified: Aug 26 is often the observed date. 
            "{$year}-08-26", 
            "{$year}-11-30", // Bonifacio Day
            "{$year}-12-25", // Christmas Day
            "{$year}-12-30", // Rizal Day
        ],
        'special' => [
            $blackSaturday, // Black Saturday
            "{$year}-08-21", // Ninoy Aquino Day
            "{$year}-11-01", // All Saints' Day
            "{$year}-12-08", // Feast of the Immaculate Conception
            "{$year}-12-24", // Christmas Eve
            "{$year}-12-31", // Last Day of the Year
        ],
    ];
    return $holidays;
}

function getHolidayType($date, $holidays) {
    if (in_array($date, $holidays['regular'])) {
        return 'Regular Holiday';
    }
    if (in_array($date, $holidays['special'])) {
        return 'Special Holiday';
    }
    return 'Regular Day';
}

$holidays = generateHolidays((int)$selectedYear); // Generate holidays once

// Determine start and end dates based on the selected pay period
$startDate = null;
$endDate = null;

if ($selectedPeriod && $selectedMonth && $selectedYear) {
    $dateString = "{$selectedYear}-{$selectedMonth}-01";
    if ($selectedPeriod === 'first_half') {
        $startDate = "{$selectedYear}-{$selectedMonth}-01";
        $endDate = "{$selectedYear}-{$selectedMonth}-15";
    } elseif ($selectedPeriod === 'second_half') {
        $startDate = "{$selectedYear}-{$selectedMonth}-16";
        $endDate = date('Y-m-t', strtotime($dateString)); // End of the month
    }
}

// Helper to build redirect URL parameters
function getRedirectParams($employeeNo, $period, $month, $year) {
    $params = "employeeNo=" . urlencode($employeeNo);
    if ($period) {
        $params .= "&pay_period=" . urlencode($period) . "&month=" . urlencode($month) . "&year=" . urlencode($year);
    }
    return $params;
}

// --- 1. Handle Delete Action ---
if (isset($_GET['delete_id'])) {
    $deleteId = filter_var($_GET['delete_id'], FILTER_VALIDATE_INT);
    $redirectParams = getRedirectParams($selectedEmployeeNo, $selectedPeriod, $selectedMonth, $selectedYear);

    if (!$deleteId) {
        header("Location: manage_attendance.php?" . $redirectParams . "&error=1");
        exit();
    }
    
    $sql_delete = "DELETE FROM attendance WHERE id = ?";
    $stmt_delete = $conn->prepare($sql_delete);
    $stmt_delete->bind_param("i", $deleteId);
    
    if ($stmt_delete->execute()) {
        header("Location: manage_attendance.php?" . $redirectParams . "&success=1");
    } else {
        header("Location: manage_attendance.php?" . $redirectParams . "&error=2");
    }
    $stmt_delete->close();
    exit();
}

// --- 2. Handle Form Submission for Adding/Updating Attendance ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_attendance'])) {
    // Sanitize POST input
    $employeeNo = trim($_POST['employeeNo'] ?? '');
    $date = trim($_POST['date'] ?? '');
    $timeIn = !empty($_POST['time_in']) ? trim($_POST['time_in']) : null;
    $timeOut = !empty($_POST['time_out']) ? trim($_POST['time_out']) : null;
    $lateMinutes = filter_var($_POST['late_minutes'] ?? 0, FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) ?? 0;
    $overtimeHours = filter_var($_POST['overtime_hours'] ?? 0, FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) ?? 0;
    $workingHours = filter_var($_POST['working_hours'] ?? 0, FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) ?? 0;
    $attendanceId = filter_var($_POST['attendance_id'] ?? null, FILTER_VALIDATE_INT);

    $redirectParams = getRedirectParams($employeeNo, $selectedPeriod, $selectedMonth, $selectedYear);

    if (empty($employeeNo) || empty($date)) {
        header("Location: manage_attendance.php?" . $redirectParams . "&error=3");
        exit();
    }

    if ($attendanceId) {
        // UPDATE existing record
        $sql_update = "UPDATE attendance SET date = ?, time_in = ?, time_out = ?, late_minutes = ?, overtime_hours = ?, working_hours = ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("sssdddi", $date, $timeIn, $timeOut, $lateMinutes, $overtimeHours, $workingHours, $attendanceId);
        
        if ($stmt_update->execute()) {
            header("Location: manage_attendance.php?" . $redirectParams . "&success=2");
        } else {
            header("Location: manage_attendance.php?" . $redirectParams . "&error=4");
        }
        $stmt_update->close();
    } else {
        // INSERT new record
        $sql_check_duplicate = "SELECT id FROM attendance WHERE employeeNo = ? AND date = ?";
        $stmt_check_duplicate = $conn->prepare($sql_check_duplicate);
        $stmt_check_duplicate->bind_param("ss", $employeeNo, $date);
        $stmt_check_duplicate->execute();
        $result_check = $stmt_check_duplicate->get_result();
        
        if ($result_check->num_rows > 0) {
            header("Location: manage_attendance.php?" . $redirectParams . "&error=5"); // Duplicate record
        } else {
            $sql_insert = "INSERT INTO attendance (employeeNo, date, time_in, time_out, late_minutes, overtime_hours, working_hours)
                           VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert);
            $stmt_insert->bind_param("ssssddd", $employeeNo, $date, $timeIn, $timeOut, $lateMinutes, $overtimeHours, $workingHours);
            
            if ($stmt_insert->execute()) {
                header("Location: manage_attendance.php?" . $redirectParams . "&success=3");
            } else {
                header("Location: manage_attendance.php?" . $redirectParams . "&error=6");
            }
            $stmt_insert->close();
        }
        $stmt_check_duplicate->close();
    }
    exit();
}

// --- 3. Main Page Logic: Fetch Data ---

if (isset($_GET['success'])) {
    $msg_type = (int)$_GET['success'];
    if ($msg_type === 1) $message = "✅ Record deleted successfully.";
    if ($msg_type === 2) $message = "✅ Attendance record updated successfully.";
    if ($msg_type === 3) $message = "✅ New attendance record added successfully.";
} elseif (isset($_GET['error'])) {
    $msg_type = (int)$_GET['error'];
    $message = "❌ Error occurred. Code: E" . $msg_type . ".";
}


if (!empty($selectedEmployeeNo)) {
    // --- Detailed Employee View ---
    
    // Fetch employee details
    $sql_emp = "SELECT employeeNo, firstName, lastName, department FROM employees WHERE employeeNo = ?";
    $stmt_emp = $conn->prepare($sql_emp);
    $stmt_emp->bind_param("s", $selectedEmployeeNo);
    $stmt_emp->execute();
    $result_emp = $stmt_emp->get_result();
    $selectedEmployee = $result_emp->fetch_assoc();
    $stmt_emp->close();
    
    if ($selectedEmployee) {
        // Fetch attendance records with date range filter
        $sql_attendance = "SELECT * FROM attendance WHERE employeeNo = ?";
        $bind_params = "s";
        $bind_values = [&$selectedEmployeeNo]; // Always use reference for call_user_func_array

        if ($startDate && $endDate) {
            $sql_attendance .= " AND date BETWEEN ? AND ?";
            $bind_params .= "ss";
            $bind_values[] = &$startDate;
            $bind_values[] = &$endDate;
        }

        $sql_attendance .= " ORDER BY date DESC";
        $stmt_attendance = $conn->prepare($sql_attendance);
        
        if ($stmt_attendance) {
            // FIX: Use robust dynamic binding (call_user_func_array)
            $bind_params_with_types = array_merge([$bind_params], $bind_values);
            call_user_func_array([$stmt_attendance, 'bind_param'], $bind_params_with_types);
            
            $stmt_attendance->execute();
            $result_attendance = $stmt_attendance->get_result();
            
            while ($row = $result_attendance->fetch_assoc()) {
                $row['holiday_type'] = getHolidayType($row['date'], $holidays);
                $attendanceRecords[] = $row;
                $totalLateMinutes += (float)$row['late_minutes'];
                $totalOvertimeHours += (float)$row['overtime_hours'];
                
                // Calculate working hours related stats
                $workingHours = (float)$row['working_hours'];

                if ($workingHours > 0) {
                    if ($row['holiday_type'] == 'Regular Holiday') {
                        $regularHolidays++;
                        $regularHolidayOvertimeHours += (float)$row['overtime_hours'];
                    } elseif ($row['holiday_type'] == 'Special Holiday') {
                        $specialHolidays++;
                        $specialHolidayOvertimeHours += (float)$row['overtime_hours'];
                    } else {
                        $regularWorkDays++;
                    }
                }
            }
            $stmt_attendance->close();
        } else {
            $message = "Database error preparing attendance fetch: " . $conn->error;
        }
    } else {
        $message = "Employee not found.";
    }

} else {
    // --- Employee List View ---

    // Fetch all departments for filter dropdown (if not already done)
    $departments = [];
    $sql_departments = "SELECT DISTINCT department FROM employees WHERE department IS NOT NULL AND department != '' ORDER BY department ASC";
    $result_departments = $conn->query($sql_departments);
    if ($result_departments) {
        while ($row = $result_departments->fetch_assoc()) {
            $departments[] = $row['department'];
        }
    }

    // Build query for employee list (with department and search filters)
    $sql_list = "SELECT employeeNo, firstName, lastName, department FROM employees";
    $whereClauses = [];
    $paramTypes = '';
    $bindParams = [];

    if (!empty($departmentFilter)) {
        $whereClauses[] = "department = ?";
        $paramTypes .= 's';
        $bindParams[] = &$departmentFilter; 
    }

    if (!empty($searchQuery)) {
        // Use CONCAT for name searching across first and last name
        $whereClauses[] = "(firstName LIKE ? OR lastName LIKE ?)";
        $paramTypes .= 'ss';
        $searchPattern = '%' . $searchQuery . '%';
        $bindParams[] = &$searchPattern;
        $bindParams[] = &$searchPattern;
    }
    
    if (!empty($whereClauses)) {
        $sql_list .= " WHERE " . implode(' AND ', $whereClauses);
    }
    $sql_list .= " ORDER BY lastName, firstName";

    $stmt_list = $conn->prepare($sql_list);

    if ($stmt_list) {
        if (!empty($paramTypes)) {
            // FIX: Use robust dynamic binding (call_user_func_array)
            $bind_params_with_types = array_merge([$paramTypes], $bindParams);
            call_user_func_array([$stmt_list, 'bind_param'], $bind_params_with_types);
        }
        
        $stmt_list->execute();
        $result_list = $stmt_list->get_result();
        
        while ($row = $result_list->fetch_assoc()) {
            $employeeList[] = $row;
        }
        $stmt_list->close();
    } else {
        $message = "Database error preparing employee list fetch: " . $conn->error;
    }
}
$conn->close();

// Final calculation for display
$totalRegularOvertimeHours = $totalOvertimeHours - $regularHolidayOvertimeHours - $specialHolidayOvertimeHours;

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Attendance</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* General Styles for simplicity */
        body { font-family: Arial, sans-serif; margin: 0; background-color: #f4f4f4; color: #333; }
        .page-container { max-width: 1200px; margin: auto; padding: 20px; }
        header h1 { color: #d4b609ff; text-align: center; }
        .main-content { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .back-link { display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }
        .message { padding: 10px; border-radius: 5px; margin-bottom: 20px; font-weight: bold; }
        .message.success { background-color: #d4edda; color: #155724; }
        .message.error { background-color: #f8d7da; color: #721c24; }
        .payroll-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .payroll-table th, .payroll-table td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        .payroll-table th { background-color: #f2f2f2; }
        .input-group input, .input-group select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
        .top-section-container { display: flex; gap: 20px; margin-bottom: 20px; }
        .add-record-form-container, .summary-section { flex: 1; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; }
        .add-record-form-container input:not([type="hidden"]), .add-record-form-container select { width: 100%; }
        .existing-records-section { margin-top: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; }
        .pay-period-form .input-group { display: flex; gap: 15px; align-items: center; margin-bottom: 15px; }
        .pay-period-form .input-group label { min-width: 80px; }
        .summary-content strong { display: inline-block; min-width: 50px; }
        .action-link { padding: 5px 8px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 3px; display: inline-block; margin-left: 5px;}
        .action-link.delete { background-color: #dc3545; }
    </style>
</head>
<body>
    <header><h1>Manage Attendance</h1></header>
    <div class="page-container">
        <div class="main-content">
            <a href="admin_dashboard.php" class="back-link">← Back to Admin Dashboard</a>
            
            <?php if ($message): ?>
                <p class="message <?php echo (strpos($message, 'Error') !== false || strpos($message, '❌') !== false) ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </p>
            <?php endif; ?>

            <?php if ($selectedEmployee): ?>
                <h2 style="color: #0056b3;">Attendance for <?php echo htmlspecialchars($selectedEmployee['firstName'] . ' ' . $selectedEmployee['lastName'] . ' (' . $selectedEmployee['employeeNo'] . ')'); ?></h2>
                <a href="manage_attendance.php" class="back-link">← Back to Employee List</a>

                <div class="top-section-container">
                    
                    <div class="summary-section">
                        <form method="GET" action="manage_attendance.php" class="pay-period-form" id="filterForm">
                            <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($selectedEmployee['employeeNo']); ?>">
                            <h3 style="color: #0056b3;">Filter & Summary</h3>
                            <div class="input-group">
                                <label for="pay_period">Period:</label>
                                <select id="pay_period" name="pay_period" onchange="this.form.submit()">
                                    <option value="">Full Month</option>
                                    <option value="first_half" <?php echo ($selectedPeriod === 'first_half') ? 'selected' : ''; ?>>1st to 15th</option>
                                    <option value="second_half" <?php echo ($selectedPeriod === 'second_half') ? 'selected' : ''; ?>>16th to End of Month</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label for="month">Month:</label>
                                <select id="month" name="month" onchange="this.form.submit()">
                                    <?php for ($m = 1; $m <= 12; $m++): ?>
                                        <option value="<?php echo str_pad($m, 2, '0', STR_PAD_LEFT); ?>" <?php echo ((int)$selectedMonth == $m) ? 'selected' : ''; ?>>
                                            <?php echo date('F', mktime(0, 0, 0, $m, 10)); ?>
                                        </option>
                                    <?php endfor; ?>
                                </select>
                            </div>
                            <div class="input-group">
                                <label for="year">Year:</label>
                                <select id="year" name="year" onchange="this.form.submit()">
                                    <?php for ($y = date('Y'); $y >= date('Y') - 5; $y--): ?>
                                        <option value="<?php echo $y; ?>" <?php echo ($selectedYear == $y) ? 'selected' : ''; ?>>
                                            <?php echo $y; ?>
                                        </option>
                                    <?php endfor; ?>
                                </select>
                            </div>
                        </form>
                        
                        <div class="summary-content" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
                            <p>Regular Work Days: <strong><?php echo $regularWorkDays; ?></strong></p>
                            <p>Regular Holidays: <strong><?php echo $regularHolidays; ?></strong></p>
                            <p>Special Holidays: <strong><?php echo $specialHolidays; ?></strong></p>
                            <p>Total Late Minutes: <strong><?php echo number_format($totalLateMinutes, 0); ?></strong></p>
                            <p>Total Regular OT Hours: <strong><?php echo number_format($totalRegularOvertimeHours, 2); ?></strong></p>
                            <p>Reg Holiday OT Hours: <strong><?php echo number_format($regularHolidayOvertimeHours, 2); ?></strong></p>
                            <p>Special Holiday OT Hours: <strong><?php echo number_format($specialHolidayOvertimeHours, 2); ?></strong></p>
                        </div>
                    </div>

                    <div class="add-record-form-container">
                        <h3 style="color: #0056b3;">Add New Record</h3>
                        <form method="POST" action="manage_attendance.php?<?php echo getRedirectParams($selectedEmployeeNo, $selectedPeriod, $selectedMonth, $selectedYear); ?>" class="add-record-form">
                            <input type="hidden" name="save_attendance" value="1">
                            <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($selectedEmployee['employeeNo']); ?>">
                            <div class="input-group"><label for="date">Date</label><input type="date" id="date" name="date" required></div>
                            <div class="input-group"><label for="time_in">Time In</label><input type="time" id="time_in" name="time_in"></div>
                            <div class="input-group"><label for="time_out">Time Out</label><input type="time" id="time_out" name="time_out"></div>
                            <div class="input-group"><label for="late_minutes">Late (in Mins)</label><input type="number" id="late_minutes" name="late_minutes" step="1" value="0"></div>
                            <div class="input-group"><label for="overtime_hours">Overtime (in Hrs)</label><input type="number" id="overtime_hours" name="overtime_hours" step="0.01" value="0"></div>
                            <div class="input-group"><label for="working_hours">Working Hours</label><input type="number" id="working_hours" name="working_hours" step="0.01" value="0" required></div>
                            <button type="submit">Add Attendance Record</button>
                        </form>
                    </div>
                </div>

                <hr>

                <div class="existing-records-section">
                    <h3 style="color: #0056b3;">Existing Records (<?php echo htmlspecialchars($startDate . ' to ' . $endDate); ?>)</h3>
                    <table class="payroll-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Working Hrs</th>
                                <th>Late Mins</th>
                                <th>OT Hrs</th>
                                <th>Holiday Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($attendanceRecords)): ?>
                                <?php foreach ($attendanceRecords as $record): ?>
                                <tr>
                                    <form method="POST" action="manage_attendance.php?<?php echo getRedirectParams($record['employeeNo'], $selectedPeriod, $selectedMonth, $selectedYear); ?>">
                                        <input type="hidden" name="save_attendance" value="1">
                                        <input type="hidden" name="attendance_id" value="<?php echo htmlspecialchars($record['id']); ?>">
                                        <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($record['employeeNo']); ?>">
                                        
                                        <td><input type="date" name="date" value="<?php echo htmlspecialchars($record['date']); ?>" required></td>
                                        
                                        <td><input type="time" name="time_in" value="<?php echo htmlspecialchars($record['time_in'] ?? ''); ?>" onchange="updateRowWorkingHours(this)"></td>
                                        <td><input type="time" name="time_out" value="<?php echo htmlspecialchars($record['time_out'] ?? ''); ?>" onchange="updateRowWorkingHours(this)"></td>
                                        
                                        <td class="working_hours_display"><?php echo number_format((float)$record['working_hours'], 2); ?></td>
                                        <input type="hidden" name="working_hours" value="<?php echo htmlspecialchars($record['working_hours']); ?>">
                                        
                                        <td><input type="number" name="late_minutes" value="<?php echo htmlspecialchars($record['late_minutes']); ?>" step="1"></td>
                                        
                                        <td><input type="number" name="overtime_hours" value="<?php echo htmlspecialchars($record['overtime_hours']); ?>" step="0.01"></td>
                                        <td><?php echo htmlspecialchars($record['holiday_type']); ?></td>
                                        <td>
                                            <button type="submit">Update</button>
                                            <a href="manage_attendance.php?<?php echo getRedirectParams($record['employeeNo'], $selectedPeriod, $selectedMonth, $selectedYear); ?>&delete_id=<?php echo htmlspecialchars($record['id']); ?>" class="action-link delete" onclick="return confirm('Delete record for <?php echo htmlspecialchars($record['date']); ?>?');">Delete</a>
                                        </td>
                                    </form>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="8">No attendance records found for this employee in the selected range (<?php echo htmlspecialchars($startDate . ' to ' . $endDate); ?>).</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            <?php else: ?>
                <h2 style="color: #9e0e0eff;">Employee List</h2>
                <a href="kiosk_login.php" class="button-link" style="margin-bottom: 20px;">Launch Attendance Kiosk</a>
                <form method="GET" action="manage_attendance.php" class="search-form">
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <div class="input-group" style="flex: 1;">
                            <input type="text" name="search" placeholder="Search by Employee Name/ID..." value="<?php echo htmlspecialchars($searchQuery); ?>">
                        </div>
                        <div class="input-group" style="flex: 1;">
                            <select name="department_filter" onchange="this.form.submit()">
                                <option value="">Filter by Department</option>
                                <?php foreach ($departments as $dept): ?>
                                    <option value="<?php echo htmlspecialchars($dept); ?>" <?php echo ($departmentFilter === $dept) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($dept); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <button type="submit">Filter/Search</button>
                    </div>
                </form>
                <table class="payroll-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($employeeList)): ?>
                            <?php foreach ($employeeList as $employee): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($employee['firstName'] . ' ' . $employee['lastName']); ?></td>
                                    <td><?php echo htmlspecialchars($employee['employeeNo']); ?></td>
                                    <td><?php echo htmlspecialchars($employee['department']); ?></td>
                                    <td>
                                        <a href="manage_attendance.php?employeeNo=<?php echo htmlspecialchars($employee['employeeNo']); ?>">Manage Attendance</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="4">No employees found matching the criteria.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
    
    <script>
        /**
         * Calculates Working Hours (max 8, minus 1hr break) and updates the hidden and display fields
         * for the row being edited in the existing records table.
         * Late Minutes are NOT automatically calculated.
         * @param {HTMLElement} inputElement The time_in or time_out input that triggered the change.
         */
        function updateRowWorkingHours(inputElement) {
            const row = inputElement.closest('tr');
            const timeInInput = row.querySelector('input[name="time_in"]');
            const timeOutInput = row.querySelector('input[name="time_out"]');
            const workingHoursHiddenInput = row.querySelector('input[name="working_hours"]');
            const workingHoursDisplayCell = row.querySelector('.working_hours_display');

            const timeIn = timeInInput.value;
            const timeOut = timeOutInput.value;

            let workingHours = 0;
            
            if (timeIn && timeOut) {
                // Use a fixed date to calculate time difference accurately
                const fixedDate = '1970/01/01 '; 
                
                const timeInDate = new Date(fixedDate + timeIn);
                let timeOutDate = new Date(fixedDate + timeOut);
                
                // Handle cross-midnight shift (Time Out is numerically less than or equal to Time In)
                if (timeOutDate.getTime() <= timeInDate.getTime()) {
                    timeOutDate = new Date(timeOutDate.getTime() + 24 * 60 * 60 * 1000);
                }

                if (!isNaN(timeInDate) && !isNaN(timeOutDate) && timeOutDate > timeInDate) {
                    const diffMs = timeOutDate.getTime() - timeInDate.getTime();
                    const totalHours = diffMs / (1000 * 60 * 60);
                    
                    // Deduct 1 hour for break (if total work time is > 1 hour)
                    const hoursAfterBreak = (totalHours > 1) ? totalHours - 1 : totalHours;
                    
                    // Cap the working hours at a maximum of 8
                    workingHours = Math.min(8, Math.max(0, hoursAfterBreak));
                }
            }
            
            // Update the fields, ensuring two decimal places
            workingHoursHiddenInput.value = workingHours.toFixed(2);
            workingHoursDisplayCell.textContent = workingHours.toFixed(2);
        }
    </script>
</body>
</html>