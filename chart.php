<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

$year = $_GET['year'] ?? '2026';

$query = "
SELECT 
  TO_CHAR(tanggal_pesanan, 'Mon') AS month,
  SUM(total_harga) AS value
FROM \"UDLestari\".pesanan
WHERE EXTRACT(YEAR FROM tanggal_pesanan) = '$year'
GROUP BY month, EXTRACT(MONTH FROM tanggal_pesanan)
ORDER BY EXTRACT(MONTH FROM tanggal_pesanan)
";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {
  $data[] = $row;
}

echo json_encode($data);
?>