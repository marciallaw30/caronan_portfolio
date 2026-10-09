<?php
session_start();
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';
$employeeNo = $_SESSION['employee_no'];
$is_admin = $_SESSION['is_admin'] ?? false;
$message = '';

// Fetch employee's personal info from the database
$sql_personal = "SELECT * FROM employees WHERE employeeNo = ?";
$stmt_personal = $conn->prepare($sql_personal);
$stmt_personal->bind_param("s", $employeeNo);
$stmt_personal->execute();
$result_personal = $stmt_personal->get_result();
$employeeData = $result_personal->fetch_assoc();
$stmt_personal->close();

// Determine which section to display
$section = $_GET['section'] ?? 'profile';
$records = [];

switch ($section) {
    case 'dtr':
        // Fetch attendance records for display
        $sql_attendance = "SELECT date, time_in, time_out, late_minutes, overtime_hours, working_hours FROM attendance WHERE employeeNo = ? ORDER BY date DESC";
        $stmt_attendance = $conn->prepare($sql_attendance);
        $stmt_attendance->bind_param("s", $employeeNo);
        $stmt_attendance->execute();
        $records = $stmt_attendance->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_attendance->close();
        break;
    case 'payslip':
        // Fetch payslip dates for display
        $sql_payslip_dates = "SELECT payDate, id FROM payroll WHERE employeeNo = ? ORDER BY payDate DESC";
        $stmt_payslip_dates = $conn->prepare($sql_payslip_dates);
        $stmt_payslip_dates->bind_param("s", $employeeNo);
        $stmt_payslip_dates->execute();
        $records = $stmt_payslip_dates->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_payslip_dates->close();
        break;
    case 'change_password':
        // The form will be displayed directly
        break;
    case 'profile':
        // Profile section is the default, so no fetch logic is needed here
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
    </style>
</head>
<body>
    <header>
        <h1>Employee Dashboard</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <?php if ($section === 'profile' && $employeeData): ?>
                <h2>My Personal Information</h2>
                <div class="info-card">
                    <h3>Employee Details</h3>
                    <p><strong>Employee No:</strong> <?php echo htmlspecialchars($employeeData['employeeNo']); ?></p>
                    <p><strong>Department:</strong> <?php echo htmlspecialchars($employeeData['department'] ?? 'N/A'); ?></p>
                    <p><strong>Position:</strong> <?php echo htmlspecialchars($employeeData['position'] ?? 'N/A'); ?></p>
                    <p><strong>Full Name:</strong> <?php echo htmlspecialchars($employeeData['firstName'] . ' ' . $employeeData['middleName'] . ' ' . $employeeData['lastName']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($employeeData['email']); ?></p>
                    <p><strong>Phone Number:</strong> <?php echo htmlspecialchars($employeeData['phoneNumber']); ?></p>
                    <p><strong>Address:</strong> <?php echo htmlspecialchars($employeeData['address']); ?></p>
                    <p><strong>Birthdate:</strong> <?php echo htmlspecialchars($employeeData['birthDay']); ?></p>
                    <p><strong>Birthplace:</strong> <?php echo htmlspecialchars($employeeData['birthPlace']); ?></p>
                    <p><strong>Gender:</strong> <?php echo htmlspecialchars($employeeData['gender']); ?></p>
                    <p><strong>Civil Status:</strong> <?php echo htmlspecialchars($employeeData['civilStatus']); ?></p>
                    <p><strong>Nationality:</strong> <?php echo htmlspecialchars($employeeData['nationality']); ?></p>
                    <p><strong>Religion:</strong> <?php echo htmlspecialchars($employeeData['religion']); ?></p>
                </div>
                <div class="info-card">
                    <h3>Government & Bank Information</h3>
                    <p><strong>SSS Number:</strong> <?php echo htmlspecialchars($employeeData['sssNumber']); ?></p>
                    <p><strong>Pag-IBIG Number:</strong> <?php echo htmlspecialchars($employeeData['pagibigNumber']); ?></p>
                    <p><strong>TIN Number:</strong> <?php echo htmlspecialchars($employeeData['tinNumber']); ?></p>
                    <p><strong>PhilHealth Number:</strong> <?php echo htmlspecialchars($employeeData['philhealthNumber']); ?></p>
                    <p><strong>Bank Account:</strong> <?php echo htmlspecialchars($employeeData['bankAccount']); ?></p>
                    <p><strong>Account Type:</strong> <?php echo htmlspecialchars($employeeData['accountType']); ?></p>
                </div>
            <?php elseif ($section === 'dtr'): ?>
                <h3>My Daily Time Record</h3>
                <table class="payroll-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Working Hrs</th>
                            <th>Late Mins</th>
                            <th>Overtime Hrs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($records)): ?>
                            <?php foreach ($records as $record): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($record['date']); ?></td>
                                    <td><?php echo htmlspecialchars($record['time_in']); ?></td>
                                    <td><?php echo htmlspecialchars($record['time_out']); ?></td>
                                    <td><?php echo number_format($record['working_hours'], 2); ?></td>
                                    <td><?php echo htmlspecialchars($record['late_minutes']); ?></td>
                                    <td><?php echo number_format($record['overtime_hours'], 2); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="6">No attendance records found.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php elseif ($section === 'payslip'): ?>
                <h3>My Payslips</h3>
                <table class="payroll-table">
                    <thead>
                        <tr>
                            <th>Payslip Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($records)): ?>
                            <?php foreach ($records as $record): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($record['payDate']); ?></td>
                                    <td>
                                        <a href="view_payslip.php?id=<?php echo htmlspecialchars($record['id']); ?>">View Payslip</a>
                                        <?php if ($is_admin): ?>
                                            | <a href="manage_payroll.php?edit_id=<?php echo htmlspecialchars($record['id']); ?>">Edit</a>
                                            | <a href="delete_payslip.php?id=<?php echo htmlspecialchars($record['id']); ?>" onclick="return confirm('Are you sure you want to delete this payslip?');">Delete</a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="2">No payslip records found.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php elseif ($section === 'change_password'): ?>
                <h3>Change Password</h3>
                <form action="change_password.php" method="POST">
                    <div class="input-group">
                        <label for="current_password">Current Password:</label>
                        <input type="password" id="current_password" name="current_password" required>
                    </div>
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
            <?php else: ?>
                <div class="welcome-section">
                    <h2>Welcome, <?php echo htmlspecialchars($employeeData['firstName']); ?>!</h2>
                    <p>This is your personalized employee dashboard. Use the links on the side to view your records.</p>
                </div>
            <?php endif; ?>
        </div>
        <aside class="side-menu">
            <?php if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']): ?>
                <h2>Admin Tools</h2>
                <ul>
                    <li><a href="admin_dashboard.php">Admin Dashboard</a></li>
                </ul>
                <hr>
            <?php endif; ?>
            <h2>My Dashboard</h2>
            <ul>
                <li><a href="company-main-page.php">Company Main Page</a></li>
                <li><a href="employee_dashboard.php?section=profile">My Profile</a></li>
                <li><a href="employee_dashboard.php?section=dtr">My DTR</a></li>
                <li><a href="employee_dashboard.php?section=payslip">My Payslips</a></li>
                <li><a href="employee_dashboard.php?section=change_password">Change Password</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>