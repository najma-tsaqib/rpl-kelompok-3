<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

if (!$conn) {
    echo json_encode(["error" => "Koneksi gagal"]);
    exit;
}

# 🔥 HANDLE UPDATE STATUS
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode(["error" => "Input kosong"]);
        exit;
    }

    $id = (int)$input['id_pesanan'];
    $status = pg_escape_string($conn, $input['status']);

    $query = "UPDATE \"UDLestari\".pesanan 
              SET status_pesanan = '$status' 
              WHERE id_pesanan = $id";

    $result = pg_query($conn, $query);

    if ($result) {
        echo json_encode(["message" => "success"]);
    } else {
        echo json_encode(["error" => pg_last_error($conn)]);
    }

    exit; // 🔥 WAJIB
}

# 🔥 GET DATA
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // 🔥 FILTER (HARUS DI ATAS QUERY)
    $filter = "";

    if (isset($_GET['month']) && isset($_GET['year'])) {
        $month = $_GET['month'];
        $year = $_GET['year'];

        $filter = "WHERE EXTRACT(MONTH FROM p.tanggal_pesanan) = '$month'
                   AND EXTRACT(YEAR FROM p.tanggal_pesanan) = '$year'";
    }

    // 🔥 QUERY
    $query = "
    SELECT 
      p.id_pesanan,
      c.username AS nama_pelanggan,
      TO_CHAR(p.tanggal_pesanan, 'DD Mon YYYY') AS tanggal,
      STRING_AGG(pr.nama_produk, ', ') AS produk,
      SUM(dp.jumlah) AS qty,
      p.total_harga AS total,
      pay.status_pembayaran AS pembayaran,
      p.status_pesanan AS status
    FROM \"UDLestari\".pesanan p
    JOIN \"UDLestari\".customer c ON p.id_customer = c.id_customer
    JOIN \"UDLestari\".detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
    JOIN \"UDLestari\".produk pr ON dp.id_produk = pr.id_produk
    LEFT JOIN \"UDLestari\".pembayaran pay ON p.id_pesanan = pay.id_pesanan
    $filter
    GROUP BY 
      p.id_pesanan,
      c.username,
      p.tanggal_pesanan,
      p.total_harga,
      pay.status_pembayaran,
      p.status_pesanan
    ORDER BY p.tanggal_pesanan DESC
    ";

    $result = pg_query($conn, $query);

    if (!$result) {
        echo json_encode(["error" => pg_last_error($conn)]);
        exit;
    }

    $data = [];

    while ($row = pg_fetch_assoc($result)) {
        $row['id_pesanan'] = (int)$row['id_pesanan'];
        $row['total'] = (int)$row['total'];
        $data[] = $row;
    }

    echo json_encode($data);
}