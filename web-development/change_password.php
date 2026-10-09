<?php
session_start();
// Check if the user is logged in
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';
$employeeNo = $_SESSION['employee_no'];
$message = '';
$historyLimit = 3; // Number of previous passwords to remember

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];

    // Input validation
    if ($newPassword !== $confirmPassword) {
        $message = "New passwords do not match. Please try again.";
    } elseif (strlen($newPassword) < 8) {
        $message = "New password must be at least 8 characters long.";
    } else {
        // --- 1. Fetch current password hash AND history from the database ---
        $sql = "SELECT password, last_passwords FROM employees WHERE employeeNo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $employeeNo);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($currentPassword, $user['password'])) {
            
            // --- 2. Check New Password Against History ---
            $passwordHistory = json_decode($user['last_passwords'] ?? '[]', true);
            $isUsedRecently = false;

            // Check against current password hash (if user re-enters the same one)
            if (password_verify($newPassword, $user['password'])) {
                 $isUsedRecently = true;
            }

            // Check against historical password hashes
            if (!$isUsedRecently) {
                foreach ($passwordHistory as $oldHash) {
                    if (password_verify($newPassword, $oldHash)) {
                        $isUsedRecently = true;
                        break;
                    }
                }
            }

            if ($isUsedRecently) {
                $message = "Error: You cannot use a password you have used recently. Please choose a new, unique password.";
            } else {
                // --- 3. Update Database with New Password and History ---
                $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                
                // Add the CURRENT hash to the history list
                if (!empty($user['password'])) {
                    array_unshift($passwordHistory, $user['password']);
                }
                
                // Keep only the last $historyLimit entries
                $passwordHistory = array_slice($passwordHistory, 0, $historyLimit);
                $newHistoryJson = json_encode($passwordHistory);

                $update_sql = "UPDATE employees SET password = ?, last_passwords = ? WHERE employeeNo = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param("sss", $newHashedPassword, $newHistoryJson, $employeeNo);
                
                if ($update_stmt->execute()) {
                    $message = "Password changed successfully!";
                } else {
                    $message = "Error updating password: " . $update_stmt->error;
                }
                $update_stmt->close();
            }
        } else {
            $message = "Incorrect current password. Please try again.";
        }
    }
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
            font-weight: bold;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <h1>Change Password</h1>
    </header>
    <div class="registration-container">
        <?php if (!empty($message)): ?>
            <p class="<?php echo (strpos($message, 'Error') !== false) ? 'error-message' : 'success-message'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </p>
        <?php endif; ?>
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="input-group">
                <label for="current_password">Current Password</label>
                <input type="password" id="current_password" name="current_password" required>
            </div>
            <div class="input-group">
                <label for="new_password">New Password (Min 8 characters)</label>
                <input type="password" id="new_password" name="new_password" required minlength="8">
            </div>
            <div class="input-group">
                <label for="confirm_password">Confirm New Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required minlength="8">
            </div>
            <button type="submit">Change Password</button>
        </form>
        <div style="text-align: center; margin-top: 20px;">
            <a href="employee_dashboard.php" class="back-link">← Back to Dashboard</a>
        </div>
    </div>
</body>
</html>