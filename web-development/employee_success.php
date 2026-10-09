<?php
session_start();
if (!isset($_SESSION['new_employee'])) {
    // If the session variable is not set, redirect to prevent direct access
    // and send the user to the employee list page, not back to registration.
    header("Location: manage_employees.php");
    exit();
}

$newEmployee = $_SESSION['new_employee'];
// Unset the session variable to ensure the message is only shown once
unset($_SESSION['new_employee']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            /* Keep the body centered style from your original thought */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            background-color: #f4f7f6;
        }
        .success-container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        .success-message {
            color: #28a745;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .details {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
        }
        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .back-link:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-message">
            ✅ Account Creation Successful!
        </div>
        <p class="details">
            A new employee account has been successfully registered.
        </p>
        <p class="details">
            **Employee Name:** <?php echo htmlspecialchars($newEmployee['firstName'] . ' ' . $newEmployee['lastName']); ?><br>
            **Employee Number:** <?php echo htmlspecialchars($newEmployee['employeeNo']); ?>
        </p>
        <a href="manage_employees.php" class="back-link">Go to Manage Employees</a>
    </div>
</body>
</html>