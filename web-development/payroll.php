<?php
session_start();
if (!isset($_SESSION['employee_no']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';
$sql = "SELECT e.firstName, e.lastName, e.employeeNo, p.grossPay, p.deductions, p.netPay
        FROM employees e
        LEFT JOIN payroll p ON e.employeeNo = p.employeeNo";
$result = $conn->query($sql);
$employees = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payroll Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Payroll Management</h1>
    </header>

    <div class="page-container">
        <div class="main-content">
            <a href="admin-panel.php" class="back-link">← Back to Admin Panel</a>
            <a href="manage_payroll.php" class="back-link" style="float: right;">+ Add/Edit Payroll</a>
            
            <table class="payroll-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Gross Pay</th>
                        <th>Deductions</th>
                        <th>Net Pay</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    foreach ($employees as $employee): 
                    ?>
                    <tr>
                        <td><?php echo htmlspecialchars($employee['firstName'] . ' ' . $employee['lastName']); ?></td>
                        <td>₱<?php echo number_format($employee['grossPay'] ?? 0, 2); ?></td>
                        <td>₱<?php echo number_format($employee['deductions'] ?? 0, 2); ?></td>
                        <td>₱<?php echo number_format($employee['netPay'] ?? 0, 2); ?></td>
                        <td>
                            <a href="manage_payroll.php?edit_id=<?php echo htmlspecialchars($employee['employeeNo']); ?>">Edit</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>