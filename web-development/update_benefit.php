<?php
session_start();
include 'db_conn.php';

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin'] || $_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit(); // Added exit()
}

$id = $_POST['id'] ?? null;
$title = $_POST['benefit_title'] ?? '';
$details = $_POST['benefit_details'] ?? '';
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
        header("Location: admin-panel.php?section=benefits&error=upload_failed");
        exit(); // Added exit()
    }
}

if ($id && !empty($title) && !empty($details)) {
    // Check for existing image path to not overwrite if no new photo is uploaded
    if (empty($image_path)) {
        $sql_select = "SELECT image_path FROM benefits WHERE id = ?";
        $stmt_select = $conn->prepare($sql_select);
        $stmt_select->bind_param("i", $id);
        $stmt_select->execute();
        $result = $stmt_select->get_result();
        $row = $result->fetch_assoc();
        $image_path = $row['image_path'];
        $stmt_select->close();
    }

    $sql = "UPDATE benefits SET benefit_title = ?, benefit_details = ?, image_path = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $title, $details, $image_path, $id);

    if ($stmt->execute()) {
        header("Location: admin-panel.php?section=benefits&updated=1");
        exit(); // Added exit()
    } else {
        header("Location: admin-panel.php?section=benefits&error=1");
        exit(); // Added exit()
    }
    $stmt->close();
} else {
    header("Location: admin-panel.php?section=benefits&error=2");
    exit(); // Added exit()
}
$conn->close();
?>