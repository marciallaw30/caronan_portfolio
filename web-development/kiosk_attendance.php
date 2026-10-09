<?php
session_start();

// CRITICAL FIX: Set PHP Timezone to Asia/Manila for data consistency
date_default_timezone_set('Asia/Manila');

include 'db_conn.php';

// CRITICAL SECURITY CHECK: Check if the admin login page set the unlock flag. If not, redirect.
if (!isset($_SESSION['kiosk_unlocked']) || $_SESSION['kiosk_unlocked'] !== true) {
    // If the session flag is gone (or never existed), redirect to log in.
    header("Location: kiosk_login.php");
    exit();
}
// ---------------------------------------------------

$message = '';
$messageType = 'success'; // or 'error'

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    
    // 1. Validate Employee Existence
    $sql_check = "SELECT employeeNo FROM employees WHERE employeeNo = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $employeeNo);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        $message = "Error: Employee ID not found.";
        $messageType = 'error';
    } else {
        // Use the current date and time based on the Asia/Manila setting
        $today = date("Y-m-d");
        $now = date("H:i:s");
        
        // 2. Check for existing record (Time In)
        $sql_current = "SELECT id, time_in, time_out FROM attendance WHERE employeeNo = ? AND date = ?";
        $stmt_current = $conn->prepare($sql_current);
        $stmt_current->bind_param("ss", $employeeNo, $today);
        $stmt_current->execute();
        $result_current = $stmt_current->get_result();
        $record = $result_current->fetch_assoc();

        if (!$record) {
            // No record found: Employee is Time In
            $sql_insert = "INSERT INTO attendance (employeeNo, date, time_in) VALUES (?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert);
            $stmt_insert->bind_param("sss", $employeeNo, $today, $now);
            $stmt_insert->execute();
            $message = "Time In successful for Employee No. " . htmlspecialchars($employeeNo);
            $messageType = 'success';
        } elseif (empty($record['time_out'])) {
            // Record found but no time_out: Employee is Time Out
            $sql_update = "UPDATE attendance SET time_out = ?, working_hours = ?, late_minutes = ? WHERE id = ?";
            
            // --- Attendance Calculation Logic (Simplified) ---
            $time_in_dt = new DateTime($record['time_in']);
            $time_out_dt = new DateTime($now);
            $diff = $time_out_dt->diff($time_in_dt);
            $total_hours = $diff->h + ($diff->i / 60) + ($diff->s / 3600);
            
            // Deduct 1 hour for lunch (if total hours is greater than 1), cap working hours at 8
            $working_hours = min(8, max(0, $total_hours - 1));
            $working_hours = round($working_hours, 2);

            // Simple Late calculation (assuming start time is 8:00 AM)
            $late_minutes = 0;
            $start_time = new DateTime('08:00:00');
            
            // Check for lateness only if Time In occurred
            if ($time_in_dt > $start_time) {
                // Calculate difference in minutes
                $late_diff = $time_in_dt->diff($start_time);
                $late_minutes = $late_diff->h * 60 + $late_diff->i;
                // Ensure late minutes is not negative (though logic prevents this, it's good practice)
                $late_minutes = max(0, $late_minutes);
            }

            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("sddi", $now, $working_hours, $late_minutes, $record['id']);
            $stmt_update->execute();
            
            $message = "Time Out successful for Employee No. " . htmlspecialchars($employeeNo);
            $messageType = 'success';
        } else {
            // Record found with time_in and time_out: Already completed shift
            $message = "Error: Employee No. " . htmlspecialchars($employeeNo) . " has already completed a shift today.";
            $messageType = 'error';
        }

        $stmt_current->close();
    }
    $stmt_check->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Kiosk</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            background-color: #007bff; /* Blue background for Kiosk mode */
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .kiosk-container {
            background-color: #fff;
            color: #333;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 500px;
            text-align: center;
        }
        .kiosk-container h1 {
            color: #007bff;
            margin-bottom: 30px;
        }
        #current-date { 
            font-size: 1.8em;
            margin-bottom: 10px;
            color: #333;
        }
        #current-time {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 20px;
            color: #007bff;
        }
        .input-group {
            margin-bottom: 30px;
        }
        .input-group label {
            display: block;
            margin-bottom: 10px;
            font-size: 1.2em;
        }
        .input-group input[type="text"] {
            width: 100%;
            padding: 15px;
            font-size: 1.5em;
            text-align: center;
            border: 2px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 15px;
            background-color: #28a745; /* Green for action */
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.5em;
        }
        button:hover {
            background-color: #1e7e34;
        }
        .message-box {
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 1.1em;
            font-weight: bold;
        }
        .message-box.success {
            background-color: #d4edda;
            color: #155724;
        }
        .message-box.error {
            background-color: #f8d7da;
            color: #721c24;
        }
        .close-kiosk {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1em;
        }
        .close-kiosk:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <a href="kiosk_admin_exit.php" class="close-kiosk" onclick="return confirm('Are you sure you want to lock the Kiosk? This requires an admin login to return to the Admin Panel.');">Lock Kiosk</a>

    <div class="kiosk-container">
        <h1>Attendance Kiosk</h1>
        <div id="current-date"></div> 
        <div id="current-time"></div>
        
        <?php if (!empty($message)): ?>
            <div class="message-box <?php echo $messageType; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="kiosk_attendance.php">
            <div class="input-group">
                <label for="employeeNo">Enter Employee ID:</label>
                <input type="text" id="employeeNo" name="employeeNo" required autofocus> 
            </div>
            <button type="submit">Time In / Time Out</button>
        </form>
    </div>

    <script>
        // Function to update the time and date (client-side)
        function updateTime() {
            // Note: Client-side time relies on the user's device time. The actual attendance
            // recorded in PHP uses the server time set to 'Asia/Manila', which is more reliable.
            const now = new Date();
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');
            
            // Format time (e.g., 01:21:00 AM)
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            // Force display to Philippine time zone for consistency with server-side savings
            const timeString = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'Asia/Manila' });
            timeElement.textContent = timeString;

            // Format date (e.g., Friday, September 26, 2025)
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('en-US', { ...dateOptions, timeZone: 'Asia/Manila' });
            dateElement.textContent = dateString;
        }

        // Update time every second
        setInterval(updateTime, 1000);
        updateTime(); // Initial call
    </script>
</body>
</html>