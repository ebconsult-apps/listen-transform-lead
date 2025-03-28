
<?php
// Allow requests from your domain
header("Access-Control-Allow-Origin: *"); // In production, replace * with your actual domain
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (!isset($data['name']) || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$notifications = isset($data['notifications']) ? (bool)$data['notifications'] : false;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Prepare email headers
$to = "hello@simplelistening.com";
$headers = "From: $email" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    "X-Mailer: PHP/" . phpversion() . "\r\n" .
    "MIME-Version: 1.0" . "\r\n" .
    "Content-Type: text/html; charset=UTF-8" . "\r\n";

// Prepare email body
$email_body = "
<html>
<head>
  <title>New Book Interest</title>
</head>
<body>
  <h2>New Book Interest Registration</h2>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Subscribe to updates:</strong> " . ($notifications ? "Yes" : "No") . "</p>
</body>
</html>
";

// Send email
$mail_success = mail($to, "Book Interest Registration", $email_body, $headers);

// Save to a CSV file (optional, for backup)
$csv_file = "book_interests.csv";
$file_exists = file_exists($csv_file);
$file_handle = fopen($csv_file, "a");

if (!$file_exists) {
    // Add CSV header if the file is new
    fputcsv($file_handle, ["Name", "Email", "Notifications", "Date"]);
}

// Add the new entry
fputcsv($file_handle, [$name, $email, $notifications ? "Yes" : "No", date("Y-m-d H:i:s")]);
fclose($file_handle);

if ($mail_success) {
    echo json_encode(["success" => true, "message" => "Your pre-order interest has been registered!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to register your interest. Please try again later."]);
}
?>
