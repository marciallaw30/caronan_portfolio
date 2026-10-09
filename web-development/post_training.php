<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit();
}

$title = $_POST['training_title'] ?? '';
$description = $_POST['training_description'] ?? '';
$link = $_POST['training_link'] ?? '';
$image_path = null;

// Handle image upload
if (isset($_FILES['training_image']) && $_FILES['training_image']['error'] == UPLOAD_ERR_OK) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    $file_extension = pathinfo($_FILES['training_image']['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('training_', true) . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES['training_image']['tmp_name'], $target_file)) {
        $image_path = $target_file;
    }
}

if (!empty($title) && !empty($description)) {
    $sql = "INSERT INTO training (training_title, training_description, training_link, image_path) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $title, $description, $link, $image_path);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=training&success=1");
    } else {
        header("Location: admin-panel.php?section=training&error=1");
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=training&error=2");
}
$conn->close();
?>