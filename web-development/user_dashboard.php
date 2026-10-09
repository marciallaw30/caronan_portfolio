<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';

// --- START FIX 1: Check if user is Admin (for password change logic) ---
$isAdmin = ($_SESSION['is_admin'] ?? '') === 'admin';
// --- END FIX 1 ---

// Fetch user's personal information
$employeeNo = $_SESSION['employee_no'];
$employeeData = null;
// FIX: SELECT * is safer here if we don't know the exact column names, but for security, we fetch everything.
$sql_personal = "SELECT * FROM employees WHERE employeeNo = ?";
$stmt_personal = $conn->prepare($sql_personal);
$stmt_personal->bind_param("s", $employeeNo);
$stmt_personal->execute();
$result_personal = $stmt_personal->get_result();
if ($row = $result_personal->fetch_assoc()) {
    $employeeData = $row;
}
$stmt_personal->close();

// Determine which section to display
$section = $_GET['section'] ?? 'profile';
$records = [];
$message = '';
$isPasswordChangeSuccess = false;

// Handle password change form submission
// The check for old_password is removed here as it's now conditional.
if ($_SERVER["REQUEST_METHOD"] == "POST" && $section == 'change_password') {
    
    // --- START FIX 2: Admin Password Logic ---
    $oldPassword = $_POST['old_password'] ?? ''; // This will be empty for Admins
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // Basic validation
    if ($newPassword !== $confirmPassword) {
        $message = "New password and confirmation do not match.";
    } elseif (strlen($newPassword) < 6) {
        $message = "New password must be at least 6 characters long.";
    } else {
        $password_verified = true;

        // Only non-admins need to verify the old password
        if (!$isAdmin) {
            // Verify old password
            $sql_verify = "SELECT password FROM employees WHERE employeeNo = ?";
            $stmt_verify = $conn->prepare($sql_verify);
            $stmt_verify->bind_param("s", $employeeNo);
            $stmt_verify->execute();
            $result_verify = $stmt_verify->get_result();
            $user = $result_verify->fetch_assoc();
            $stmt_verify->close();

            if (!($user && password_verify($oldPassword, $user['password']))) {
                $message = "Incorrect old password.";
                $password_verified = false;
            }
        }
        
        // If password is verified (or bypassed for admin)
        if ($password_verified) {
            // Update password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $sql_update = "UPDATE employees SET password = ? WHERE employeeNo = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("ss", $hashedPassword, $employeeNo);
            if ($stmt_update->execute()) {
                $message = "Password changed successfully!";
                $isPasswordChangeSuccess = true;
            } else {
                $message = "Error updating password.";
            }
            $stmt_update->close();
        }
    }
    // --- END FIX 2 ---
}

// Fetch data based on the selected section
switch ($section) {
    case 'dtr':
        $sql_attendance = "SELECT date, time_in, time_out, late_minutes, overtime_hours, working_hours FROM attendance WHERE employeeNo = ? ORDER BY date DESC";
        $stmt_attendance = $conn->prepare($sql_attendance);
        $stmt_attendance->bind_param("s", $employeeNo);
        $stmt_attendance->execute();
        $records = $stmt_attendance->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_attendance->close();
        break;

    case 'payslip':
        // Correct column names for the payroll table (as fixed in the last step)
        $sql_payslip = "SELECT id, pay_day_schedule, pay_period_start, pay_period_end, net_pay FROM payroll WHERE employeeNo = ? ORDER BY pay_period_start DESC";
        $stmt_payslip = $conn->prepare($sql_payslip);
        $stmt_payslip->bind_param("s", $employeeNo);
        $stmt_payslip->execute();
        $records = $stmt_payslip->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_payslip->close();
        break;
        
    default:
        // 'profile' and 'change_password' handle data retrieval differently (above)
        break;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* START: Copied styles from employee_dashboard.php for consistent look */
        .info-card {
            background-color: #e9f5e9;
            border-left: 5px solid #4CAF50;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-card h3 {
            color: black;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .info-card p {
            margin: 5px 0;
            color: black;
        }
        .info-card p strong {
            display: inline-block;
            width: 150px; /* Adjust as needed for alignment */
        }
        /* END: Copied styles */
        
        /* --- START FIX 3: Table Visibility and Color Fix --- */
        /* This section overrides the generic table styles to meet the user's request. */
        .data-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            border: none; /* Remove table border */
        }
        
        /* Table headers and data cells */
        .data-table th, .data-table td { 
            padding: 8px; 
            text-align: left; 
            /* Make 'columns invisible' by removing cell borders and backgrounds */
            border: none; 
            background-color: transparent !important;
        }
        
        /* Header (Column) Text Color: Gold */
        .data-table th { 
            color: #FFD700; /* Gold */
        }
        
        /* Data Cell Text Color: White */
        .data-table td { 
            color: #FFFFFF; /* White */
        }
        /* --- END FIX 3 --- */
        
        .message { padding: 10px; margin-bottom: 15px; border: 1px solid; border-radius: 4px; }
        .success-message { background-color: #d4edda; color: #155724; border-color: #c3e6cb; }
        .error-message { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
    </style>
</head>
<body>
    <header>
        <h1>Welcome, <?php echo htmlspecialchars($employeeData['firstName'] ?? 'Employee'); ?>!</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <?php if ($message): ?>
                <div class="message <?php echo $isPasswordChangeSuccess ? 'success-message' : 'error-message'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <?php if ($section == 'profile'): ?>
                <h2>My Profile</h2>
                <?php if ($employeeData): ?>
                    <div class="info-card">
                        <h3>Employee Details</h3>
                        <p><strong>Employee No:</strong> <?php echo htmlspecialchars($employeeData['employeeNo'] ?? 'N/A'); ?></p>
                        <p><strong>Department:</strong> <?php echo htmlspecialchars($employeeData['department'] ?? 'N/A'); ?></p>
                        <p><strong>Position:</strong> <?php echo htmlspecialchars($employeeData['position'] ?? 'N/A'); ?></p>
                        <p><strong>Full Name:</strong> <?php echo htmlspecialchars(($employeeData['firstName'] ?? '') . ' ' . ($employeeData['middleName'] ?? '') . ' ' . ($employeeData['lastName'] ?? 'N/A')); ?></p>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($employeeData['email'] ?? 'N/A'); ?></p>
                        <p><strong>Phone Number:</strong> <?php echo htmlspecialchars($employeeData['phoneNumber'] ?? 'N/A'); ?></p>
                        <p><strong>Address:</strong> <?php echo htmlspecialchars($employeeData['address'] ?? 'N/A'); ?></p>
                        <p><strong>Birthdate:</strong> <?php echo htmlspecialchars($employeeData['birthDay'] ?? 'N/A'); ?></p>
                        <p><strong>Birthplace:</strong> <?php echo htmlspecialchars($employeeData['birthPlace'] ?? 'N/A'); ?></p>
                        <p><strong>Gender:</strong> <?php echo htmlspecialchars($employeeData['gender'] ?? 'N/A'); ?></p>
                        <p><strong>Civil Status:</strong> <?php echo htmlspecialchars($employeeData['civilStatus'] ?? 'N/A'); ?></p>
                        <p><strong>Nationality:</strong> <?php echo htmlspecialchars($employeeData['nationality'] ?? 'N/A'); ?></p>
                        <p><strong>Religion:</strong> <?php echo htmlspecialchars($employeeData['religion'] ?? 'N/A'); ?></p>
                    </div>
                    <div class="info-card">
                        <h3>Government & Bank Information</h3>
                        <p><strong>SSS Number:</strong> <?php echo htmlspecialchars($employeeData['sssNumber'] ?? 'N/A'); ?></p>
                        <p><strong>Pag-IBIG Number:</strong> <?php echo htmlspecialchars($employeeData['pagibigNumber'] ?? 'N/A'); ?></p>
                        <p><strong>TIN Number:</strong> <?php echo htmlspecialchars($employeeData['tinNumber'] ?? 'N/A'); ?></p>
                        <p><strong>PhilHealth Number:</strong> <?php echo htmlspecialchars($employeeData['philhealthNumber'] ?? 'N/A'); ?></p>
                        <p><strong>Bank Account:</strong> <?php echo htmlspecialchars($employeeData['bankAccount'] ?? 'N/A'); ?></p>
                        <p><strong>Account Type:</strong> <?php echo htmlspecialchars($employeeData['accountType'] ?? 'N/A'); ?></p>
                    </div>
                    <?php else: ?>
                    <p>Employee data not found.</p>
                <?php endif; ?>

            <?php elseif ($section == 'dtr'): ?>
                <h2>Daily Time Records</h2>
                <?php if (!empty($records)): ?>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Working Hours</th>
                                <th>Overtime Hours</th>
                                <th>Late (Mins)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($records as $record): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($record['date']); ?></td>
                                <td><?php echo htmlspecialchars($record['time_in']); ?></td>
                                <td><?php echo htmlspecialchars($record['time_out']); ?></td>
                                <td><?php echo number_format($record['working_hours'], 2); ?></td>
                                <td><?php echo number_format($record['overtime_hours'], 2); ?></td>
                                <td><?php echo htmlspecialchars($record['late_minutes']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <p>No Daily Time Records found for your account.</p>
                <?php endif; ?>

            <?php elseif ($section == 'payslip'): ?>
                <h2>My Payslips</h2>
                <?php if (!empty($records)): ?>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Pay Day Schedule</th>
                                <th>Pay Period Start</th>
                                <th>Pay Period End</th>
                                <th>Net Pay</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($records as $payslip): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($payslip['pay_day_schedule']); ?></td>
                                <td><?php echo htmlspecialchars($payslip['pay_period_start']); ?></td>
                                <td><?php echo htmlspecialchars($payslip['pay_period_end']); ?></td>
                                <td>₱<?php echo number_format($payslip['net_pay'], 2); ?></td>
                                <td><a href="view_payslip.php?id=<?php echo $payslip['id']; ?>">View Payslip</a></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <p>No payslip records found for your account.</p>
                <?php endif; ?>

            <?php elseif ($section == 'change_password'): ?>
                <h2>Change Password</h2>
                <form action="user_dashboard.php?section=change_password" method="POST">
                    
                    <div class="input-group">
                        <label for="new_password">New Password:</label>
                        <input type="password" id="new_password" name="new_password" required>
                    </div>
                    <div class="input-group">
                        <label for="confirm_password">Confirm New Password:</label>
                        <input type="password" id="confirm_password" name="confirm_password" required>
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            <?php endif; ?>
        </div>
        <aside class="side-menu">
            <?php if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']): ?>
                <h2>Admin Tools</h2>
                <ul>
                    <li><a href="admin_dashboard.php">Admin Dashboard</a></li>
                    <li><a href="manage_employees.php">Manage Employees</a></li>
                    <li><a href="manage_attendance.php">Manage Attendance</a></li>
                    <li><a href="manage_payroll.php">Manage Payroll</a></li>
                </ul>
                <hr>
            <?php endif; ?>
            <h2>My Dashboard</h2>
            <ul>
                <li><a href="admin_dashboard.php">Admin Dashboard</a></li>
                <li><a href="user_dashboard.php?section=profile">My Profile</a></li>
                <li><a href="user_dashboard.php?section=dtr">My DTR</a></li>
                <li><a href="user_dashboard.php?section=payslip">My Payslips</a></li>
                <li><a href="user_dashboard.php?section=change_password">Change Password</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>