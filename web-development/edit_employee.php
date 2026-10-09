<?php
session_start();
if (!isset($_SESSION['employee_no']) || (($_SESSION['account_type'] ?? '') !== 'admin')) {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';
$message = '';

if (!isset($_GET['employeeNo'])) {
    header("Location: manage_employees.php");
    exit();
}
$employeeNoToEdit = filter_var($_GET['employeeNo'], FILTER_SANITIZE_STRING);

// --- 1. HANDLE POST REQUEST (Update Profile and Save Rate) ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $firstName = $_POST['firstName'] ?? '';
    $middleName = $_POST['middleName'] ?? '';
    $birthDay = $_POST['birthDay'] ?? NULL;
    $birthPlace = $_POST['birthPlace'] ?? '';
    $address = $_POST['address'] ?? '';
    $email = $_POST['email'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $civilStatus = $_POST['civilStatus'] ?? '';
    $nationality = $_POST['nationality'] ?? '';
    $religion = $_POST['religion'] ?? '';
    $phoneNumber = $_POST['phoneNumber'] ?? '';
    $sssNumber = $_POST['sssNumber'] ?? '';
    $pagibigNumber = $_POST['pagibigNumber'] ?? '';
    $tinNumber = $_POST['tinNumber'] ?? '';
    $philhealthNumber = $_POST['philhealthNumber'] ?? '';
    $bankAccount = $_POST['bankAccount'] ?? '';
    $accountType = $_POST['accountType'] ?? 'employee';
    $department = $_POST['department'] ?? '';
    $position = $_POST['position'] ?? '';
    $status = $_POST['status'] ?? 'active';
    
    // --- CRITICAL FIX: Get the Hourly Rate from the input field ---
    $ratePerHourInput = floatval($_POST['ratePerHourInput'] ?? 0);
    
    // We remove the session logic here, as the DB update is the source of truth
    // unset($_SESSION['employee_rates'][$employeeNo]); 

    // --- FIX: Update the SQL to include ratePerHour ---
    $sql = "UPDATE employees SET 
             lastName = ?, firstName = ?, middleName = ?, birthDay = ?, birthPlace = ?, 
             address = ?, email = ?, gender = ?, civilStatus = ?, nationality = ?, 
             religion = ?, phoneNumber = ?, sssNumber = ?, pagibigNumber = ?, 
             tinNumber = ?, philhealthNumber = ?, bankAccount = ?, accountType = ?, department = ?, position = ?, status = ?,
             ratePerHour = ?
             WHERE employeeNo = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        $message = "Error preparing statement: " . $conn->error;
    } else {
        // NOTE: Binding 23 parameters + ratePerHour = 24 parameters + employeeNo = 25 total
        $stmt->bind_param(
            "ssssssssssssssssssssssd", // 21 strings, 1 float/decimal (ratePerHour), 1 string (employeeNo)
            $lastName, $firstName, $middleName, $birthDay, $birthPlace, 
            $address, $email, $gender, $civilStatus, $nationality, 
            $religion, $phoneNumber, $sssNumber, $pagibigNumber, 
            $tinNumber, $philhealthNumber, $bankAccount, $accountType, $department, $position,
            $status,
            $ratePerHourInput, // NEW: RatePerHour is bound here
            $employeeNo
        );

        if ($stmt->execute()) {
            $message = "Employee information updated successfully.";
            $employeeNoToEdit = $employeeNo; 
        } else {
            if ($conn->errno === 1062 && strpos($stmt->error, 'email') !== false) {
                 $message = "Error: The **Email Address** ({$email}) is already assigned to another employee.";
            } else {
                 $message = "Error updating record: " . $stmt->error;
            }
        }
        $stmt->close();
    }
}


// --- 2. FETCH CURRENT DATA (Including the updated rate) ---
$sql_fetch = "SELECT * FROM employees WHERE employeeNo = ?";
$stmt_fetch = $conn->prepare($sql_fetch);
$stmt_fetch->bind_param("s", $employeeNoToEdit);
$stmt_fetch->execute();
$employeeData = $stmt_fetch->get_result()->fetch_assoc();
$stmt_fetch->close();
$conn->close();

if (!$employeeData) {
    $message = "Employee not found.";
}

// Determine the hourly rate to display (now pulled directly from the DB)
$ratePerHourDisplay = $employeeData['ratePerHour'] ?? 0.00;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Employee</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .registration-container { max-width: 900px; margin: 30px auto; padding: 20px; background: #3a2a53; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); color: white; }
        .form-grid-three-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .form-full-width { grid-column: 1 / -1; }
        .input-group label { color: white; }
        .input-group input, .input-group select { background-color: #fff; color: #333; }
        .rate-warning { color: #ffc107; font-weight: bold; margin-bottom: 10px; background-color: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 5px; }
        .error-message { background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb; font-weight: bold; }
        .message-success { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #c3e6cb; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <h1>Edit Employee Information</h1>
    </header>
    <div class="registration-container">
        
        <?php if ($employeeData): ?> 
            <?php if (!empty($message)): ?>
                <p class="<?php echo (strpos($message, 'Error') !== false) ? 'error-message' : 'message-success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </p>
            <?php endif; ?>
            
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]) . '?employeeNo=' . htmlspecialchars($employeeNoToEdit); ?>">
                <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($employeeData['employeeNo']); ?>">
                <div style="text-align: center; margin-top: 20px;">
                    <a href="manage_employees.php" class="back-link">← Back to Employee List</a>
                </div>
                
                <?php if ($ratePerHourDisplay <= 0.01): ?>
                    <p class="rate-warning">⚠️ **Hourly Rate is zero or missing!** Payroll generation will fail until a rate is entered and saved here.</p>
                <?php endif; ?>

                <div class="form-grid form-grid-three-col">
                    <h3 class="form-section-header">Account Setup</h3>
                    <div class="input-group">
                        <label for="employeeNo_display">Employee No. *</label>
                        <input type="text" id="employeeNo_display" value="<?php echo htmlspecialchars($employeeData['employeeNo']); ?>" disabled>
                    </div>
                    
                    <div class="input-group">
                        <label for="ratePerHourInput">Hourly Rate (For Payroll):</label>
                        <input type="number" step="0.01" id="ratePerHourInput" name="ratePerHourInput" 
                               value="<?php echo number_format($ratePerHourDisplay, 2, '.', ''); ?>" 
                               required>
                    </div>
                    
                    <div class="input-group">
                        <label for="accountType">Account Type</label>
                        <div class="radio-group">
                            <input type="radio" id="employee" name="accountType" value="employee" <?php echo ($employeeData['accountType'] === 'employee') ? 'checked' : ''; ?>>
                            <label for="employee">Employee</label>
                            <input type="radio" id="admin" name="accountType" value="admin" <?php echo ($employeeData['accountType'] === 'admin') ? 'checked' : ''; ?>>
                            <label for="admin">Admin</label>
                        </div>
                    </div>
                    
                    <h3 class="form-section-header">Personal Information</h3>
                    <div class="input-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required value="<?php echo htmlspecialchars($employeeData['lastName']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required value="<?php echo htmlspecialchars($employeeData['firstName']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="middleName">Middle Name</label>
                        <input type="text" id="middleName" name="middleName" value="<?php echo htmlspecialchars($employeeData['middleName']); ?>">
                    </div>

                    <div class="input-group">
                        <label for="birthDay">Birth Day</label>
                        <input type="date" id="birthDay" name="birthDay" value="<?php echo htmlspecialchars($employeeData['birthDay']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="gender">Gender</label>
                        <input type="text" id="gender" name="gender" value="<?php echo htmlspecialchars($employeeData['gender']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="civilStatus">Civil Status</label>
                        <input type="text" id="civilStatus" name="civilStatus" value="<?php echo htmlspecialchars($employeeData['civilStatus']); ?>">
                    </div>

                    <div class="input-group form-full-width">
                        <label for="birthPlace">Birth Place</label>
                        <input type="text" id="birthPlace" name="birthPlace" value="<?php echo htmlspecialchars($employeeData['birthPlace']); ?>">
                    </div>
                    <div class="input-group form-full-width">
                        <label for="address">Address</label>
                        <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($employeeData['address']); ?>">
                    </div>

                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($employeeData['email']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="phoneNumber">Phone Number</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" value="<?php echo htmlspecialchars($employeeData['phoneNumber']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="nationality">Nationality</label>
                        <input type="text" id="nationality" name="nationality" value="<?php echo htmlspecialchars($employeeData['nationality']); ?>">
                    </div>

                    <h3 class="form-section-header">Job Details</h3>
                    <div class="input-group">
                        <label for="department">Department *</label>
                        <input type="text" id="department" name="department" required value="<?php echo htmlspecialchars($employeeData['department']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="position">Position *</label>
                        <input type="text" id="position" name="position" required value="<?php echo htmlspecialchars($employeeData['position']); ?>">
                    </div>

                    <div class="input-group">
                        <label for="status">Employee Status</label>
                        <select id="status" name="status">
                            <option value="active" <?php echo ($employeeData['status'] === 'active') ? 'selected' : ''; ?>>Active</option>
                            <option value="leave" <?php echo ($employeeData['status'] === 'leave') ? 'selected' : ''; ?>>Leave</option>
                            <option value="resign" <?php echo ($employeeData['status'] === 'resign') ? 'selected' : ''; ?>>Resign</option>
                            <option value="disease" <?php echo ($employeeData['status'] === 'disease') ? 'selected' : ''; ?>>Disease</option>
                            <option value="awol" <?php echo ($employeeData['status'] === 'awol') ? 'selected' : ''; ?>>AWOL</option>
                        </select>
                    </div>

                    <h3 class="form-section-header">Benefits and Bank Info</h3>
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
                <button type="submit" style="margin-top: 20px;">Update Information</button>
            </form>
        <?php else: ?>
            <p class="error-message"><?php echo htmlspecialchars($message); ?></p>
        <?php endif; ?>
    </div>
</body>
</html>