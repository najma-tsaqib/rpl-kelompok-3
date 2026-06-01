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

$month = (int)($_GET['month'] ?? date('m'));

$year = (int)($_GET['year'] ?? date('Y'));

# ===============================
# BULAN SEKARANG
# ===============================

$currentQuery = "

SELECT

  COALESCE(
    SUM(p.total_harga),
    0
  ) AS pemasukan,

  COUNT(DISTINCT p.id_pesanan)
  AS pesanan,

  COALESCE(
    SUM(dp.jumlah),
    0
  ) AS produk

FROM \"UDLestari\".pesanan p

JOIN \"UDLestari\".detail_pesanan dp
ON p.id_pesanan = dp.id_pesanan

WHERE EXTRACT(MONTH FROM p.tanggal_pesanan) = '$month'

AND EXTRACT(YEAR FROM p.tanggal_pesanan) = '$year'

AND p.status_pesanan = 'Dikonfirmasi'

";

$currentResult = pg_query($conn, $currentQuery);

$currentData = pg_fetch_assoc($currentResult);

$currentPemasukan =
(int)$currentData['pemasukan'];

$currentPesanan =
(int)$currentData['pesanan'];

$currentProduk =
(int)$currentData['produk'];

# ===============================
# BULAN SEBELUMNYA
# ===============================

$prevMonth = $month - 1;
$prevYear = $year;

if ($prevMonth <= 0) {

  $prevMonth = 12;
  $prevYear = $year - 1;
}

$prevQuery = "

SELECT

  COALESCE(
    SUM(p.total_harga),
    0
  ) AS pemasukan,

  COUNT(DISTINCT p.id_pesanan)
  AS pesanan,

  COALESCE(
    SUM(dp.jumlah),
    0
  ) AS produk

FROM \"UDLestari\".pesanan p

JOIN \"UDLestari\".detail_pesanan dp
ON p.id_pesanan = dp.id_pesanan

WHERE EXTRACT(MONTH FROM p.tanggal_pesanan) = '$prevMonth'

AND EXTRACT(YEAR FROM p.tanggal_pesanan) = '$prevYear'
AND p.status_pesanan = 'Dikonfirmasi'
";

$prevResult = pg_query($conn, $prevQuery);

$prevData = pg_fetch_assoc($prevResult);

$prevPemasukan =
(int)$prevData['pemasukan'];

$prevPesanan =
(int)$prevData['pesanan'];

$prevProduk =
(int)$prevData['produk'];

# ===============================
# HITUNG PERSENTASE
# ===============================

function calculatePercent($current, $previous) {

  if ($previous == 0) {
    return 100;
  }

  return round(
    (($current - $previous) / $previous) * 100
  );
}

echo json_encode([

  "pemasukan" =>
    $currentPemasukan,

  "pesanan" =>
    $currentPesanan,

  "produk" =>
    $currentProduk,

  "pemasukan_percent" =>
    calculatePercent(
      $currentPemasukan,
      $prevPemasukan
    ),

  "pesanan_percent" =>
    calculatePercent(
      $currentPesanan,
      $prevPesanan
    ),

  "produk_percent" =>
    calculatePercent(
      $currentProduk,
      $prevProduk
    )

]);