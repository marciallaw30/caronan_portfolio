<?php
session_start();
header('Content-Type: application/json');

include 'db_conn.php';

// Initialize the response array
$response = ['success' => false, 'message' => 'Invalid request.'];

// --- 1. Request and Security Checks ---

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Only POST requests are allowed.';
    // No need to exit, the script will naturally proceed to the final echo
} elseif (!isset($_SESSION['employee_no']) || !($_SESSION['account_type'] ?? '') === 'admin') {
    // NOTE: Changed !$_SESSION['is_admin'] to the correct check for admin status used in your other files.
    $response['message'] = 'Unauthorized access.';
} elseif (!isset($_POST['employeeNo'])) {
    $response['message'] = 'Missing employee number for deletion.';
} else {
    // --- All checks passed, proceed with deletion ---
    $employeeNoToDelete = $_POST['employeeNo'];
    
    // Prevent an admin from deleting their own account
    if ($employeeNoToDelete === $_SESSION['employee_no']) {
        $response['message'] = 'You cannot delete your own account.';
    } else {
        // --- 2. Database Transaction ---
        $conn->begin_transaction();
        try {
            // Step 1: Delete payroll records (if foreign key requires it)
            $sql_payroll = "DELETE FROM payroll WHERE employeeNo = ?";
            $stmt_payroll = $conn->prepare($sql_payroll);
            $stmt_payroll->bind_param("s", $employeeNoToDelete);
            $stmt_payroll->execute();
            $stmt_payroll->close();

            // Step 2: Delete the employee record
            $sql_employee = "DELETE FROM employees WHERE employeeNo = ?";
            $stmt_employee = $conn->prepare($sql_employee);
            $stmt_employee->bind_param("s", $employeeNoToDelete);
            $stmt_employee->execute();
            
            // Check if the employee was actually deleted
            if ($stmt_employee->affected_rows > 0) {
                $conn->commit();
                $response['success'] = true;
                $response['message'] = 'Employee and associated records successfully deleted.';
            } else {
                // Employee did not exist, so rollback (optional, but cleaner)
                $conn->rollback(); 
                $response['message'] = 'Employee not found in the database.';
            }
            $stmt_employee->close();
            
        } catch (mysqli_sql_exception $e) {
            $conn->rollback();
            $response['message'] = 'Database Error: ' . $e->getMessage();
        }
    }
}

// --- 3. Single point of output and exit ---
$conn->close();
echo json_encode($response);
exit(); 
?>