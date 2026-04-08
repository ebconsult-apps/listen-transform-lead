
<?php
// Allow requests from your domain
// TODO: In production, tighten CORS to: header("Access-Control-Allow-Origin: https://clear-framework.com");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (!isset($data['name']) || !isset($data['email']) || !isset($data['whitepaper_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Sanitize input data
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = isset($data['company']) ? filter_var($data['company'], FILTER_SANITIZE_STRING) : '';
$newsletter_opt_in = isset($data['newsletter_opt_in']) ? (bool)$data['newsletter_opt_in'] : false;
$whitepaper_id = filter_var($data['whitepaper_id'], FILTER_SANITIZE_STRING);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Map whitepaper IDs to PDF URLs
$whitepaper_map = [
    "clear-change-framework" => "/whitepapers/clear-change-framework.pdf",
    "clear-comparison" => "/whitepapers/clear-comparison.pdf",
    "clear-sustainability" => "/whitepapers/clear-sustainability.pdf",
    "clear-clarity" => "/whitepapers/clear-clarity.pdf",
    "clear-case-studies" => "/whitepapers/clear-case-studies.pdf",
];

// Validate whitepaper ID
if (!array_key_exists($whitepaper_id, $whitepaper_map)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid whitepaper identifier"]);
    exit;
}

$pdf_url = $whitepaper_map[$whitepaper_id];

// Prepare email headers
$to = "erik@eb-consulting.se";
$headers = "From: $email" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    "X-Mailer: PHP/" . phpversion() . "\r\n" .
    "MIME-Version: 1.0" . "\r\n" .
    "Content-Type: text/html; charset=UTF-8" . "\r\n";

// Get human-readable whitepaper title
$whitepaper_titles = [
    "clear-change-framework" => "The CLEAR Change Framework",
    "clear-comparison" => "Beyond Boundaries: CLEAR vs OBM, BCW & Design Thinking",
    "clear-sustainability" => "Driving Sustainable Change Inside and Out",
    "clear-clarity" => "Frameworks for Clarifying Purpose and Setting Goals",
    "clear-case-studies" => "Iterative Change: Real-World Success Stories",
];

$whitepaper_title = isset($whitepaper_titles[$whitepaper_id]) ? $whitepaper_titles[$whitepaper_id] : $whitepaper_id;

// Prepare email body
$email_body = "
<html>
<head>
  <title>New Whitepaper Download Lead</title>
</head>
<body>
  <h2>New Whitepaper Download Lead</h2>
  <p><strong>Name:</strong> $name</p>
  <p><strong>Email:</strong> $email</p>
  <p><strong>Company:</strong> " . ($company ? $company : "Not provided") . "</p>
  <p><strong>Whitepaper:</strong> $whitepaper_title</p>
  <p><strong>Newsletter opt-in:</strong> " . ($newsletter_opt_in ? "Yes" : "No") . "</p>
  <p><strong>Date:</strong> " . date("Y-m-d H:i:s") . "</p>
</body>
</html>
";

// Send notification email
$mail_success = mail($to, "Whitepaper Download: $whitepaper_title", $email_body, $headers);

// Save to CSV file for backup
$csv_file = "whitepaper_leads.csv";
$file_exists = file_exists($csv_file);
$file_handle = fopen($csv_file, "a");

if (!$file_exists) {
    fputcsv($file_handle, ["Name", "Email", "Company", "Whitepaper", "Newsletter", "Date"]);
}

fputcsv($file_handle, [
    $name,
    $email,
    $company,
    $whitepaper_id,
    $newsletter_opt_in ? "Yes" : "No",
    date("Y-m-d H:i:s")
]);
fclose($file_handle);

// Add to Brevo and send welcome email (non-blocking)
try {
    ob_start();
    @include_once __DIR__ . '/brevo-config.php';
    @include_once __DIR__ . '/nurture-emails.php';
    ob_end_clean();
    if (function_exists('brevo_add_contact')) {
        brevo_add_contact($email, $name, 2, ['COMPANY' => $company, 'WHITEPAPER' => $whitepaper_id, 'SOURCE' => 'whitepaper_download']);
        $tpl = get_email_template('whitepaper_welcome', ['name' => $name]);
        if ($tpl) { brevo_send_email($email, $name, $tpl['subject'], $tpl['html']); }
    }
} catch (Exception $e) { /* Brevo failure is non-critical */ }

// Return success with the PDF URL
echo json_encode([
    "success" => true,
    "message" => "Your whitepaper is ready for download!",
    "pdf_url" => $pdf_url
]);
?>
