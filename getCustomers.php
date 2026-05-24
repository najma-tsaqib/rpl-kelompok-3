<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'config/db.php';

try {

$query = $pdo->query("
    SELECT 
        c.id_customer AS id,
        c.name,
        c.username,
        c.email,
        c.nomor_telepon AS phone,

        COUNT(p.id_pesanan) AS totalOrders

    FROM \"UDLestari\".customer c

    LEFT JOIN \"UDLestari\".pesanan p
    ON c.id_customer = p.id_customer

    GROUP BY 
        c.id_customer,
        c.name,
        c.username,
        c.email,
        c.nomor_telepon

    ORDER BY c.id_customer DESC
");

    $customers = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($customers);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);

}