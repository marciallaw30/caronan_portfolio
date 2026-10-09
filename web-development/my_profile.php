<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';

// Fetch admin's personal information
$employeeNo = $_SESSION['employee_no'];
$employeeData = null;
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
        $sql_payslip_dates = "SELECT payDate, id FROM payroll WHERE employeeNo = ? ORDER BY payDate DESC";
        $stmt_payslip_dates = $conn->prepare($sql_payslip_dates);
        $stmt_payslip_dates->bind_param("s", $employeeNo);
        $stmt_payslip_dates->execute();
        $records = $stmt_payslip_dates->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_payslip_dates->close();
        break;
    case 'change_password':
        break;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .form-full-width {
            grid-column: 1 / -1;
        }
        .info-card {
            background-color: #e9f5e9;
            border-left: 5px solid #4CAF50;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-card p {
            margin: 5px 0;
            color: black;
        }
    </style>
</head>
<body>
    <header>
        <h1>My Profile</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <?php if (isset($_GET['success']) && $_GET['success'] == 'profile_updated'): ?>
                <p class="success-message">Your profile has been updated successfully.</p>
            <?php endif; ?>
            <?php if (isset($_GET['error']) && $_GET['error'] == 'update_failed'): ?>
                <p class="error-message">Failed to update profile. Please try again.</p>
            <?php endif; ?>
            
            <?php if ($section === 'profile' && $employeeData): ?>
                <h2>My Personal Information</h2>
                <p>Use this section to view or update your personal details.</p>
                <div class="info-card">
                    <h3 style="color: black;">Employee Details</h3>
                    <p style="color: black;"><strong>Employee No:</strong> <?php echo htmlspecialchars($employeeData['employeeNo']); ?></p>
                    <p style="color: black;"><strong>Full Name:</strong> <?php echo htmlspecialchars($employeeData['firstName'] . ' ' . $employeeData['middleName'] . ' ' . $employeeData['lastName']); ?></p>
                    <p style="color: black;"><strong>Email:</strong> <?php echo htmlspecialchars($employeeData['email']); ?></p>
                    <p style="color: black;"><strong>Phone Number:</strong> <?php echo htmlspecialchars($employeeData['phoneNumber']); ?></p>
                    <p style="color: black;"><strong>Address:</strong> <?php echo htmlspecialchars($employeeData['address']); ?></p>
                    <p style="color: black;"><strong>Birthdate:</strong> <?php echo htmlspecialchars($employeeData['birthDay']); ?></p>
                    <p style="color: black;"><strong>Birthplace:</strong> <?php echo htmlspecialchars($employeeData['birthPlace']); ?></p>
                    <p style="color: black;"><strong>Gender:</strong> <?php echo htmlspecialchars($employeeData['gender']); ?></p>
                    <p style="color: black;"><strong>Civil Status:</strong> <?php echo htmlspecialchars($employeeData['civilStatus']); ?></p>
                    <p style="color: black;"><strong>Nationality:</strong> <?php echo htmlspecialchars($employeeData['nationality']); ?></p>
                    <p style="color: black;"><strong>Religion:</strong> <?php echo htmlspecialchars($employeeData['religion']); ?></p>
                </div>
                <div class="info-card">
                    <h3 style="color: black;">Government & Bank Information</h3>
                    <p style="color: black;"><strong>SSS Number:</strong> <?php echo htmlspecialchars($employeeData['sssNumber']); ?></p>
                    <p style="color: black;"><strong>Pag-IBIG Number:</strong> <?php echo htmlspecialchars($employeeData['pagibigNumber']); ?></p>
                    <p style="color: black;"><strong>TIN Number:</strong> <?php echo htmlspecialchars($employeeData['tinNumber']); ?></p>
                    <p style="color: black;"><strong>PhilHealth Number:</strong> <?php echo htmlspecialchars($employeeData['philhealthNumber']); ?></p>
                    <p style="color: black;"><strong>Bank Account:</strong> <?php echo htmlspecialchars($employeeData['bankAccount']); ?></p>
                </div>
                <div class="action-buttons">
                    <a href="my_profile.php?section=edit_profile" class="button">Edit Profile</a>
                </div>
            <?php elseif ($section === 'edit_profile' && $employeeData): ?>
                <h2>Edit Personal Information</h2>
                <form action="update_profile.php" method="POST">
                    <div class="form-grid">
                        <div class="input-group">
                            <label for="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($employeeData['firstName']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="middleName">Middle Name</label>
                            <input type="text" id="middleName" name="middleName" value="<?php echo htmlspecialchars($employeeData['middleName']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" value="<?php echo htmlspecialchars($employeeData['lastName']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($employeeData['email']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="phoneNumber">Phone Number</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value="<?php echo htmlspecialchars($employeeData['phoneNumber']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="birthDay">Birth Day</label>
                            <input type="date" id="birthDay" name="birthDay" value="<?php echo htmlspecialchars($employeeData['birthDay']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="birthPlace">Birth Place</label>
                            <input type="text" id="birthPlace" name="birthPlace" value="<?php echo htmlspecialchars($employeeData['birthPlace']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="address">Address</label>
                            <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($employeeData['address']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="gender">Gender</label>
                            <input type="text" id="gender" name="gender" value="<?php echo htmlspecialchars($employeeData['gender']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="civilStatus">Civil Status</label>
                            <input type="text" id="civilStatus" name="civilStatus" value="<?php echo htmlspecialchars($employeeData['civilStatus']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="nationality">Nationality</label>
                            <input type="text" id="nationality" name="nationality" value="<?php echo htmlspecialchars($employeeData['nationality']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="religion">Religion</label>
                            <input type="text" id="religion" name="religion" value="<?php echo htmlspecialchars($employeeData['religion']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="sssNumber">SSS Number</label>
                            <input type="text" id="sssNumber" name="sssNumber" value="<?php echo htmlspecialchars($employeeData['sssNumber']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="pagibigNumber">Pag-IBIG Number</label>
                            <input type="text" id="pagibigNumber" name="pagibigNumber" value="<?php echo htmlspecialchars($employeeData['pagibigNumber']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="tinNumber">TIN Number</label>
                            <input type="text" id="tinNumber" name="tinNumber" value="<?php echo htmlspecialchars($employeeData['tinNumber']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="philhealthNumber">PhilHealth Number</label>
                            <input type="text" id="philhealthNumber" name="philhealthNumber" value="<?php echo htmlspecialchars($employeeData['philhealthNumber']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="bankAccount">Bank Account</label>
                            <input type="text" id="bankAccount" name="bankAccount" value="<?php echo htmlspecialchars($employeeData['bankAccount']); ?>">
                        </div>
                    </div>
                    <button type="submit" class="form-full-width" style="margin-top: 20px;">Save Changes</button>
                    <a href="my_profile.php?section=profile" class="form-full-width back-link" style="text-align: center; display: block; margin-top: 10px;">Cancel</a>
                </form>
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
                                    <td><a href="view_payslip.php?id=<?php echo htmlspecialchars($record['id']); ?>">View Payslip</a></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="2">No payslip records found.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php elseif ($section === 'change_password'): ?>
                <h3>Change My Password</h3>
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
            <?php endif; ?>
        </div>
        <aside class="side-menu">
            <h2>My Dashboard</h2>
            <ul>
                <li><a href="my_profile.php?section=profile">My Profile</a></li>
                <li><a href="my_profile.php?section=dtr">My DTR</a></li>
                <li><a href="my_profile.php?section=payslip">My Payslips</a></li>
                <li><a href="my_profile.php?section=change_password">Change Password</a></li>
            </ul>
            <hr>
            <h2>Admin Tools</h2>
            <ul>
                <li><a href="admin_dashboard.php">Dashboard</a></li>
                <li><a href="manage_employees.php">Manage Employees</a></li>
                <li><a href="manage_attendance.php">Manage Attendance</a></li>
                <li><a href="manage_payroll.php">Manage Payroll</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>