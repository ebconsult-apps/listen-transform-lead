<?php
// Allow requests from your domain
header("Access-Control-Allow-Origin: *"); // TODO: Replace * with https://clear-framework.com in production
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['company'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = htmlspecialchars($data['company'], ENT_QUOTES, 'UTF-8');
$jobTitle = isset($data['jobTitle']) ? htmlspecialchars($data['jobTitle'], ENT_QUOTES, 'UTF-8') : '';
$orgSize = isset($data['orgSize']) ? htmlspecialchars($data['orgSize'], ENT_QUOTES, 'UTF-8') : '';
$challengeType = isset($data['challengeType']) ? htmlspecialchars($data['challengeType'], ENT_QUOTES, 'UTF-8') : '';
$timeline = isset($data['timeline']) ? htmlspecialchars($data['timeline'], ENT_QUOTES, 'UTF-8') : '';
$description = isset($data['description']) ? htmlspecialchars($data['description'], ENT_QUOTES, 'UTF-8') : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Save to CSV
$csv_file = __DIR__ . '/qualified_leads.csv';
$is_new = !file_exists($csv_file);
$fp = fopen($csv_file, 'a');
if ($is_new) {
    fputcsv($fp, ['Name', 'Email', 'Company', 'Job Title', 'Org Size', 'Challenge Type', 'Timeline', 'Description', 'Timestamp']);
}
fputcsv($fp, [$name, $email, $company, $jobTitle, $orgSize, $challengeType, $timeline, $description, date('Y-m-d H:i:s')]);
fclose($fp);

// Send notification email
$to = "erik@eb-consulting.se";
$headers = "From: $email\r\n" .
    "Reply-To: $email\r\n" .
    "MIME-Version: 1.0\r\n" .
    "Content-Type: text/html; charset=UTF-8\r\n";

$email_body = "
<html>
<body>
  <h2>New Qualified Lead</h2>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Company:</strong> $company</p>
  <p><strong>Job Title:</strong> $jobTitle</p>
  <p><strong>Organization Size:</strong> $orgSize</p>
  <p><strong>Challenge:</strong> $challengeType</p>
  <p><strong>Timeline:</strong> $timeline</p>
  <p><strong>Description:</strong> $description</p>
</body>
</html>";

$mail_success = mail($to, "New Lead: $name ($company)", $email_body, $headers);

if ($mail_success) {
    echo json_encode(["success" => true, "message" => "Thank you! We'll be in touch shortly."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Something went wrong. Please try again."]);
}
?>
