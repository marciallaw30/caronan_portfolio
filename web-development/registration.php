<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';
$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // --- Collect and Sanitize all POST data ---
    $employeeNo = $_POST['employeeNo'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    // Collect all other fields, using null coalescing operator for safety
    $lastName = $_POST['lastName'] ?? '';
    $firstName = $_POST['firstName'] ?? '';
    $middleName = $_POST['middleName'] ?? '';
    // Use NULL for empty date fields if your DB expects it, otherwise default to empty string
    $birthDay = $_POST['birthDay'] ?? NULL; 
    $birthPlace = $_POST['birthPlace'] ?? '';
    $address = $_POST['address'] ?? '';
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

    // --- 1. Combined Check for Duplicate EmployeeNo OR Email ---
    $checkSql = "SELECT employeeNo, email FROM employees WHERE employeeNo = ? OR email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $employeeNo, $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $duplicateUser = $checkResult->fetch_assoc();
    $checkStmt->close();

    if ($duplicateUser) {
        if ($duplicateUser['employeeNo'] === $employeeNo) {
            $error = "Error: The **Employee Number** ({$employeeNo}) already exists. Please choose a different one.";
        } elseif ($duplicateUser['email'] === $email) {
            $error = "Error: An account with that **Email Address** ({$email}) already exists. Please use a different email.";
        }
    } else {
        // --- 2. Attempt INSERT if no duplicates found ---
        $sql = "INSERT INTO employees (employeeNo, password, lastName, firstName, middleName, birthDay, birthPlace, address, email, gender, civilStatus, nationality, religion, phoneNumber, sssNumber, pagibigNumber, tinNumber, philhealthNumber, bankAccount, accountType, department, position, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            $error = "Error preparing statement: " . $conn->error;
        } else {
            // 23 parameters
            $stmt->bind_param("sssssssssssssssssssssss", 
                $employeeNo, $password, $lastName, $firstName, $middleName, 
                $birthDay, $birthPlace, $address, $email, $gender, 
                $civilStatus, $nationality, $religion, $phoneNumber, 
                $sssNumber, $pagibigNumber, $tinNumber, $philhealthNumber, 
                $bankAccount, $accountType, $department, $position, $status);

            if ($stmt->execute()) {
                $_SESSION['new_employee'] = [
                    'employeeNo' => $employeeNo,
                    'lastName' => $lastName,
                    'firstName' => $firstName
                ];
                header("Location: employee_success.php");
                exit();
            } else {
                // Catch any other general insertion error
                $error = "Error creating account: " . $stmt->error;
            }
            $stmt->close();
        }
    }
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Account</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .form-grid-three-col {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .form-full-width { grid-column: 1 / -1; }
        /* Style for displaying the error message prominently */
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <h1>Create New Account</h1>
    </header>
    <div class="registration-container">
        <?php if (!empty($error)): ?>
            <p class="error-message"><?php echo $error; ?></p>
        <?php endif; ?>
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div style="text-align: center; margin-top: 20px;">
            <a href="manage_employees.php" class="back-link">← Back to Manage Employee</a>
        </div>
        <div class="form-grid form-grid-three-col">
            <h3 class="form-section-header">Account Setup</h3>
            <div class="input-group">
                <label for="employeeNo">Employee No. *</label>
                <input type="text" id="employeeNo" name="employeeNo" required value="<?php echo htmlspecialchars($_POST['employeeNo'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="password">Temporary Password *</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="input-group">
                <label for="accountType">Account Type</label>
                <div class="radio-group">
                    <input type="radio" id="employee" name="accountType" value="employee" <?php echo (($_POST['accountType'] ?? 'employee') == 'employee') ? 'checked' : ''; ?>>
                    <label for="employee">Employee</label>
                    <input type="radio" id="admin" name="accountType" value="admin" <?php echo (($_POST['accountType'] ?? '') == 'admin') ? 'checked' : ''; ?>>
                    <label for="admin">Admin</label>
                </div>
            </div>

            <h3 class="form-section-header">Personal Information</h3>
            <div class="input-group">
                <label for="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required value="<?php echo htmlspecialchars($_POST['lastName'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" required value="<?php echo htmlspecialchars($_POST['firstName'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="middleName">Middle Name</label>
                <input type="text" id="middleName" name="middleName" value="<?php echo htmlspecialchars($_POST['middleName'] ?? ''); ?>">
            </div>

            <div class="input-group form-full-width">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            
            <div class="input-group">
                <label for="birthDay">Birthday</label>
                <input type="date" id="birthDay" name="birthDay" value="<?php echo htmlspecialchars($_POST['birthDay'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="birthPlace">Birth Place</label>
                <input type="text" id="birthPlace" name="birthPlace" value="<?php echo htmlspecialchars($_POST['birthPlace'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="address">Address</label>
                <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($_POST['address'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="gender">Gender</label>
                <select id="gender" name="gender">
                    <option value="" <?php echo (($_POST['gender'] ?? '') == '') ? 'selected' : ''; ?>>-- Select --</option>
                    <option value="male" <?php echo (($_POST['gender'] ?? '') == 'male') ? 'selected' : ''; ?>>Male</option>
                    <option value="female" <?php echo (($_POST['gender'] ?? '') == 'female') ? 'selected' : ''; ?>>Female</option>
                    <option value="other" <?php echo (($_POST['gender'] ?? '') == 'other') ? 'selected' : ''; ?>>Other</option>
                </select>
            </div>
            <div class="input-group">
                <label for="civilStatus">Civil Status</label>
                <input type="text" id="civilStatus" name="civilStatus" value="<?php echo htmlspecialchars($_POST['civilStatus'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="nationality">Nationality</label>
                <input type="text" id="nationality" name="nationality" value="<?php echo htmlspecialchars($_POST['nationality'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="religion">Religion</label>
                <input type="text" id="religion" name="religion" value="<?php echo htmlspecialchars($_POST['religion'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="phoneNumber">Phone Number</label>
                <input type="text" id="phoneNumber" name="phoneNumber" value="<?php echo htmlspecialchars($_POST['phoneNumber'] ?? ''); ?>">
            </div>


            <h3 class="form-section-header">Job Details</h3>
            <div class="input-group">
                <label for="department">Department *</label>
                <input type="text" id="department" name="department" required value="<?php echo htmlspecialchars($_POST['department'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="position">Position *</label>
                <input type="text" id="position" name="position" required value="<?php echo htmlspecialchars($_POST['position'] ?? ''); ?>">
            </div>

            <div class="input-group">
                <label for="status">Employee Status</label>
                <select id="status" name="status">
                    <option value="active" <?php echo (($_POST['status'] ?? 'active') == 'active') ? 'selected' : ''; ?>>Active</option>
                    <option value="leave" <?php echo (($_POST['status'] ?? '') == 'leave') ? 'selected' : ''; ?>>Leave</option>
                    <option value="resign" <?php echo (($_POST['status'] ?? '') == 'resign') ? 'selected' : ''; ?>>Resign</option>
                    <option value="disease" <?php echo (($_POST['status'] ?? '') == 'disease') ? 'selected' : ''; ?>>Disease</option>
                    <option value="awol" <?php echo (($_POST['status'] ?? '') == 'awol') ? 'selected' : ''; ?>>AWOL</option>
                </select>
            </div>

            <h3 class="form-section-header">Benefits and Bank Info</h3>
            <div class="input-group">
                <label for="sssNumber">SSS Number</label>
                <input type="text" id="sssNumber" name="sssNumber" value="<?php echo htmlspecialchars($_POST['sssNumber'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="pagibigNumber">Pag-IBIG Number</label>
                <input type="text" id="pagibigNumber" name="pagibigNumber" value="<?php echo htmlspecialchars($_POST['pagibigNumber'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="tinNumber">TIN Number</label>
                <input type="text" id="tinNumber" name="tinNumber" value="<?php echo htmlspecialchars($_POST['tinNumber'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="philhealthNumber">PhilHealth Number</label>
                <input type="text" id="philhealthNumber" name="philhealthNumber" value="<?php echo htmlspecialchars($_POST['philhealthNumber'] ?? ''); ?>">
            </div>
            <div class="input-group">
                <label for="bankAccount">Bank Account</label>
                <input type="text" id="bankAccount" name="bankAccount" value="<?php echo htmlspecialchars($_POST['bankAccount'] ?? ''); ?>">
            </div>
        </div>
        <button type="submit" style="margin-top: 30px;">Create Account</button>
        </form>
    </div>
</body>
</html>