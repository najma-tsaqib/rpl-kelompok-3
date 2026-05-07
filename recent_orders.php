<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

if (!$conn) {
    echo json_encode(["error" => "Koneksi gagal"]);
    exit;
}

# 🔥 penting biar ga perlu nulis schema terus
pg_query($conn, 'SET search_path TO "UDLestari"');

$query = "
SELECT 
  p.id_pesanan,
  c.username AS nama_pelanggan,
  pr.nama_produk AS produk,
  p.total_harga AS total,
  p.status_pesanan AS status
FROM pesanan p
JOIN customer c ON p.id_customer = c.id_customer
JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
JOIN produk pr ON dp.id_produk = pr.id_produk
ORDER BY p.tanggal_pesanan DESC
LIMIT 5
";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {
  $data[] = [
    "id" => "#ORD-" . str_pad($row['id_pesanan'], 4, "0", STR_PAD_LEFT),
    "customer" => $row['nama_pelanggan'],
    "product" => $row['produk'],
    "total" => "Rp" . number_format($row['total'], 0, ',', '.'),
    "status" => $row['status']
  ];
}

echo json_encode($data);