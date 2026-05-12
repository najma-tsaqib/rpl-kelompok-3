<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

if (!$conn) {
  echo json_encode([
    "error" => "Koneksi gagal"
  ]);
  exit;
}

$id_customer =
  (int)$_GET['id_customer'];

$query = "
SELECT
  p.id_pesanan,

  TO_CHAR(
    p.tanggal_pesanan,
    'DD Mon YYYY'
  ) AS tanggal,

  STRING_AGG(
    pr.nama_produk,
    ', '
  ) AS produk,

  p.total_harga AS total,

  p.status_pesanan AS status

FROM \"UDLestari\".pesanan p

JOIN \"UDLestari\".detail_pesanan dp
ON p.id_pesanan = dp.id_pesanan

JOIN \"UDLestari\".produk pr
ON dp.id_produk = pr.id_produk

WHERE p.id_customer = $id_customer

GROUP BY
  p.id_pesanan,
  p.tanggal_pesanan,
  p.total_harga,
  p.status_pesanan

ORDER BY p.tanggal_pesanan DESC
";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {

  $row['id_pesanan'] =
    (int)$row['id_pesanan'];

  $row['total'] =
    (int)$row['total'];

  $data[] = $row;
}

echo json_encode($data);