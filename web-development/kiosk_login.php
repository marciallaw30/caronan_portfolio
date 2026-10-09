<?php
session_start();
include 'db_conn.php';

$error = '';
// Check if the current session is an authenticated admin session (for displaying the link)
// Assumes that your main login (index.php) correctly sets $_SESSION['account_type'] to 'admin'
$is_admin_logged_in = isset($_SESSION['account_type']) && $_SESSION['account_type'] === 'admin';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    $password = $_POST['password'] ?? '';

    // Corrected SQL: Checks for 'admin' role in the 'accountType' column
    $sql = "SELECT employeeNo, password, accountType FROM employees WHERE employeeNo = ? AND accountType = 'admin'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $employeeNo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            
            // CRITICAL: Set a session flag to unlock the Kiosk, distinct from the main login
            $_SESSION['kiosk_unlocked'] = true;
            
            // Redirect to the kiosk attendance page
            header("Location: kiosk_attendance.php");
            exit();
            
        } else {
            $error = "Invalid Employee ID or Password.";
        }
    } else {
        $error = "Invalid Employee ID or Password."; 
    }

    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kiosk Admin Login</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-container {
            background-color: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .login-container h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .input-group {
            margin-bottom: 20px;
            text-align: left;
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .input-group input[type="text"],
        .input-group input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .error {
            color: red;
            margin-bottom: 15px;
        }
        .back-link {
            display: block;
            margin-top: 20px;
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Attendance Kiosk Admin Access</h2>
        <?php if ($error): ?>
            <p class="error"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>
        <form method="POST" action="kiosk_login.php">
            <div class="input-group">
                <label for="employeeNo">Admin Employee ID:</label>
                <input type="text" id="employeeNo" name="employeeNo" required>
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Unlock Kiosk</button>
        </form>
        
        <?php if ($is_admin_logged_in): ?>
            <a href="admin-panel.php" class="back-link">← Back to Admin Panel</a>
        <?php endif; ?>
    </div>
</body>
</html>