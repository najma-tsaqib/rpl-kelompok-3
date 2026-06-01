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

pg_query($conn, 'SET search_path TO "UDLestari"');

/* =========================
   TOTAL PESANAN
========================= */

$totalOrders = pg_fetch_result(
  pg_query($conn, "
    SELECT COUNT(*)
    FROM pesanan
  "),
  0,
  0
);

$todayOrders = pg_fetch_result(
  pg_query($conn, "
    SELECT COUNT(*)
    FROM pesanan
    WHERE tanggal_pesanan::date = CURRENT_DATE
  "),
  0,
  0
);

$yesterdayOrders = pg_fetch_result(
  pg_query($conn, "
    SELECT COUNT(*)
    FROM pesanan
    WHERE tanggal_pesanan::date =
          CURRENT_DATE - INTERVAL '1 day'
  "),
  0,
  0
);

$ordersPercent = 0;

if ($yesterdayOrders > 0) {

  $ordersPercent = round(
    (($todayOrders - $yesterdayOrders)
    / $yesterdayOrders) * 100
  );

}

/* =========================
   TOTAL CUSTOMER
========================= */

$totalCustomers = pg_fetch_result(
  pg_query($conn, "
    SELECT COUNT(*)
    FROM customer
  "),
  0,
  0
);

/* sementara */
$newCustomers = 0;

/* =========================
   TOTAL STOK
========================= */

$totalStock = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(stok),0)
    FROM produk
  "),
  0,
  0
);

/* =========================
   PENDAPATAN KEMARIN
========================= */

$yesterdayIncome = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(total_harga),0)
    FROM pesanan
    WHERE tanggal_pesanan::date =
          CURRENT_DATE - INTERVAL '1 day'
    AND status_pesanan = 'Dikonfirmasi'
  "),
  0,
  0
);

/* =========================
   PENDAPATAN HARI INI
========================= */

$totalIncome = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(total_harga),0)
    FROM pesanan
    WHERE tanggal_pesanan::date = CURRENT_DATE
    AND status_pesanan = 'Dikonfirmasi'
  "),
  0,
  0
);

$incomePercent = 0;

if ($yesterdayIncome > 0) {

  $incomePercent = round(
    (($totalIncome - $yesterdayIncome)
    / $yesterdayIncome) * 100
  );

}

/* =========================
   RESPONSE
========================= */

echo json_encode([

  "orders" => (int)$totalOrders,
  "orders_percent" => $ordersPercent,

  "customers" => (int)$totalCustomers,
  "new_customers" => $newCustomers,

  "stock" => (int)$totalStock,

  "income" => (int)$totalIncome,
  "income_percent" => $incomePercent

]);