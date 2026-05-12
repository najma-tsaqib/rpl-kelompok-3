<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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

$data =
  json_decode(
    file_get_contents("php://input"),
    true
  );

$cart = $data['cart'];
$total = (int)$data['total'];

$id_customer =
  (int)$data['id_customer'];

$metode =
  $data['metode_pembayaran'];

/* INSERT PESANAN */
$query = "

INSERT INTO \"UDLestari\".pesanan

(
  id_customer,
  tanggal_pesanan,
  total_harga,
  status_pesanan
)

VALUES

(
  $id_customer,
  NOW(),
  $total,
  'Pending'
)

RETURNING id_pesanan

";

$result = pg_query($conn, $query);

$row = pg_fetch_assoc($result);

$id_pesanan = $row['id_pesanan'];

/* DETAIL PESANAN */
foreach ($cart as $item) {

  $id_produk =
    (int)$item['id_produk'];

  $qty =
    (int)$item['qty'];

  $subtotal =
    $item['harga'] * $qty;

  pg_query($conn, "

    INSERT INTO \"UDLestari\".detail_pesanan

    (
      id_pesanan,
      id_produk,
      jumlah,
      subtotal
    )

    VALUES

    (
      $id_pesanan,
      $id_produk,
      $qty,
      $subtotal
    )

  ");
}

/* PEMBAYARAN */
$payment = pg_query($conn, "

  INSERT INTO \"UDLestari\".pembayaran

  (
    id_pesanan,
    metode_pembayaran,
    status_pembayaran
  )

  VALUES

  (
    $id_pesanan,
    '$metode',
    'Belum Diverifikasi'
  )

  RETURNING id_pembayaran

");

$paymentRow =
  pg_fetch_assoc($payment);

$id_pembayaran =
  $paymentRow['id_pembayaran'];

echo json_encode([

  "success" => true,

  "id_pesanan" =>
    $id_pesanan,

  "id_pembayaran" =>
    $id_pembayaran,

  "total" =>
    $total

]);