<?php
session_start();
include 'db_conn.php';

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    $password = $_POST['password'] ?? '';

    // Check for 'admin' role
    $sql = "SELECT employeeNo, password FROM employees WHERE employeeNo = ? AND accountType = 'admin'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $employeeNo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            
            // Critical: Clear the Kiosk session flag for security
            unset($_SESSION['kiosk_unlocked']);
            
            // Redirect to the main admin panel after successful exit authentication
            header("Location: admin-panel.php");
            exit();
            
        } else {
            $error = "Invalid Employee ID or Password.";
        }
    } else {
        $error = "Access Denied: Only administrators can lock the Kiosk and return to the Admin Panel."; 
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
    <title>Kiosk Admin Exit</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            background-color: #dc3545; /* Red background for security focus */
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .login-container h2 {
            margin-bottom: 20px;
            color: #dc3545;
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
            background-color: #28a745; /* Green for exit/success */
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #1e7e34;
        }
        .error {
            color: red;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Secure Admin Exit</h2>
        <p>Enter your credentials to lock the Kiosk and return to the Admin Panel.</p>
        <?php if ($error): ?>
            <p class="error"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>
        <form method="POST" action="kiosk_admin_exit.php">
            <div class="input-group">
                <label for="employeeNo">Admin Employee ID:</label>
                <input type="text" id="employeeNo" name="employeeNo" required>
            </div>
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Lock Kiosk & Exit</button>
        </form>
        </div>
</body>
</html>