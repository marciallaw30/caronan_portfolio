<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['employee_no']) || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit();
}

$feedback_text = $_POST['feedback_text'] ?? '';

if (!empty($feedback_text)) {
    $sql = "INSERT INTO feedback (feedback_text) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $feedback_text);

    if ($stmt->execute()) {
        header("Location: company-main-page.php?section=feedback&success=1");
    } else {
        header("Location: company-main-page.php?section=feedback&error=1");
    }
    $stmt->close();
} else {
    header("Location: company-main-page.php?section=feedback&error=2");
}
$conn->close();
?>