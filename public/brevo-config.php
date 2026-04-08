<?php
// Brevo API configuration
// TODO: Replace with actual API key from Brevo dashboard (SMTP & API section)
// API key is loaded from a separate file not tracked in git
$brevo_key_file = __DIR__ . '/brevo-key.php';
if (file_exists($brevo_key_file)) {
    require_once $brevo_key_file;
} else {
    define('BREVO_API_KEY', '');
}
// To set up: create brevo-key.php on the server with:
// <?php define('BREVO_API_KEY', 'your-key-here'); ?>
define('BREVO_API_URL', 'https://api.brevo.com/v3');
define('FROM_EMAIL', 'erik@eb-consulting.se');
define('FROM_NAME', 'Erik Bohjort');

/**
 * Add a contact to Brevo and assign to a list
 */
function brevo_add_contact($email, $name, $listId, $attributes = []) {
    $nameParts = explode(' ', $name, 2);
    $data = [
        'email' => $email,
        'attributes' => array_merge([
            'FIRSTNAME' => $nameParts[0],
            'LASTNAME' => $nameParts[1] ?? ''
        ], $attributes),
        'listIds' => [$listId],
        'updateEnabled' => true
    ];

    $ch = curl_init(BREVO_API_URL . '/contacts');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'content-type: application/json',
        'api-key: ' . BREVO_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode >= 200 && $httpCode < 300;
}

/**
 * Send a transactional email via Brevo
 */
function brevo_send_email($toEmail, $toName, $subject, $htmlContent) {
    $data = [
        'sender' => ['name' => FROM_NAME, 'email' => FROM_EMAIL],
        'to' => [['email' => $toEmail, 'name' => $toName]],
        'subject' => $subject,
        'htmlContent' => $htmlContent
    ];

    $ch = curl_init(BREVO_API_URL . '/smtp/email');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'content-type: application/json',
        'api-key: ' . BREVO_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode >= 200 && $httpCode < 300;
}
?>
