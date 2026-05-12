<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$otp = $data->otp ?? '';

$stmt = $pdo->prepare("
SELECT * FROM customer
WHERE username = :username
");

$stmt->execute([
  'username' => $username
]);

$user = $stmt->fetch();

if (
  !$user ||
  $user['otp'] != $otp
) {

  echo json_encode([
    "status" => "error",
    "message" => "OTP salah"
  ]);

  exit;
}

if (
  strtotime($user['otp_expired']) < time()
) {

  echo json_encode([
    "status" => "error",
    "message" => "OTP expired"
  ]);

  exit;
}

echo json_encode([
  "status" => "success"
]);