<?php
// Only allow requests from the site's own origins
$allowedOrigins = ["https://clear-framework.com", "https://www.clear-framework.com"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}
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
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = isset($data['company']) ? htmlspecialchars($data['company'], ENT_QUOTES, 'UTF-8') : "";
$preferredTimes = isset($data['preferredTimes']) ? htmlspecialchars($data['preferredTimes'], ENT_QUOTES, 'UTF-8') : "";
$message = isset($data['message']) ? htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8') : "";

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Prepare email headers
$to = "erik@eb-consulting.se";
$headers = "From: $email" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    "X-Mailer: PHP/" . phpversion() . "\r\n" .
    "MIME-Version: 1.0" . "\r\n" .
    "Content-Type: text/html; charset=UTF-8" . "\r\n";

// Prepare email body
$email_body = "
<html>
<head>
  <title>Discovery Call Request</title>
</head>
<body>
  <h2>New Discovery Call Request</h2>
  <p>This visitor preferred not to sign in to Microsoft Bookings. Please send them an Outlook calendar invite.</p>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Company:</strong> " . ($company !== "" ? $company : "&mdash;") . "</p>
  <p><strong>Preferred times:</strong> " . ($preferredTimes !== "" ? $preferredTimes : "&mdash;") . "</p>
  <p><strong>Message:</strong> " . ($message !== "" ? nl2br($message) : "&mdash;") . "</p>
</body>
</html>
";

// Send email
$mail_success = mail($to, "Discovery Call Request — please send an Outlook invite", $email_body, $headers);

// Save to a CSV file (optional, for backup)
$csv_file = "discovery_call_requests.csv";
$file_exists = file_exists($csv_file);
$file_handle = fopen($csv_file, "a");

if (!$file_exists) {
    // Add CSV header if the file is new
    fputcsv($file_handle, ["Name", "Email", "Company", "PreferredTimes", "Message", "Date"]);
}

// Add the new entry
fputcsv($file_handle, [$name, $email, $company, $preferredTimes, $message, date("Y-m-d H:i:s")]);
fclose($file_handle);

// Add to Brevo (non-blocking)
try {
    ob_start();
    @include_once __DIR__ . '/brevo-config.php';
    ob_end_clean();
    if (function_exists('brevo_add_contact')) {
        brevo_add_contact($email, $name, 4, ['SOURCE' => 'discovery_call']);
    }
} catch (Exception $e) { /* non-critical */ }

echo json_encode(["success" => true, "message" => "Thanks! Erik will email you an invite shortly."]);
?>
