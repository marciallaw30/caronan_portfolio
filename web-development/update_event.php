<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit(); // Added exit()
}

$id = $_POST['id'] ?? null;
$event_name = $_POST['event_name'] ?? '';
$event_date = $_POST['event_date'] ?? '';
$event_location = $_POST['event_location'] ?? '';
$image_path = null;

// Handle image upload
if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $image_name = uniqid() . '-' . basename($_FILES['photo']['name']);
    $target_file = $target_dir . $image_name;
    $image_path = $target_file;
    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
        header("Location: admin-panel.php?section=events&error=upload_failed");
        exit(); // Added exit()
    }
}

if ($id && !empty($event_name) && !empty($event_date) && !empty($event_location)) {
    // Check for existing image path to not overwrite if no new photo is uploaded
    if (empty($image_path)) {
        $sql_select = "SELECT image_path FROM events WHERE id = ?";
        $stmt_select = $conn->prepare($sql_select);
        $stmt_select->bind_param("i", $id);
        $stmt_select->execute();
        $result = $stmt_select->get_result();
        $row = $result->fetch_assoc();
        $image_path = $row['image_path'];
        $stmt_select->close();
    }

    $sql = "UPDATE events SET event_name = ?, event_date = ?, event_location = ?, image_path = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $event_name, $event_date, $event_location, $image_path, $id);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=events&updated=1");
        exit(); // Added exit()
    } else {
        header("Location: admin-panel.php?section=events&error=1");
        exit(); // Added exit()
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=events&error=2");
    exit(); // Added exit()
}
$conn->close();
?>