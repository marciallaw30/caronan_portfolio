<?php
session_start();
include 'db_conn.php';

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    $password = $_POST['password'] ?? '';

    $sql = "SELECT employeeNo, firstName, password, accountType FROM employees WHERE employeeNo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $employeeNo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {

            $_SESSION['employee_no'] = $user['employeeNo'];
            $_SESSION['firstName'] = $user['firstName'];
            $_SESSION['account_type'] = $user['accountType'];
            $_SESSION['is_admin'] = ($user['accountType'] === 'admin');

            if ($_SESSION['account_type'] === 'admin') {
                header("Location: admin-panel.php");
                exit();
            } else {
                header("Location: company-main-page.php");
                exit();
            }
        } else {
            $error = 'Invalid password.';
        }
    } else {
        $error = 'Invalid Employee No.';
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
    <title>Datamex College of Saint Adeline - Login</title>
    
    <style>
        /* CSS Starts Here */
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%; /* Ensure both HTML and body are full width/height */
            font-family: Arial, sans-serif;
            overflow: hidden;
            
            /* Background Image Properties */
            background-image: url('uploads/bg.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            
            /* FIX: Ensure the background stays fixed and covers the entire viewport */
            background-attachment: fixed; 
            
            /* Center the login box */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* Hides the original header to use the custom top-left text */
        header { 
            display: none; 
        } 

        .top-left-text {
            position: absolute;
            top: 20px;
            left: 20px;
            color: white; 
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            background-color: rgba(0, 0, 0, 0.3);
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10;
        }

        .login-container {
            /* Transparent Box Styling */
            background-color: rgba(255, 255, 255, 0.3); /* 30% white transparency */
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
            width: 300px;
            backdrop-filter: blur(5px); /* Blurs the background behind the box */
            color: #333;
        }

        .login-logo {
            max-width: 100px; /* Size for the logo */
            height: auto;
            margin-bottom: 20px;
        }

        .login-container h2 {
            margin-top: 0;
            margin-bottom: 25px;
            color: #eee;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .input-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #eee;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .input-group input {
            width: 100%;
            padding: 10px;
            box-sizing: border-box; /* Ensures padding doesn't increase total width */
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.7);
            color: #333;
        }

        button[type="submit"] {
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
            width: 100%;
            margin-top: 10px;
        }

        button[type="submit"]:hover {
            background-color: #0056b3;
        }
        /* CSS Ends Here */
    </style>
</head>
<body>
    <div class="top-left-text">DATAMEX COLLEGE OF SAINT ADELINE</div>
    
    <div class="login-container">
        <img 
            class="login-logo" 
            src="uploads/logo.png" 
            alt="College Logo"
        >

        <h2>Employee Login</h2>
        <?php if (!empty($error)): ?>
            <p class="error-message" style="color: red; text-align: center;"><?php echo $error; ?></p>
        <?php endif; ?>
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="input-group">
                <label for="employeeNo">Employee No.</label>
                <input type="text" id="employeeNo" name="employeeNo" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Log In</button>
        </form>
    </div>
</body>
</html>