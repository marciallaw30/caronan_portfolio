<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';

if (isset($_GET['id'])) {
    $payslip_id = $_GET['id'];

    // Use a prepared statement to prevent SQL injection
    $sql = "DELETE FROM payroll WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $payslip_id);

    if ($stmt->execute()) {
        $_SESSION['message'] = "Payslip record successfully deleted.";
    } else {
        $_SESSION['message'] = "Error deleting record: " . $conn->error;
    }

    $stmt->close();
}
$conn->close();

// Redirect back to the Manage Payroll page
header("Location: manage_payroll.php");
exit();
?>