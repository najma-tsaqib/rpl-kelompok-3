<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

$query = "

SELECT
  p.nama_produk,
  p.foto,
  SUM(dp.jumlah) as total_terjual

FROM \"UDLestari\".detail_pesanan dp

JOIN \"UDLestari\".produk p
ON dp.id_produk = p.id_produk

GROUP BY p.nama_produk, p.foto

ORDER BY total_terjual DESC

LIMIT 5

";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {

  $data[] = [
    "name" => $row['nama_produk'],
    "foto" => $row['foto'],
    "total" => (int)$row['total_terjual']
  ];
}

echo json_encode($data);