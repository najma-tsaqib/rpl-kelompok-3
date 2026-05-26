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
$total = 0;

$id_customer =
  (int)$data['id_customer'];

$metode =
  $data['metode_pembayaran'];

$metode_pengiriman =
  $data['metode_pengiriman'];

/* INSERT PESANAN */
$query = "

INSERT INTO \"UDLestari\".pesanan

(
  id_customer,
  tanggal_pesanan,
  total_harga,
  status_pesanan,
  metode_pengiriman
)

VALUES

(
  $id_customer,
  NOW(),
  $total,
  'Pending',
  '$metode_pengiriman'
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

  /* AMBIL HARGA ASLI PRODUK */
$getProduk = pg_query($conn, "

  SELECT harga, stok
  FROM \"UDLestari\".produk
  WHERE id_produk = $id_produk

  ");

  $produk =
    pg_fetch_assoc($getProduk);

  $hargaAsli =
    (int)$produk['harga'];

  $stokSekarang =
    (int)$produk['stok'];

$subtotal =
  $hargaAsli * $qty;

$total += $subtotal;

if ($stokSekarang < $qty) {

  echo json_encode([
    "success" => false,
    "message" => "Stok tidak cukup"
  ]);

  exit;

}

  /* INSERT DETAIL */
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

  /* UPDATE STOK */
  pg_query($conn, "

    UPDATE \"UDLestari\".produk

    SET stok = stok - $qty

    WHERE id_produk = $id_produk

  ");

}

pg_query($conn, "

  UPDATE \"UDLestari\".pesanan

  SET total_harga = $total

  WHERE id_pesanan = $id_pesanan

");

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