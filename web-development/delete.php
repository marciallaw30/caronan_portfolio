<?php
session_start();
include 'db_conn.php';

// Check if user is an admin
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    header("Location: index.php");
    exit();
}

// Check if id and section are provided
if (!isset($_GET['id']) || !isset($_GET['section'])) {
    header("Location: admin-panel.php?error=missing_parameters");
    exit();
}

$id = $_GET['id'];
$section = $_GET['section'];

$table = '';
$redirect_section = '';

switch ($section) {
    case 'announcements':
        $table = 'announcements';
        $redirect_section = 'announcements';
        break;
    case 'events':
        $table = 'events';
        $redirect_section = 'events';
        break;
    case 'training':
        $table = 'training';
        $redirect_section = 'training';
        break;
    case 'benefits':
        $table = 'benefits';
        $redirect_section = 'benefits';
        break;
    case 'feedback':
        $table = 'feedback';
        $redirect_section = 'feedback';
        break;
    default:
        header("Location: admin-panel.php?error=invalid_section");
        exit();
}

// Prepare and execute the delete statement
$sql = "DELETE FROM {$table} WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    header("Location: admin-panel.php?section={$redirect_section}&deleted=1");
} else {
    header("Location: admin-panel.php?section={$redirect_section}&error=deletion_failed");
}

$stmt->close();
$conn->close();
?>