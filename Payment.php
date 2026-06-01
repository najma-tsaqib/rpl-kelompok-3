<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

if (!$conn) {
    echo json_encode(["error" => "Koneksi gagal"]);
    exit;
}

/* UPDATE STATUS */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    $id = (int)$input['id_pembayaran'];
    $status = pg_escape_string($conn, $input['status']);

    $query = "
    UPDATE \"UDLestari\".pembayaran
    SET status_pembayaran = '$status'
    WHERE id_pembayaran = $id
    ";

    pg_query($conn, $query);

    if ($status === "Tidak Valid") {

    $getOrder = pg_query($conn, "
        SELECT id_pesanan
        FROM \"UDLestari\".pembayaran
        WHERE id_pembayaran = $id
    ");

    $order = pg_fetch_assoc($getOrder);

    $id_pesanan = (int)$order['id_pesanan'];

    pg_query($conn, "
        UPDATE \"UDLestari\".pesanan
        SET status_pesanan = 'Ditolak'
        WHERE id_pesanan = $id_pesanan
    ");
}

    echo json_encode([
        "message" => "success"
    ]);

    exit;
}

/* GET DATA */
$query = "
SELECT
  pay.id_pembayaran,
  p.id_pesanan,
  c.username AS customer,
  pay.metode_pembayaran AS method,
  p.total_harga AS amount,
  pay.bukti_transfer,

  TO_CHAR(
    p.tanggal_pesanan,
    'DD Mon YYYY'
  ) AS date,

  pay.status_pembayaran AS status

FROM \"UDLestari\".pembayaran pay

JOIN \"UDLestari\".pesanan p
ON pay.id_pesanan = p.id_pesanan

JOIN \"UDLestari\".customer c
ON p.id_customer = c.id_customer

ORDER BY pay.id_pembayaran DESC
";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {

    $row['id_pembayaran'] =
      (int)$row['id_pembayaran'];

    $row['amount'] =
      (int)$row['amount'];

    $data[] = $row;
}

echo json_encode($data);