<?php
$servername = "localhost"; // The server name.
$username = "root"; // Your MySQL username.
$password = ""; // Your MySQL password.
$dbname = "datamex_payroll_db"; // The database name.

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>