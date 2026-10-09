<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';
$message = '';
$employeeNoToChange = $_GET['employeeNo'] ?? '';
// Handle POST request to change password
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['employeeNo'])) {
    $employeeNoToChange = $_POST['employeeNo'];
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_new_password'];
    if ($newPassword !== $confirmPassword) {
        $message = "New passwords do not match.";
    } else {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $update_sql = "UPDATE employees SET password = ? WHERE employeeNo = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ss", $hashedPassword, $employeeNoToChange);
        if ($update_stmt->execute()) {
            $message = "Password for Employee " . htmlspecialchars($employeeNoToChange) . " changed successfully.";
        } else {
            $message = "Error updating password: " . $update_stmt->error;
        }
        $update_stmt->close();
    }
}
$conn->close();
// Fetch employee details to display on the form
$employeeData = null;
if (!empty($employeeNoToChange)) {
    include 'db_conn.php';
    $sql_fetch = "SELECT firstName, lastName FROM employees WHERE employeeNo = ?";
    $stmt_fetch = $conn->prepare($sql_fetch);
    $stmt_fetch->bind_param("s", $employeeNoToChange);
    $stmt_fetch->execute();
    $result_fetch = $stmt_fetch->get_result();
    $employeeData = $result_fetch->fetch_assoc();
    $stmt_fetch->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Change Password</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Change Password</h1>
    </header>
    <div class="registration-container">
        <?php if (!empty($message)): ?>
            <p class="message"><?php echo $message; ?></p>
        <?php endif; ?>
        <?php if ($employeeData): ?>
            <h3>Changing password for: <?php echo htmlspecialchars($employeeData['firstName'] . ' ' . $employeeData['lastName']); ?> (<?php echo htmlspecialchars($employeeNoToChange); ?>)</h3>
            <form method="POST" action="admin_change_password.php">
                <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($employeeNoToChange); ?>">
                <div class="input-group">
                    <label for="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" required>
                </div>
                <div class="input-group">
                    <label for="confirm_new_password">Confirm New Password</label>
                    <input type="password" id="confirm_new_password" name="confirm_new_password" required>
                </div>
                <button type="submit">Change Password</button>
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