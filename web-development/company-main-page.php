<?php
session_start();
// Check if user is NOT logged in. Redirect to index.php if so.
if (!isset($_SESSION['employee_no'])) {
    header("Location: index.php");
    exit();
}
// If user is an admin, redirect them to the admin dashboard.
if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']) {
    header("Location: admin_dashboard.php");
    exit();
}
include 'db_conn.php';

// Determine which section to display based on the URL parameter
$section = $_GET['section'] ?? 'announcements';
$pageTitle = 'Company News Feed';
$records = [];
$message = '';

if (isset($_GET['success']) && $_GET['success'] == 1) {
    $message = "Your feedback has been submitted anonymously.";
}

// Fetch data based on the selected section from the database
switch ($section) {
    case 'announcements':
        $pageTitle = 'Latest Announcements';
        // Updated query to include image_path
        $sql = "SELECT id, title, content, created_at, image_path FROM announcements ORDER BY created_at DESC LIMIT 10";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        break;
    case 'events':
        $pageTitle = 'Upcoming Events';
        // Updated query to include image_path
        $sql = "SELECT id, event_name, event_date, event_location, image_path FROM events ORDER BY event_date ASC LIMIT 10";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        break;
    case 'training':
        $pageTitle = 'Training & Development';
        // Updated query to include image_path
        $sql = "SELECT id, training_title, training_description, training_link, image_path FROM training ORDER BY training_title ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        break;
    case 'benefits':
        $pageTitle = 'Benefits Information';
        // Updated query to include image_path
        $sql = "SELECT id, benefit_title, benefit_details, image_path FROM benefits ORDER BY benefit_title ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        break;
    case 'feedback':
        $pageTitle = 'Feedback & Suggestions';
        // No database fetch is needed here, as employees will be submitting, not viewing
        break;
    default:
        // Default view will show announcements
        $pageTitle = 'Latest Announcements';
        // Updated query to include image_path
        $sql = "SELECT id, title, content, created_at, image_path FROM announcements ORDER BY created_at DESC LIMIT 10";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        break;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Main Page - Datamex College of Saint Adeline</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .news-item, .event-item, .info-card {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid var(--accent-gold);
        }
        .news-item h3, .event-item h3, .info-card h3 {
            color: var(--accent-gold);
            margin-top: 0;
        }
        .news-item p, .event-item p, .info-card p {
            color: var(--text-color-light);
        }
        .news-item .date, .event-item .details, .info-card .details {
            font-size: 0.9em;
            color: #ccc;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }
        .item-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to Datamex College of Saint Adeline!</h1>
    </header>
    <div class="page-container">
        <div class="main-content">
            <h2><?php echo htmlspecialchars($pageTitle); ?></h2>
            <?php if (!empty($message)): ?>
                <div class="success-message">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>
            <?php if ($section === 'feedback'): ?>
                <p>Your feedback is important to us. Please use this form to submit your suggestions or concerns. All submissions are anonymous.</p>
                <form action="post_feedback.php" method="POST">
                    <div class="input-group">
                        <label for="feedback_text">Your Feedback:</label>
                        <textarea id="feedback_text" name="feedback_text" rows="8" required></textarea>
                    </div>
                    <button type="submit">Submit Feedback</button>
                </form>
            <?php elseif (empty($records)): ?>
                <p>No <?php echo htmlspecialchars(strtolower($pageTitle)); ?> found at this time.</p>
            <?php else: ?>
                <?php foreach ($records as $record): ?>
                    <?php if ($section === 'announcements'): ?>
                        <div class="news-item">
                            <h3><?php echo htmlspecialchars($record['title']); ?></h3>
                            <?php if (!empty($record['image_path'])): ?>
                                <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="<?php echo htmlspecialchars($record['title']); ?> image" class="item-image">
                            <?php endif; ?>
                            <p class="date">Published: <?php echo htmlspecialchars(date('F j, Y', strtotime($record['created_at']))); ?></p>
                            <p><?php echo nl2br(htmlspecialchars($record['content'])); ?></p>
                        </div>
                    <?php elseif ($section === 'events'): ?>
                        <div class="event-item">
                            <h3><?php echo htmlspecialchars($record['event_name']); ?></h3>
                            <?php if (!empty($record['image_path'])): ?>
                                <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="<?php echo htmlspecialchars($record['event_name']); ?> image" class="item-image">
                            <?php endif; ?>
                            <p class="details">Date: <?php echo htmlspecialchars(date('F j, Y', strtotime($record['event_date']))); ?></p>
                            <p class="details">Location: <?php echo htmlspecialchars($record['event_location']); ?></p>
                        </div>
                    <?php elseif ($section === 'training'): ?>
                        <div class="info-card">
                            <h3><?php echo htmlspecialchars($record['training_title']); ?></h3>
                            <?php if (!empty($record['image_path'])): ?>
                                <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="<?php echo htmlspecialchars($record['training_title']); ?> image" class="item-image">
                            <?php endif; ?>
                            <p><?php echo nl2br(htmlspecialchars($record['training_description'])); ?></p>
                            <?php if (!empty($record['training_link'])): ?>
                                <p><a href="<?php echo htmlspecialchars($record['training_link']); ?>" target="_blank">View Training</a></p>
                            <?php endif; ?>
                        </div>
                    <?php elseif ($section === 'benefits'): ?>
                        <div class="info-card">
                            <h3><?php echo htmlspecialchars($record['benefit_title']); ?></h3>
                            <?php if (!empty($record['image_path'])): ?>
                                <img src="<?php echo htmlspecialchars($record['image_path']); ?>" alt="<?php echo htmlspecialchars($record['benefit_title']); ?> image" class="item-image">
                            <?php endif; ?>
                            <p><?php echo nl2br(htmlspecialchars($record['benefit_details'])); ?></p>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <aside class="side-menu">
            <h2>Company News</h2>
            <ul>
                <li><a href="company-main-page.php?section=announcements">Announcements</a></li>
                <li><a href="company-main-page.php?section=events">Events</a></li>
            </ul>
            <h2>Employee Pages</h2>
            <ul>
                <li><a href="employee_dashboard.php">Personalized Dashboard</a></li>
                <li><a href="company-main-page.php?section=training">Training and Development</a></li>
                <li><a href="company-main-page.php?section=benefits">Benefits Information</a></li>
                <li><a href="company-main-page.php?section=feedback">Feedback and Suggestion</a></li>
            </ul>
            <button id="logoutBtn" onclick="window.location.href='logout.php'">Log Out</button>
        </aside>
    </div>
</body>
</html>