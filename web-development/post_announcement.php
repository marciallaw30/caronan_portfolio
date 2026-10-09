<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit();
}

$title = $_POST['announcement_title'] ?? '';
$content = $_POST['announcement_content'] ?? '';
$image_path = null;

// Handle image upload
if (isset($_FILES['announcement_image']) && $_FILES['announcement_image']['error'] == UPLOAD_ERR_OK) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    $file_extension = pathinfo($_FILES['announcement_image']['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('announcement_', true) . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES['announcement_image']['tmp_name'], $target_file)) {
        $image_path = $target_file;
    }
}

if (!empty($title) && !empty($content)) {
    $sql = "INSERT INTO announcements (title, content, image_path) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $title, $content, $image_path);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=announcements&success=1");
    } else {
        header("Location: admin-panel.php?section=announcements&error=1");
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=announcements&error=2");
}
$conn->close();
?>