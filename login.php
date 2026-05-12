<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$password = $data->password ?? '';

// CEK ADMIN
$query = $pdo->prepare("SELECT * FROM admin WHERE username = :username");
$query->execute(['username' => $username]);
$admin = $query->fetch();

if ($admin) {
    if ($password == $admin['password']) {
        echo json_encode([
            "status" => "success",
            "role" => "admin"
        ]);
        exit;
    }
}

// CEK CUSTOMER
$stmt = $pdo->prepare("SELECT * FROM customer WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch();

if ($user) {

    if (password_verify($password, $user['password'])) {

        echo json_encode([
            "status" => "success",
            "role" => "customer",

            "user" => [
                "id_customer" => $user['id_customer'],
                "username" => $user['username']
            ]
        ]);

        exit;
    }
}

echo json_encode([
    "status" => "error",
    "message" => "Login gagal"
]);