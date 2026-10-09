<?php
session_start();
// --- FIX: Corrected Security Check ---
// Assuming your login file sets $_SESSION['account_type'] to 'admin'
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}
// ------------------------------------

include 'db_conn.php';

$adminName = $_SESSION['firstName'] ?? 'Admin';
$message = '';
if (isset($_GET['success']) && $_GET['success'] == 1) {
    $message = "Your content has been published.";
} elseif (isset($_GET['updated']) && $_GET['updated'] == 1) {
    $message = "Content updated successfully.";
} elseif (isset($_GET['deleted']) && $_GET['deleted'] == 1) {
    // Message for successful deletion (handled by delete.php redirect)
    $message = "Content successfully deleted.";
}

$section = $_GET['section'] ?? 'welcome';
$records = [];
$edit_record = null;

switch ($section) {
    case 'announcements':
        if (isset($_GET['edit'])) {
            $sql = "SELECT * FROM announcements WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $_GET['edit']);
            $stmt->execute();
            $result = $stmt->get_result();
            $edit_record = $result->fetch_assoc();
            $stmt->close();
        } else {
            $sql = "SELECT id, title, content, image_path, created_at FROM announcements ORDER BY created_at DESC";
            $result = $conn->query($sql);
            if ($result) {
                $records = $result->fetch_all(MYSQLI_ASSOC);
            }
        }
        break;
    case 'events':
        if (isset($_GET['edit'])) {
            $sql = "SELECT * FROM events WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $_GET['edit']);
            $stmt->execute();
            $result = $stmt->get_result();
            $edit_record = $result->fetch_assoc();
            $stmt->close();
        } else {
            $sql = "SELECT id, event_name, event_date, event_location, image_path FROM events ORDER BY event_date DESC";
            $result = $conn->query($sql);
            if ($result) {
                $records = $result->fetch_all(MYSQLI_ASSOC);
            }
        }
        break;
    case 'training':
        if (isset($_GET['edit'])) {
            $sql = "SELECT * FROM training WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $_GET['edit']);
            $stmt->execute();
            $result = $stmt->get_result();
            $edit_record = $result->fetch_assoc();
            $stmt->close();
        } else {
            $sql = "SELECT id, training_title, training_description, training_link, image_path FROM training ORDER BY created_at DESC";
            $result = $conn->query($sql);
            if ($result) {
                $records = $result->fetch_all(MYSQLI_ASSOC);
            }
        }
        break;
    case 'benefits':
        if (isset($_GET['edit'])) {
            $sql = "SELECT * FROM benefits WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $_GET['edit']);
            $stmt->execute();
            $result = $stmt->get_result();
            $edit_record = $result->fetch_assoc();
            $stmt->close();
        } else {
            $sql = "SELECT id, benefit_title, benefit_details, image_path FROM benefits ORDER BY created_at DESC";
            $result = $conn->query($sql);
            if ($result) {
                $records = $result->fetch_all(MYSQLI_ASSOC);
            }
        }
        break;
    case 'feedback':
        $sql_feedback = "SELECT id, feedback_text, created_at FROM feedback ORDER BY created_at DESC";
        $stmt_feedback = $conn->prepare($sql_feedback);
        $stmt_feedback->execute();
        $records = $stmt_feedback->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_feedback->close();
        break;
    case 'welcome':
        break;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .success-message, .edit-link {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .info-card {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
            color: #000;
        }
        .info-card h4, .info-card p, .info-card small {
            color: #000;
        }
        .info-card img {
            max-width: 100%;
            height: auto;
            margin-top: 10px;
        }
        .edit-link {
            display: inline-block;
            margin-top: 10px;
            text-decoration: none;
            background-color: #007bff;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            margin-right: 5px; /* Added spacing between buttons */
        }
        /* Style for the Delete link */
        .delete-link {
            background-color: #dc3545; /* Red for delete */
        }
        .edit-link:hover {
            background-color: #0056b3;
        }
        .delete-link:hover {
             background-color: #c82333;
        }
    </style>
</head>
<body>
    <header>
        <h1>Admin Panel</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2>Welcome, <?php echo htmlspecialchars($adminName); ?>!</h2>
            <p>This page allows you to manage all company-wide content that is visible to employees.</p>
            
            <?php if (!empty($message)): ?>
                <div class="success-message">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <?php if ($section === 'announcements'): ?>
                <?php if ($edit_record): ?>
                    <h3>Edit Announcement</h3>
                    <form action="update_announcement.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($edit_record['id']); ?>">
                        <div class="input-group">
                            <label for="announcement_title">Title</label>
                            <input type="text" id="announcement_title" name="announcement_title" value="<?php echo htmlspecialchars($edit_record['title']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="announcement_content">Content</label>
                            <textarea id="announcement_content" name="announcement_content" rows="6" required><?php echo htmlspecialchars($edit_record['content']); ?></textarea>
                        </div>
                        <div class="input-group">
                            <label for="announcement_image">Upload Image (Optional)</label>
                            <input type="file" id="announcement_image" name="announcement_image" accept="image/*">
                            <?php if (!empty($edit_record['image_path'])): ?>
                                <p>Current Image:</p>
                                <img src="<?php echo htmlspecialchars($edit_record['image_path']); ?>" alt="Current Image" style="max-width: 200px; display: block; margin-top: 10px;">
                                <input type="hidden" name="current_image" value="<?php echo htmlspecialchars($edit_record['image_path']); ?>">
                            <?php endif; ?>
                        </div>
                        <button type="submit">Update Announcement</button>
                        <a href="admin-panel.php?section=announcements" class="button">Cancel</a>
                    </form>
                <?php else: ?>
                    <h3>Manage Announcements</h3>
                    <p>Use the form below to add a new announcement. To edit an existing one, click the "Edit" link.</p>
                    <form action="post_announcement.php" method="POST" enctype="multipart/form-data">
                        <div class="input-group">
                            <label for="announcement_title">Title</label>
                            <input type="text" id="announcement_title" name="announcement_title" required>
                        </div>
                        <div class="input-group">
                            <label for="announcement_content">Content</label>
                            <textarea id="announcement_content" name="announcement_content" rows="6" required></textarea>
                        </div>
                        <div class="input-group">
                            <label for="announcement_image">Upload Image (Optional)</label>
                            <input type="file" id="announcement_image" name="announcement_image" accept="image/*">
                        </div>
                        <button type="submit">Publish Announcement</button>
                    </form>
                    <hr>
                    <h4>Existing Announcements</h4>
                    <?php if (empty($records)): ?>
                        <p>No announcements have been published yet.</p>
                    <?php else: ?>
                        <?php foreach ($records as $record): ?>
                            <div class="info-card">
                                <h4><?php echo htmlspecialchars($record['title']); ?></h4>
                                <p><?php echo nl2br(htmlspecialchars($record['content'])); ?></p>
                                <?php if (!empty($record['image_path'])): ?>
                                    <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="Announcement Image">
                                <?php endif; ?>
                                <p><small>Published: <?php echo htmlspecialchars(date('F j, Y', strtotime($record['created_at']))); ?></small></p>
                                
                                <a href="admin-panel.php?section=announcements&edit=<?php echo $record['id']; ?>" class="edit-link">Edit</a>
                                
                                <a href="delete.php?section=announcements&id=<?php echo $record['id']; ?>" 
                                   class="edit-link delete-link" 
                                   onclick="return confirm('Are you sure you want to delete the announcement: \'<?php echo htmlspecialchars(addslashes($record['title'])); ?>\'? This cannot be undone.');">
                                    Delete
                                </a>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>

            <?php elseif ($section === 'events'): ?>
                <?php if ($edit_record): ?>
                    <h3>Edit Event</h3>
                    <form action="update_event.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($edit_record['id']); ?>">
                        <div class="input-group">
                            <label for="event_name">Event Name</label>
                            <input type="text" id="event_name" name="event_name" value="<?php echo htmlspecialchars($edit_record['event_name']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="event_date">Event Date</label>
                            <input type="date" id="event_date" name="event_date" value="<?php echo htmlspecialchars($edit_record['event_date']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="event_location">Location</label>
                            <input type="text" id="event_location" name="event_location" value="<?php echo htmlspecialchars($edit_record['event_location']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="event_image">Upload Image (Optional)</label>
                            <input type="file" id="event_image" name="event_image" accept="image/*">
                            <?php if (!empty($edit_record['image_path'])): ?>
                                <p>Current Image:</p>
                                <img src="<?php echo htmlspecialchars($edit_record['image_path']); ?>" alt="Current Image" style="max-width: 200px; display: block; margin-top: 10px;">
                                <input type="hidden" name="current_image" value="<?php echo htmlspecialchars($edit_record['image_path']); ?>">
                            <?php endif; ?>
                        </div>
                        <button type="submit">Update Event</button>
                        <a href="admin-panel.php?section=events" class="button">Cancel</a>
                    </form>
                <?php else: ?>
                    <h3>Manage Events</h3>
                    <p>Use the form below to add a new company event. To edit an existing one, click the "Edit" link.</p>
                    <form action="post_event.php" method="POST" enctype="multipart/form-data">
                        <div class="input-group">
                            <label for="event_name">Event Name</label>
                            <input type="text" id="event_name" name="event_name" required>
                        </div>
                        <div class="input-group">
                            <label for="event_date">Event Date</label>
                            <input type="date" id="event_date" name="event_date" required>
                        </div>
                        <div class="input-group">
                            <label for="event_location">Location</label>
                            <input type="text" id="event_location" name="event_location" required>
                        </div>
                        <div class="input-group">
                            <label for="event_image">Upload Image (Optional)</label>
                            <input type="file" id="event_image" name="event_image" accept="image/*">
                        </div>
                        <button type="submit">Create Event</button>
                    </form>
                    <hr>
                    <h4>Existing Events</h4>
                    <?php if (empty($records)): ?>
                        <p>No events have been created yet.</p>
                    <?php else: ?>
                        <?php foreach ($records as $record): ?>
                            <div class="info-card">
                                <h4><?php echo htmlspecialchars($record['event_name']); ?></h4>
                                <p><strong>Date:</strong> <?php echo htmlspecialchars(date('F j, Y', strtotime($record['event_date']))); ?></p>
                                <p><strong>Location:</strong> <?php echo htmlspecialchars($record['event_location']); ?></p>
                                <?php if (!empty($record['image_path'])): ?>
                                    <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="Event Image">
                                <?php endif; ?>
                                <a href="admin-panel.php?section=events&edit=<?php echo $record['id']; ?>" class="edit-link">Edit</a>
                                <a href="delete.php?section=events&id=<?php echo $record['id']; ?>" 
                                   class="edit-link delete-link" 
                                   onclick="return confirm('Are you sure you want to delete the event: \'<?php echo htmlspecialchars(addslashes($record['event_name'])); ?>\'? This cannot be undone.');">
                                    Delete
                                </a>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>

            <?php elseif ($section === 'training'): ?>
                <?php if ($edit_record): ?>
                    <h3>Edit Training & Development</h3>
                    <form action="update_training.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($edit_record['id']); ?>">
                        <div class="input-group">
                            <label for="training_title">Training Title</label>
                            <input type="text" id="training_title" name="training_title" value="<?php echo htmlspecialchars($edit_record['training_title']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="training_description">Description</label>
                            <textarea id="training_description" name="training_description" rows="6" required><?php echo htmlspecialchars($edit_record['training_description']); ?></textarea>
                        </div>
                        <div class="input-group">
                            <label for="training_link">Link (Optional)</label>
                            <input type="url" id="training_link" name="training_link" value="<?php echo htmlspecialchars($edit_record['training_link']); ?>">
                        </div>
                        <div class="input-group">
                            <label for="training_image">Upload Image (Optional)</label>
                            <input type="file" id="training_image" name="training_image" accept="image/*">
                            <?php if (!empty($edit_record['image_path'])): ?>
                                <p>Current Image:</p>
                                <img src="<?php echo htmlspecialchars($edit_record['image_path']); ?>" alt="Current Image" style="max-width: 200px; display: block; margin-top: 10px;">
                                <input type="hidden" name="current_image" value="<?php echo htmlspecialchars($edit_record['image_path']); ?>">
                            <?php endif; ?>
                        </div>
                        <button type="submit">Update Training</button>
                        <a href="admin-panel.php?section=training" class="button">Cancel</a>
                    </form>
                <?php else: ?>
                    <h3>Manage Training & Development</h3>
                    <p>Add new training programs or resources for employees. To edit an existing one, click the "Edit" link.</p>
                    <form action="post_training.php" method="POST" enctype="multipart/form-data">
                        <div class="input-group">
                            <label for="training_title">Training Title</label>
                            <input type="text" id="training_title" name="training_title" required>
                        </div>
                        <div class="input-group">
                            <label for="training_description">Description</label>
                            <textarea id="training_description" name="training_description" rows="6" required></textarea>
                        </div>
                        <div class="input-group">
                            <label for="training_link">Link (Optional)</label>
                            <input type="url" id="training_link" name="training_link">
                        </div>
                        <div class="input-group">
                            <label for="training_image">Upload Image (Optional)</label>
                            <input type="file" id="training_image" name="training_image" accept="image/*">
                        </div>
                        <button type="submit">Add Training</button>
                    </form>
                    <hr>
                    <h4>Existing Training & Development</h4>
                    <?php if (empty($records)): ?>
                        <p>No training resources have been added yet.</p>
                    <?php else: ?>
                        <?php foreach ($records as $record): ?>
                            <div class="info-card">
                                <h4><?php echo htmlspecialchars($record['training_title']); ?></h4>
                                <p><?php echo nl2br(htmlspecialchars($record['training_description'])); ?></p>
                                <?php if (!empty($record['training_link'])): ?>
                                    <p><a href="<?php echo htmlspecialchars($record['training_link']); ?>" target="_blank">View Resource</a></p>
                                <?php endif; ?>
                                <?php if (!empty($record['image_path'])): ?>
                                    <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="Training Image">
                                <?php endif; ?>
                                <a href="admin-panel.php?section=training&edit=<?php echo $record['id']; ?>" class="edit-link">Edit</a>
                                <a href="delete.php?section=training&id=<?php echo $record['id']; ?>" 
                                   class="edit-link delete-link" 
                                   onclick="return confirm('Are you sure you want to delete the training: \'<?php echo htmlspecialchars(addslashes($record['training_title'])); ?>\'? This cannot be undone.');">
                                    Delete
                                </a>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>

            <?php elseif ($section === 'benefits'): ?>
                <?php if ($edit_record): ?>
                    <h3>Edit Benefits Information</h3>
                    <form action="update_benefit.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($edit_record['id']); ?>">
                        <div class="input-group">
                            <label for="benefit_title">Benefit Title</label>
                            <input type="text" id="benefit_title" name="benefit_title" value="<?php echo htmlspecialchars($edit_record['benefit_title']); ?>" required>
                        </div>
                        <div class="input-group">
                            <label for="benefit_details">Details</label>
                            <textarea id="benefit_details" name="benefit_details" rows="6" required><?php echo htmlspecialchars($edit_record['benefit_details']); ?></textarea>
                        </div>
                        <div class="input-group">
                            <label for="benefit_image">Upload Image (Optional)</label>
                            <input type="file" id="benefit_image" name="benefit_image" accept="image/*">
                            <?php if (!empty($edit_record['image_path'])): ?>
                                <p>Current Image:</p>
                                <img src="<?php echo htmlspecialchars($edit_record['image_path']); ?>" alt="Current Image" style="max-width: 200px; display: block; margin-top: 10px;">
                                <input type="hidden" name="current_image" value="<?php echo htmlspecialchars($edit_record['image_path']); ?>">
                            <?php endif; ?>
                        </div>
                        <button type="submit">Update Benefit</button>
                        <a href="admin-panel.php?section=benefits" class="button">Cancel</a>
                    </form>
                <?php else: ?>
                    <h3>Manage Benefits Information</h3>
                    <p>Add new employee benefits details. To edit an existing one, click the "Edit" link.</p>
                    <form action="post_benefit.php" method="POST" enctype="multipart/form-data">
                        <div class="input-group">
                            <label for="benefit_title">Benefit Title</label>
                            <input type="text" id="benefit_title" name="benefit_title" required>
                        </div>
                        <div class="input-group">
                            <label for="benefit_details">Details</label>
                            <textarea id="benefit_details" name="benefit_details" rows="6" required></textarea>
                        </div>
                        <div class="input-group">
                            <label for="benefit_image">Upload Image (Optional)</label>
                            <input type="file" id="benefit_image" name="benefit_image" accept="image/*">
                        </div>
                        <button type="submit">Add Benefit</button>
                    </form>
                    <hr>
                    <h4>Existing Benefits</h4>
                    <?php if (empty($records)): ?>
                        <p>No benefits have been added yet.</p>
                    <?php else: ?>
                        <?php foreach ($records as $record): ?>
                            <div class="info-card">
                                <h4><?php echo htmlspecialchars($record['benefit_title']); ?></h4>
                                <p><?php echo nl2br(htmlspecialchars($record['benefit_details'])); ?></p>
                                <?php if (!empty($record['image_path'])): ?>
                                    <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="Benefit Image">
                                <?php endif; ?>
                                <a href="admin-panel.php?section=benefits&edit=<?php echo $record['id']; ?>" class="edit-link">Edit</a>
                                <a href="delete.php?section=benefits&id=<?php echo $record['id']; ?>" 
                                   class="edit-link delete-link" 
                                   onclick="return confirm('Are you sure you want to delete the benefit: \'<?php echo htmlspecialchars(addslashes($record['benefit_title'])); ?>\'? This cannot be undone.');">
                                    Delete
                                </a>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>
                
            <?php elseif ($section === 'feedback'): ?>
                <h3>Employee Feedback & Suggestions</h3>
                <p>Read anonymous feedback submitted by employees.</p>
                <?php if (empty($records)): ?>
                    <p>No feedback has been submitted yet.</p>
                <?php else: ?>
                    <div class="feedback-list">
                        <?php foreach ($records as $feedback): ?>
                            <div class="info-card">
                                <p><strong>Submitted:</strong> <?php echo htmlspecialchars(date('F j, Y', strtotime($feedback['created_at']))); ?></p>
                                <p><?php echo nl2br(htmlspecialchars($feedback['feedback_text'])); ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <p>Select a tool from the menu to get started.</p>
                <p>This page serves as a central point for all administrative functions. Please use the navigation menu on the left to access the different management sections.</p>
            <?php endif; ?>
        </div>
        <aside class="side-menu">
            <h2>Admin Tools</h2>
            <ul>
                <li><a href="admin_dashboard.php">Dashboard</a></li>
                <li><a href="kiosk_login.php">Launch Attendance Kiosk</a></li>
                <li><a href="admin-panel.php?section=announcements">Announcements</a></li>
                <li><a href="admin-panel.php?section=events">Events</a></li>
                <li><a href="admin-panel.php?section=training">Training & Development</a></li>
                <li><a href="admin-panel.php?section=benefits">Benefits Information</a></li>
                <li><a href="admin-panel.php?section=feedback">Feedback & Suggestions</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>