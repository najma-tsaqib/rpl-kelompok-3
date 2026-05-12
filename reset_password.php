<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$password = $data->password ?? '';

$hash =
  password_hash(
    $password,
    PASSWORD_DEFAULT
  );

$stmt = $pdo->prepare("
UPDATE customer
SET password = :password,
    otp = NULL,
    otp_expired = NULL
WHERE username = :username
");

$stmt->execute([
  'password' => $hash,
  'username' => $username
]);

echo json_encode([
  "status" => "success"
]);