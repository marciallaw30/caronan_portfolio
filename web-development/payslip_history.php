<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';

// --- Database Connection Check ---
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// --- INITIALIZE VARIABLES ---
$message = '';
$employees = [];
$departments = [];
$payslips = [];
// Sanitize/prepare input variables
$selectedEmployeeNo = trim($_GET['employeeNo'] ?? ''); 
$selectedDepartment = trim($_GET['department_filter'] ?? ''); 
$selectedSummaryEmployee = null;

// --- HELPER FUNCTION ---
function getEmployeeByNo($conn, $employeeNo) {
    $stmt = $conn->prepare("SELECT employeeNo, firstName, lastName FROM employees WHERE employeeNo = ?");
    if ($stmt === false) return null;
    $stmt->bind_param("s", $employeeNo);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    $stmt->close();
    return $data;
}

// 1. Handle Payslip Deletion (redirects away if successful)
if (isset($_GET['delete_payslip_id'])) {
    // Ensure the ID is an integer
    $payslipID = filter_var($_GET['delete_payslip_id'], FILTER_VALIDATE_INT);
    // Maintain context after deletion
    $redirectEmployeeNo = urlencode($selectedEmployeeNo);
    $redirectDepartment = urlencode($selectedDepartment);
    
    // Build the redirect URL base
    $redirectUrl = "payslip_history.php?employeeNo=$redirectEmployeeNo&department_filter=$redirectDepartment";

    if (!$payslipID) {
        header("Location: $redirectUrl&error=1");
        exit();
    }
    
    $sql_delete = "DELETE FROM payroll WHERE id = ?";
    $stmt_delete = $conn->prepare($sql_delete);

    if ($stmt_delete === false) {
        header("Location: $redirectUrl&error=2"); // Error preparing statement
        exit();
    }

    $stmt_delete->bind_param("i", $payslipID);
    
    if ($stmt_delete->execute()) {
        // SUCCESS: Redirect with success flag to prevent form resubmission on refresh
        header("Location: $redirectUrl&success_delete=1");
        exit();
    } else {
        // ERROR: Redirect with error flag
        header("Location: $redirectUrl&error=3");
        exit();
    }
    $stmt_delete->close();
}

// 2. Fetch Unique Departments for Filter Dropdown
$sql_departments = "SELECT DISTINCT department FROM employees 
                    WHERE department IS NOT NULL AND department != '' 
                    ORDER BY department ASC";
$result_departments = $conn->query($sql_departments);

if ($result_departments) {
    while ($row = $result_departments->fetch_assoc()) {
        // Sanitize department name before adding to array
        $departments[] = htmlspecialchars($row['department']);
    }
}

// 3. Fetch Employees based on Department Filter (for the second dropdown)
$sql_employees = "SELECT employeeNo, firstName, lastName, department FROM employees";
$whereClauses = [];
$paramTypes = '';
$bindParams = [];

if (!empty($selectedDepartment)) {
    // Only fetch employees if the department matches the selected (sanitized) department
    $whereClauses[] = "department = ?";
    $paramTypes .= 's';
    $bindParams[] = &$selectedDepartment; 
}

if (!empty($whereClauses)) {
    $sql_employees .= " WHERE " . implode(' AND ', $whereClauses);
}
$sql_employees .= " ORDER BY lastName, firstName";

$stmt_employees = $conn->prepare($sql_employees);

if ($stmt_employees === false) {
     $message = "Database error preparing employee fetch: " . $conn->error;
} elseif (!empty($paramTypes)) {
    // Robust Dynamic Binding using call_user_func_array with references
    $refs = [];
    $refs[] = $paramTypes;
    foreach ($bindParams as $key => $value) {
        $refs[] = &$bindParams[$key];
    }
    
    if (!call_user_func_array([$stmt_employees, 'bind_param'], $refs)) {
        $message = "Error binding parameters for employee fetch.";
    }
}

// Execute the statement if no major errors occurred
if (empty($message) && $stmt_employees) {
    $stmt_employees->execute();
    $result_employees = $stmt_employees->get_result();

    if ($result_employees->num_rows > 0) {
        while ($row = $result_employees->fetch_assoc()) {
            $employees[] = $row;
        }
    }
    $stmt_employees->close();
}


// 4. Fetch Payslips for the selected employee
if (!empty($selectedEmployeeNo)) {
    // Validate if the selected employee exists and belongs to the filtered department (optional but good security)
    $selectedSummaryEmployee = getEmployeeByNo($conn, $selectedEmployeeNo);

    // If the employee exists, fetch their payslips
    if ($selectedSummaryEmployee) {
        $sql_payslips = "SELECT id, pay_period_start, pay_period_end, net_pay FROM payroll WHERE employeeNo = ? ORDER BY pay_period_start DESC";
        $stmt_payslips = $conn->prepare($sql_payslips);
        
        if ($stmt_payslips === false) {
             $message = "Database error preparing payslip fetch: " . $conn->error;
        } else {
            $stmt_payslips->bind_param("s", $selectedEmployeeNo);
            $stmt_payslips->execute();
            $result_payslips = $stmt_payslips->get_result();
            if ($result_payslips) {
                $payslips = $result_payslips->fetch_all(MYSQLI_ASSOC);
            }
            $stmt_payslips->close();
        }
    }
}

// 5. Check for GET messages (Delete success/error)
// Check the GET parameters set by the redirect after deletion
if (isset($_GET['success_delete'])) {
    $message = "✅ Payslip deleted successfully.";
} elseif (isset($_GET['error'])) {
    $message = "❌ Error deleting payslip. Please try again.";
}

// Final check: If no employee is selected but department filter is set, clear $selectedEmployeeNo to prevent showing old results
if (empty($selectedEmployeeNo) && !empty($selectedDepartment)) {
    $payslips = [];
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payslip History</title>
    <link rel="stylesheet" href="style.css"> 
    <style>
        /* CSS from original file is largely fine. Only keeping critical styles here for brevity and focusing on functionality */
        .payroll-form-group {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .filter-form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            margin-top: 5px;
        }
        .payroll-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            border: none; 
        }

        .payroll-table th, .payroll-table td {
            padding: 12px;
            text-align: left;
            border: none;
            background-color: transparent !important;
        }

        .payroll-table th {
            color: #FFD700;
            background-color: #555 !important;
        }

        .payroll-table td {
            color: #FFFFFF;
        }
        .history-controls {
            display: flex;
            gap: 15px;
        }
        .message-success {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .message-error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .empty-payslip-message {
            background-color: #ffe5cc;
            color: #663300;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ffcc99;
        }
        .action-link {
            padding: 5px 8px;
            margin-right: 5px;
            text-decoration: none;
            border-radius: 3px;
        }
        .action-link.edit { background-color: #007bff; color: white; }
        .action-link.view { background-color: #28a745; color: white; }
        .action-link.delete { background-color: #dc3545; color: white; }
    </style>
</head>
<body>
    <header>
        <h1>Payslip History</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2>View Employee Payslips</h2>
            
            <?php if (!empty($message)): ?>
                <div class="<?php echo (strpos($message, 'Error') !== false || strpos($message, '❌') !== false) ? 'message-error' : 'message-success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <div class="payroll-form-group">
                <h2 style="color: #cfb20dff;">View Existing Payslips</h2>
                <form action="payslip_history.php" method="GET" class="filter-form">
                    <div class="history-controls">
                        <div class="input-group">
                            <label style="color: #990d0dff;" for="department_filter">Filter by Department:</label>
                            <select id="department_filter" name="department_filter" onchange="this.form.submit()">
                                <option value="">All Departments</option> 
                                <?php foreach ($departments as $dept): ?>
                                    <option value="<?php echo htmlspecialchars($dept); ?>" 
                                        <?php echo ($selectedDepartment == $dept) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($dept); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="input-group">
                            <label style="color: #990d0dff;" for="employeeNo">Select Employee:</label>
                            <select name="employeeNo" id="employeeNo" required onchange="this.form.submit()">
                                <option value="">--Select an Employee--</option>
                                <?php foreach ($employees as $emp): ?>
                                    <option value="<?php echo htmlspecialchars($emp['employeeNo']); ?>"
                                        <?php echo ($selectedEmployeeNo == $emp['employeeNo']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($emp['firstName'] . ' ' . $emp['lastName'] . ' (' . $emp['employeeNo'] . ')'); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <input type="hidden" name="department_filter" value="<?php echo htmlspecialchars($selectedDepartment); ?>">
                        </div>
                    </div>
                    </form>
            </div>

            <?php if ($selectedSummaryEmployee && !empty($selectedEmployeeNo)): ?>
                <?php if (!empty($payslips)): ?>
                    <div class="results-section">
                        <h3>Payslip History for <?php echo htmlspecialchars($selectedSummaryEmployee['firstName'] . ' ' . $selectedSummaryEmployee['lastName']); ?></h3>
                        <table class="payroll-table">
                            <thead>
                                <tr>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Net Pay</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($payslips as $payslip): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($payslip['pay_period_start']); ?></td>
                                    <td><?php echo htmlspecialchars($payslip['pay_period_end']); ?></td>
                                    <td>₱<?php echo number_format((float)($payslip['net_pay'] ?? 0), 2); ?></td>
                                    <td>
                                        <a href="generate_payslip.php?edit_payslip_id=<?php echo $payslip['id']; ?>" class="action-link edit">Edit</a>
                                        <a href="view_payslip.php?id=<?php echo $payslip['id']; ?>&is_admin=1" class="action-link view">View</a>
                                        <a href="payslip_history.php?delete_payslip_id=<?php echo $payslip['id']; ?>&employeeNo=<?php echo urlencode($selectedEmployeeNo); ?>&department_filter=<?php echo urlencode($selectedDepartment); ?>" class="action-link delete" onclick="return confirm('Are you sure you want to delete this payslip (ID: <?php echo $payslip['id']; ?>)? This action cannot be undone.');">Delete</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <div class="empty-payslip-message">
                        The employee **<?php echo htmlspecialchars($selectedSummaryEmployee['firstName'] . ' ' . $selectedSummaryEmployee['lastName']); ?>** does not have existing payslip records.
                    </div>
                <?php endif; ?>
            <?php elseif (!empty($selectedDepartment) && empty($selectedEmployeeNo)): ?>
                 <div class="empty-payslip-message">
                    Please select an employee from the list to view their payslips.
                </div>
            <?php endif; ?>
        </div>

        <aside class="side-menu">
            <h2>Payroll Tools</h2>
            <ul>
                <li><a href="manage_payroll.php">Manage Payroll</a></li>
                <li><a href="admin_dashboard.php">Admin Dashboard</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>