<?php
session_start();
// Check if user is logged in and is an admin
// --- FIX: Using the correct session key 'account_type' set during login ---
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}
// -------------------------------------------------------------------------
include 'db_conn.php';

// Fetch summary data for the admin's main dashboard view
$totalEmployees = 0;
$sql_employees = "SELECT COUNT(*) AS total FROM employees";
$result_employees = $conn->query($sql_employees);
if ($result_employees) {
    $totalEmployees = $result_employees->fetch_assoc()['total'];
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Admin Dashboard</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2>System Overview</h2>
            <p>Welcome to your administrative dashboard. This page provides a quick overview of key metrics and direct access to essential management tools.</p>
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Total Employees</h3>
                    <p><?php echo $totalEmployees; ?></p>
                </div>
            </div>
        </div>

        <aside class="side-menu">
            <h2>Admin Tools</h2>
            <ul>
                <li><a href="admin-panel.php">Company Content Management</a></li>
                <li><a href="manage_employees.php">Manage Employees</a></li>
                <li><a href="manage_attendance.php">Manage Attendance</a></li>
                <li><a href="manage_payroll.php">Manage Payroll</a></li>
            </ul>
            <hr>
            <h2>My Dashboard</h2>
            <ul>
                <li><a href="user_dashboard.php?section=profile&admin_view=1">My Profile</a></li>
                <li><a href="user_dashboard.php?section=dtr&admin_view=1">My DTR</a></li>
                <li><a href="user_dashboard.php?section=payslip&admin_view=1">My Payslips</a></li>
                <li><a href="user_dashboard.php?section=change_password&admin_view=1">Change Password</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>