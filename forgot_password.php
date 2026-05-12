<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';

$stmt = $pdo->prepare("
SELECT * FROM customer
WHERE username = :username
");

$stmt->execute([
  'username' => $username
]);

$user = $stmt->fetch();

if (!$user) {

  echo json_encode([
    "status" => "error",
    "message" => "Username tidak ditemukan"
  ]);

  exit;
}

$otp = rand(100000, 999999);

$expired =
  date(
    "Y-m-d H:i:s",
    strtotime("+5 minutes")
  );

$update = $pdo->prepare("
UPDATE customer
SET otp = :otp,
    otp_expired = :expired
WHERE username = :username
");

$update->execute([
  'otp' => $otp,
  'expired' => $expired,
  'username' => $username
]);

$phone =
  preg_replace(
    '/^0/',
    '62',
    $user['nomor_telepon']
  );

$message =
"Kode OTP reset password Lestari Store Anda: $otp

Jangan berikan kode ini kepada siapa pun.";

$dataWA = [
  "target" => $phone,
  "message" => $message
];

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.fonnte.com/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => http_build_query($dataWA),
  CURLOPT_HTTPHEADER => array(
    "Authorization: sFeVhhfzDsqFgg395VEV"
  ),
));

$response = curl_exec($curl);

curl_close($curl);

echo json_encode([
  "status" => "success"
]);