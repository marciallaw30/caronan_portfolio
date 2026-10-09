<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit();
}

$title = $_POST['benefit_title'] ?? '';
$details = $_POST['benefit_details'] ?? '';
$image_path = null;

// Handle image upload
if (isset($_FILES['benefit_image']) && $_FILES['benefit_image']['error'] == UPLOAD_ERR_OK) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    $file_extension = pathinfo($_FILES['benefit_image']['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('benefit_', true) . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES['benefit_image']['tmp_name'], $target_file)) {
        $image_path = $target_file;
    }
}

if (!empty($title) && !empty($details)) {
    $sql = "INSERT INTO benefits (benefit_title, benefit_details, image_path) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $title, $details, $image_path);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=benefits&success=1");
    } else {
        header("Location: admin-panel.php?section=benefits&error=1");
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=benefits&error=2");
}
$conn->close();
?>