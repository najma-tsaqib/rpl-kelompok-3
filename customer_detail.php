<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

if (!$conn) {
  echo json_encode(["error" => "Koneksi gagal"]);
  exit;
}

$id_customer = (int)$_GET['id_customer'];

$query = "
SELECT
  c.id_customer,
  c.name,
  c.username,
  c.email,
  c.nomor_telepon,

  COUNT(p.id_pesanan) AS total_pesanan,

  COALESCE(SUM(p.total_harga), 0) AS total_belanja,

  MAX(p.tanggal_pesanan) AS pesanan_terakhir

FROM \"UDLestari\".customer c

LEFT JOIN \"UDLestari\".pesanan p
ON c.id_customer = p.id_customer

WHERE c.id_customer = $id_customer

GROUP BY c.id_customer
";

$result = pg_query($conn, $query);

$data = pg_fetch_assoc($result);

echo json_encode($data);