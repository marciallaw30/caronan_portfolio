<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $employeeNo = $_SESSION['employee_no'];

    // Get and sanitize all form data
    $lastName = $_POST['lastName'] ?? '';
    $firstName = $_POST['firstName'] ?? '';
    $middleName = $_POST['middleName'] ?? '';
    $birthDay = $_POST['birthDay'] ?? '';
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

    // SQL to update all employee information fields
    $sql_update = "UPDATE employees SET 
        lastName = ?, firstName = ?, middleName = ?, birthDay = ?, birthPlace = ?, 
        address = ?, email = ?, gender = ?, civilStatus = ?, nationality = ?, 
        religion = ?, phoneNumber = ?, sssNumber = ?, pagibigNumber = ?, 
        tinNumber = ?, philhealthNumber = ?, bankAccount = ? 
        WHERE employeeNo = ?";
    
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param(
        "ssssssssssssssssss", 
        $lastName, $firstName, $middleName, $birthDay, $birthPlace, 
        $address, $email, $gender, $civilStatus, $nationality, 
        $religion, $phoneNumber, $sssNumber, $pagibigNumber, 
        $tinNumber, $philhealthNumber, $bankAccount, $employeeNo
    );

    if ($stmt_update->execute()) {
        header("Location: user_dashboard.php?section=profile&success=profile_updated");
    } else {
        header("Location: user_dashboard.php?section=edit_profile&error=update_failed");
    }

    $stmt_update->close();
}

$conn->close();
?>