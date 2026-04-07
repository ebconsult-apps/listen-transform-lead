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
$orgSize = isset($data['orgSize']) ? htmlspecialchars($data['orgSize'], ENT_QUOTES, 'UTF-8') : '';
$role = isset($data['role']) ? htmlspecialchars($data['role'], ENT_QUOTES, 'UTF-8') : '';
$challenge = isset($data['challenge']) ? htmlspecialchars($data['challenge'], ENT_QUOTES, 'UTF-8') : '';
$clarity = isset($data['clarity']) ? intval($data['clarity']) : 0;
$leverage = isset($data['leverage']) ? intval($data['leverage']) : 0;
$experimentation = isset($data['experimentation']) ? intval($data['experimentation']) : 0;
$analysis = isset($data['analysis']) ? intval($data['analysis']) : 0;
$refinement = isset($data['refinement']) ? intval($data['refinement']) : 0;
$totalScore = isset($data['totalScore']) ? intval($data['totalScore']) : 0;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Save to CSV
$csv_file = __DIR__ . '/assessment_leads.csv';
$is_new = !file_exists($csv_file);
$fp = fopen($csv_file, 'a');
if ($is_new) {
    fputcsv($fp, ['Name', 'Email', 'Company', 'Org Size', 'Role', 'Challenge', 'Clarity', 'Leverage', 'Experimentation', 'Analysis', 'Refinement', 'Total Score', 'Timestamp']);
}
fputcsv($fp, [$name, $email, $company, $orgSize, $role, $challenge, $clarity, $leverage, $experimentation, $analysis, $refinement, $totalScore, date('Y-m-d H:i:s')]);
fclose($fp);

// Determine readiness level
if ($totalScore <= 12) {
    $readiness = "Significant Opportunity ($totalScore/25)";
} elseif ($totalScore <= 18) {
    $readiness = "Building Momentum ($totalScore/25)";
} else {
    $readiness = "Strong Foundation ($totalScore/25)";
}

// Send notification email
$to = "hello@simplelistening.com";
$headers = "From: $email\r\n" .
    "Reply-To: $email\r\n" .
    "MIME-Version: 1.0\r\n" .
    "Content-Type: text/html; charset=UTF-8\r\n";

$email_body = "
<html>
<body>
  <h2>New Change Readiness Assessment</h2>
  <h3>Contact Information</h3>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Company:</strong> $company</p>

  <h3>Qualifying Information</h3>
  <p><strong>Organization Size:</strong> $orgSize</p>
  <p><strong>Role:</strong> $role</p>
  <p><strong>Biggest Challenge:</strong> $challenge</p>

  <h3>CLEAR Scores</h3>
  <p><strong>Readiness Level:</strong> $readiness</p>
  <table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>
    <tr><th>Dimension</th><th>Score</th></tr>
    <tr><td>Clarity</td><td>$clarity / 5</td></tr>
    <tr><td>Leverage</td><td>$leverage / 5</td></tr>
    <tr><td>Experimentation</td><td>$experimentation / 5</td></tr>
    <tr><td>Analysis</td><td>$analysis / 5</td></tr>
    <tr><td>Refinement</td><td>$refinement / 5</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>$totalScore / 25</strong></td></tr>
  </table>
</body>
</html>";

$mail_success = mail($to, "Assessment Lead: $name ($company) - $readiness", $email_body, $headers);

if ($mail_success) {
    echo json_encode(["success" => true, "message" => "Thank you! Your report is on its way."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Something went wrong. Please try again."]);
}
?>
