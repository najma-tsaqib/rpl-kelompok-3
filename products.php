<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

if (!$conn) {
    echo json_encode(["error" => "Koneksi gagal"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

# =======================
# GET
# =======================
if ($method === 'GET') {

    header("Content-Type: application/json");

    $query = 'SELECT * FROM "UDLestari".produk ORDER BY id_produk DESC';
    $result = pg_query($conn, $query);

    $data = [];

    while ($row = pg_fetch_assoc($result)) {
        $row['id_produk'] = (int)$row['id_produk'];
        $row['harga'] = (int)$row['harga'];
        $row['stok'] = (int)$row['stok'];
        $row['status'] = ($row['stok'] > 0) ? "Tersedia" : "Habis";

        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

if ($method === 'POST' && isset($_POST['id_produk'])) {

    $id = (int)$_POST['id_produk'];
    $nama = pg_escape_string($conn, $_POST['nama']);
    $kategori = pg_escape_string($conn, $_POST['kategori']);
    $harga = (int)$_POST['harga'];
    $stok = (int)$_POST['stok'];

    $fotoPath = $_POST['foto_lama'] ?? "";

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {

        $file = $_FILES['foto'];
        $namaFile = time() . "_" . basename($file["name"]);
        $folder = "uploads/";

        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }

        $target = $folder . $namaFile;

        if (move_uploaded_file($file["tmp_name"], $target)) {
            $fotoPath = "http://localhost/UDLestari/uploads/" . $namaFile;
        }
    }

    $query = "
        UPDATE \"UDLestari\".produk SET
        nama_produk = '$nama',
        kategori = '$kategori',
        harga = $harga,
        stok = $stok,
        foto = '$fotoPath'
        WHERE id_produk = $id
    ";

    pg_query($conn, $query);

    echo json_encode(["message" => "Produk diupdate"]);
    exit;
}
# =======================
# POST (Tambah + Upload Gambar)
# =======================
if ($method === 'POST') {

    header("Content-Type: application/json");

    $nama = pg_escape_string($conn, $_POST['nama']);
    $kategori = pg_escape_string($conn, $_POST['kategori']);
    $harga = (int)$_POST['harga'];
    $stok = (int)$_POST['stok'];

    $fotoPath = "";

    # 🔥 HANDLE UPLOAD FILE
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {

        $file = $_FILES['foto'];

        $namaFile = time() . "_" . basename($file["name"]);
        $folder = "uploads/";

        # kalau folder belum ada → buat
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }

        $target = $folder . $namaFile;

        if (move_uploaded_file($file["tmp_name"], $target)) {
            $fotoPath = "http://localhost/UDLestari/uploads/" . $namaFile;
        }
    }

    $query = "
        INSERT INTO \"UDLestari\".produk (nama_produk, kategori, harga, stok, foto)
        VALUES ('$nama', '$kategori', $harga, $stok, '$fotoPath')
    ";

    pg_query($conn, $query);

    echo json_encode(["message" => "Produk ditambah"]);
    exit;
}

# =======================
# PUT (Edit)
# =======================
if ($method === 'PUT') {

    header("Content-Type: application/json");

    $input = json_decode(file_get_contents("php://input"), true);

    $id = (int)$input['id_produk'];
    $nama = pg_escape_string($conn, $input['nama']);
    $kategori = pg_escape_string($conn, $input['kategori']);
    $harga = (int)$input['harga'];
    $stok = (int)$input['stok'];

    # 🔥 kalau foto dikirim (edit), pakai itu
    $foto = pg_escape_string($conn, $input['foto'] ?? '');

    $query = "
        UPDATE \"UDLestari\".produk SET
        nama_produk = '$nama',
        kategori = '$kategori',
        harga = $harga,
        stok = $stok,
        foto = '$foto'
        WHERE id_produk = $id
    ";

    pg_query($conn, $query);

    echo json_encode(["message" => "Produk diupdate"]);
    exit;
}

# =======================
# DELETE
# =======================
if ($method === 'DELETE') {

    header("Content-Type: application/json");

    $input = json_decode(file_get_contents("php://input"), true);
    $id = (int)$input['id_produk'];

    pg_query($conn, "DELETE FROM \"UDLestari\".produk WHERE id_produk = $id");

    echo json_encode(["message" => "Produk dihapus"]);
    exit;
}