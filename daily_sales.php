<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=UDLestari user=postgres password=dz1234");

$month = $_GET['month'] ?? '06';
$year = $_GET['year'] ?? '2024';

$query = "
SELECT 
  EXTRACT(DAY FROM tanggal_pesanan) AS day,
  SUM(total_harga) AS value
FROM \"UDLestari\".pesanan
WHERE EXTRACT(MONTH FROM tanggal_pesanan) = '$month'
AND EXTRACT(YEAR FROM tanggal_pesanan) = '$year'
GROUP BY day
ORDER BY day
";

$result = pg_query($conn, $query);

$data = [];

while ($row = pg_fetch_assoc($result)) {
  $data[] = $row;
}

echo json_encode($data);
?>