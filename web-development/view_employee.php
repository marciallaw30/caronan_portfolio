<?php
session_start();
if (!isset($_SESSION['employee_no']) || !isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';
$error = '';
$success = '';
$employeeData = [];

if (isset($_GET['id'])) {
    $employeeId = $_GET['id'];
    $sql = "SELECT * FROM employees WHERE employeeNo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $employeeId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $employeeData = $result->fetch_assoc();
    } else {
        $error = "Employee not found.";
    }
    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'];
    $lastName = $_POST['lastName'];
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $birthDay = $_POST['birthDay'];
    $birthPlace = $_POST['birthPlace'];
    $address = $_POST['address'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $civilStatus = $_POST['civilStatus'];
    $nationality = $_POST['nationality'];
    $religion = $_POST['religion'];
    $phoneNumber = $_POST['phoneNumber'];
    $sssNumber = $_POST['sssNumber'];
    $pagibigNumber = $_POST['pagibigNumber'];
    $tinNumber = $_POST['tinNumber'];
    $philhealthNumber = $_POST['philhealthNumber'];
    $bankAccount = $_POST['bankAccount'];
    $accountType = $_POST['accountType'];

    $sql = "UPDATE employees SET lastName=?, firstName=?, middleName=?, birthDay=?, birthPlace=?, address=?, email=?, gender=?, civilStatus=?, nationality=?, religion=?, phoneNumber=?, sssNumber=?, pagibigNumber=?, tinNumber=?, philhealthNumber=?, bankAccount=?, accountType=? WHERE employeeNo=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssssssssss", $lastName, $firstName, $middleName, $birthDay, $birthPlace, $address, $email, $gender, $civilStatus, $nationality, $religion, $phoneNumber, $sssNumber, $pagibigNumber, $tinNumber, $philhealthNumber, $bankAccount, $accountType, $employeeNo);
    
    if ($stmt->execute()) {
        $success = "Employee details updated successfully.";
        // Refresh data to show changes
        $sql = "SELECT * FROM employees WHERE employeeNo = ?";
        $stmt_refresh = $conn->prepare($sql);
        $stmt_refresh->bind_param("s", $employeeNo);
        $stmt_refresh->execute();
        $result_refresh = $stmt_refresh->get_result();
        $employeeData = $result_refresh->fetch_assoc();
        $stmt_refresh->close();
    } else {
        $error = "Error updating employee details: " . $stmt->error;
    }
    $stmt->close();
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View/Edit Employee</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Employee Details</h1>
    </header>
    <div class="registration-container">
        <?php if (!empty($success)): ?>
            <p class="success-message"><?php echo $success; ?></p>
        <?php elseif (!empty($error)): ?>
            <p class="error-message"><?php echo $error; ?></p>
        <?php endif; ?>

        <?php if (!empty($employeeData)): ?>
            <form method="POST" action="view_employee.php">
                <input type="hidden" name="employeeNo" value="<?php echo htmlspecialchars($employeeData['employeeNo']); ?>">
                <div class="form-grid">
                    <div class="input-group">
                        <label for="employeeNo">Employee No.</label>
                        <input type="text" id="employeeNo" name="employeeNo" value="<?php echo htmlspecialchars($employeeData['employeeNo']); ?>" readonly>
                    </div>
                    <div class="input-group">
                        <label for="password">Password (Leave blank to keep current)</label>
                        <input type="password" id="password" name="password">
                    </div>
                    <div class="input-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value="<?php echo htmlspecialchars($employeeData['lastName']); ?>" required>
                    </div>
                    <div class="input-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($employeeData['firstName']); ?>" required>
                    </div>
                    <div class="input-group">
                        <label for="middleName">Middle Name</label>
                        <input type="text" id="middleName" name="middleName" value="<?php echo htmlspecialchars($employeeData['middleName']); ?>">
                    </div>
                    <div class="input-group">
                        <label for="birthDay">Birth Day</label>
                        <input type="date" id="birthDay" name="birthDay" value="<?php echo htmlspecialchars($employeeData['birthDay']); ?>">
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
                        <label for="phoneNumber">Phone Number</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" value="<?php echo htmlspecialchars($employeeData['phoneNumber']); ?>">
                    </div>
                    <div class="input-group form-full-width">
                        <h3>Benefits and Bank Info</h3>
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
                    <div class="input-group form-full-width">
                        <h3>Account Type</h3>
                        <div class="radio-group">
                            <input type="radio" id="employee" name="accountType" value="employee" <?php echo ($employeeData['accountType'] === 'employee') ? 'checked' : ''; ?>>
                            <label for="employee">Employee</label>
                            <input type="radio" id="admin" name="accountType" value="admin" <?php echo ($employeeData['accountType'] === 'admin') ? 'checked' : ''; ?>>
                            <label for="admin">Admin</label>
                        </div>
                    </div>
                </div>
                <button type="submit" style="margin-top: 20px;">Update Account</button>
            </form>
            <div style="text-align: center; margin-top: 20px;">
                <a href="show_employee.php" class="back-link">← Back to Employee List</a>
            </div>
        <?php else: ?>
            <p class="error-message">Invalid employee ID provided.</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="show_employee.php" class="back-link">← Back to Employee List</a>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>