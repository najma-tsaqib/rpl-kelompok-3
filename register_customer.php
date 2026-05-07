<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

$name = $data->name ?? '';
$username = $data->username ?? '';
$email = $data->email ?? '';
$phone = $data->phone ?? '';
$password = $data->password ?? '';

// HASH PASSWORD (WAJIB)
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
    INSERT INTO customer (name, username, nomor_telepon, email, password)
    VALUES (:name, :username, :phone, :email, :password)
");

try {

$stmt->execute([
    'name' => $name,
    'username' => $username,
    'phone' => $phone,
    'email' => $email,
    'password' => $passwordHash
]);

    echo json_encode(["status" => "success"]);
    
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}