<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

if (!$conn) {
  echo json_encode([
    "error" => "Koneksi gagal"
  ]);
  exit;
}

/* POST */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $id_pembayaran =
    (int)$_POST['id_pembayaran'];

  if (!isset($_FILES['file'])) {

    echo json_encode([
      "error" => "File tidak ada"
    ]);

    exit;
  }

  $file = $_FILES['file'];

  $namaFile =
    time() . "_" . basename($file['name']);

  $folder = "buktitf/";

  /* kalau folder belum ada */
  if (!file_exists($folder)) {

    mkdir($folder, 0777, true);
  }

  $target = $folder . $namaFile;

  /* upload */
  if (
    move_uploaded_file(
      $file['tmp_name'],
      $target
    )
  ) {

    $query = "
      UPDATE \"UDLestari\".pembayaran

      SET bukti_transfer = '$target'

      WHERE id_pembayaran = $id_pembayaran
    ";

    pg_query($conn, $query);

    echo json_encode([
      "message" => "Upload berhasil",
      "path" => $target
    ]);

  } else {

    echo json_encode([
      "error" => "Upload gagal"
    ]);
  }
}