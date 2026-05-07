<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

$month = $_GET['month'] ?? date('m');
$year = $_GET['year'] ?? date('Y');

# ================= PEMASUKAN =================
$pemasukan = pg_fetch_result(pg_query($conn, "
SELECT COALESCE(SUM(total_harga),0)
FROM \"UDLestari\".pesanan
WHERE EXTRACT(MONTH FROM tanggal_pesanan) = '$month'
AND EXTRACT(YEAR FROM tanggal_pesanan) = '$year'
"), 0, 0);

# ================= PENGELUARAN =================
# sementara contoh: ambil dari pembayaran yg status tertentu (atau nanti bikin tabel sendiri)
$pengeluaran = pg_fetch_result(pg_query($conn, "
SELECT COALESCE(SUM(total_harga),0)
FROM \"UDLestari\".pesanan
WHERE status_pesanan = 'dibatalkan'
AND EXTRACT(MONTH FROM tanggal_pesanan) = '$month'
AND EXTRACT(YEAR FROM tanggal_pesanan) = '$year'
"), 0, 0);

# ================= LABA =================
$laba = $pemasukan - $pengeluaran;

# ================= SALDO =================
$saldo = pg_fetch_result(pg_query($conn, "
SELECT COALESCE(SUM(total_harga),0)
FROM \"UDLestari\".pesanan
"), 0, 0);

echo json_encode([
  "pemasukan" => (int)$pemasukan,
  "pengeluaran" => (int)$pengeluaran,
  "laba" => (int)$laba,
  "saldo" => (int)$saldo
]);