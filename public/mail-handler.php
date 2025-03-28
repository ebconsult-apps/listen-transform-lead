
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
if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$subject = filter_var($data['subject'], FILTER_SANITIZE_STRING);
$message = filter_var($data['message'], FILTER_SANITIZE_STRING);

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
  <title>New Contact Message</title>
</head>
<body>
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Subject:</strong> $subject</p>
  <p><strong>Message:</strong></p>
  <p>$message</p>
</body>
</html>
";

// Send email
$mail_success = mail($to, "Contact Form: $subject", $email_body, $headers);

if ($mail_success) {
    echo json_encode(["success" => true, "message" => "Your message has been sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to send your message. Please try again later."]);
}
?>
