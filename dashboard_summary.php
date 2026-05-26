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

/* 🔥 PENTING */
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
   TOTAL PENDAPATAN
========================= */

$totalIncome = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(total_harga),0)
    FROM pesanan
  "),
  0,
  0
);

/* =========================
   RESPONSE
========================= */

echo json_encode([

  "orders" =>
    (int)$totalOrders,

  "customers" =>
    (int)$totalCustomers,

  "stock" =>
    (int)$totalStock,

  "income" =>
    (int)$totalIncome

]);