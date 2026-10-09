<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit();
}

$event_name = $_POST['event_name'] ?? '';
$event_date = $_POST['event_date'] ?? '';
$event_location = $_POST['event_location'] ?? '';
$image_path = null;

// Handle image upload
if (isset($_FILES['event_image']) && $_FILES['event_image']['error'] == UPLOAD_ERR_OK) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    $file_extension = pathinfo($_FILES['event_image']['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('event_', true) . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES['event_image']['tmp_name'], $target_file)) {
        $image_path = $target_file;
    }
}

if (!empty($event_name) && !empty($event_date) && !empty($event_location)) {
    $sql = "INSERT INTO events (event_name, event_date, event_location, image_path) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $event_name, $event_date, $event_location, $image_path);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=events&success=1");
    } else {
        header("Location: admin-panel.php?section=events&error=1");
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=events&error=2");
}
$conn->close();
?>