<?php
session_start();
// Check if user is logged in and is an admin
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';

// --- New Sorting Logic ---
$sortOrder = 'DESC'; // Default to newest first
$sortText = 'Sort: Oldest First'; // Text for the button to switch to the opposite sort

if (isset($_GET['sort']) && $_GET['sort'] === 'oldest') {
    $sortOrder = 'ASC';
    $sortText = 'Sort: Newest First';
}

// Fetch all employees from the database, ordered by ID based on the determined sort order
$sql = "SELECT * FROM employees ORDER BY id {$sortOrder}";
$result = $conn->query($sql);
$employees = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}
$conn->close();

// Determine the link for the button (toggles the sort)
$oppositeSort = ($sortOrder === 'DESC') ? 'oldest' : 'newest';
$sortLink = "manage_employees.php?sort={$oppositeSort}";

// Retrieve and clear any session message (used for status update success)
$sessionMessage = $_SESSION['message'] ?? '';
unset($_SESSION['message']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Employees</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* Add a style for the new control block */
        .table-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        /* Style for the new sort button */
        .sort-button {
            padding: 10px 15px;
            background-color: #007bff; /* Use a distinct color */
            color: white;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
        }
        .sort-button:hover {
            background-color: #0056b3;
        }
        /* Style for success message */
        .status-success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <h1>Manage Employees</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2>Employee List</h2>
            
            <?php if (!empty($sessionMessage)): ?>
                <div class="status-success-message">
                    <?php echo htmlspecialchars($sessionMessage); ?>
                </div>
            <?php endif; ?>

            <div class="table-controls">
                <a href="registration.php" class="button">Register New Employee</a>
                <a href="<?php echo htmlspecialchars($sortLink); ?>" class="sort-button">
                    <?php echo htmlspecialchars($sortText); ?>
                </a>
            </div>
            
            <table class="payroll-table">
                <thead>
                    <tr>
                        <th>Employee No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($employees)): ?>
                        <?php foreach ($employees as $employee): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($employee['employeeNo']); ?></td>
                            <td><?php echo htmlspecialchars($employee['firstName'] . ' ' . $employee['lastName']); ?></td>
                            <td><?php echo htmlspecialchars($employee['email'] ?? 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($employee['department'] ?? 'N/A'); ?></td> 
                            <td><?php echo htmlspecialchars($employee['position'] ?? 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($employee['status'] ?? 'Active'); ?></td>
                            <td>
                                <a href="edit_employee.php?employeeNo=<?php echo htmlspecialchars($employee['employeeNo']); ?>">Edit</a> | 
                                <a href="update_employee_status.php?employeeNo=<?php echo htmlspecialchars($employee['employeeNo']); ?>" style="color: #28a745; font-weight: bold;">Status</a> | 
                                <a href="#" class="delete-btn" data-employee-no="<?php echo htmlspecialchars($employee['employeeNo']); ?>">Delete</a> |
                                <a href="admin_change_password.php?employeeNo=<?php echo htmlspecialchars($employee['employeeNo']); ?>">Change Password</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="7">No employees found.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <aside class="side-menu">
            <h2>Admin Tools</h2>
            <ul>
                <li><a href="admin_dashboard.php">Dashboard</a></li>
                <li><a href="manage_employees.php">Manage Employees</a></li>
                <li><a href="manage_payroll.php">Manage Employee Payroll</a></li>
                <li><a href="manage_attendance.php">Manage Attendance</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const deleteButtons = document.querySelectorAll('.delete-btn');

        deleteButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Prevents page reload from the link

                const employeeNo = this.getAttribute('data-employee-no');
                
                // Get the employee's name for a better confirmation prompt
                const row = this.closest('tr');
                // Assuming the name is in the second column (index 1)
                const employeeName = row.cells[1].textContent; 

                if (confirm(`Are you sure you want to delete the account for: ${employeeName} (${employeeNo})? This action cannot be undone.`)) {
                    // Send an AJAX request using the Fetch API
                    fetch('delete_employee_ajax.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        // The delete_employee_ajax.php file expects 'employeeNo' in the POST body
                        body: 'employeeNo=' + encodeURIComponent(employeeNo) 
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Use session message functionality if you have it, otherwise use an alert
                            alert(data.message);
                            // Reload the page to confirm the employee is gone from the list
                            window.location.reload(); 
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                    });
                }
            });
        });
    });
    </script>
</body>
</html>