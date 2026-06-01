<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

$month = $_GET['month'] ?? date('m');
$year = $_GET['year'] ?? date('Y');

$query = "
SELECT
  p.id_pesanan,
  TO_CHAR(p.tanggal_pesanan, 'DD Mon YYYY') AS tanggal,
  c.username AS nama_pelanggan,
  STRING_AGG(pr.nama_produk, ', ') AS produk,
  SUM(dp.jumlah) AS qty,
  p.total_harga AS total
FROM \"UDLestari\".pesanan p
JOIN \"UDLestari\".customer c
ON p.id_customer = c.id_customer
JOIN \"UDLestari\".detail_pesanan dp
ON p.id_pesanan = dp.id_pesanan
JOIN \"UDLestari\".produk pr
ON dp.id_produk = pr.id_produk
WHERE p.status_pesanan IN ('Dikonfirmasi','Selesai')
AND EXTRACT(MONTH FROM p.tanggal_pesanan) = '$month'
AND EXTRACT(YEAR FROM p.tanggal_pesanan) = '$year'
GROUP BY
  p.id_pesanan,
  p.tanggal_pesanan,
  c.username,
  p.total_harga
ORDER BY p.tanggal_pesanan DESC
";

$result = pg_query($conn, $query);

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

$sheet->mergeCells('A1:F1');
$sheet->setCellValue(
  'A1',
  'LAPORAN PENJUALAN UD LESTARI'
);

$sheet->mergeCells('A2:F2');
$sheet->setCellValue(
  'A2',
  "Periode : $month/$year"
);

$sheet->getStyle('A1')->getFont()
      ->setBold(true)
      ->setSize(18);

$sheet->getStyle('A2')->getFont()
      ->setItalic(true);

$sheet->getStyle('A1:A2')
      ->getAlignment()
      ->setHorizontal(
        \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
      );

$sheet->setCellValue('A4', 'Tanggal');
$sheet->setCellValue('B4', 'No Pesanan');
$sheet->setCellValue('C4', 'Pelanggan');
$sheet->setCellValue('D4', 'Produk');
$sheet->setCellValue('E4', 'Qty');
$sheet->setCellValue('F4', 'Total');

$sheet->getStyle('A4:F4')->getFont()
      ->setBold(true);

$sheet->getStyle('A4:F4')
      ->getFill()
      ->setFillType(
        \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID
      )
      ->getStartColor()
      ->setARGB('D9EAF7');

$rowNum = 5;

while ($row = pg_fetch_assoc($result)) {

  $sheet->setCellValue(
    'A' . $rowNum,
    $row['tanggal']
  );

  $sheet->setCellValue(
    'B' . $rowNum,
    'ORD-' . str_pad(
      $row['id_pesanan'],
      4,
      '0',
      STR_PAD_LEFT
    )
  );

  $sheet->setCellValue(
    'C' . $rowNum,
    $row['nama_pelanggan']
  );

  $sheet->setCellValue(
    'D' . $rowNum,
    $row['produk']
  );

  $sheet->setCellValue(
    'E' . $rowNum,
    $row['qty']
  );

  $sheet->setCellValue(
    'F' . $rowNum,
    $row['total']
  );

  $rowNum++;
}

$lastRow = $rowNum - 1;

$sheet->setCellValue(
  'E' . ($lastRow + 2),
  'TOTAL'
);

$sheet->setCellValue(
  'F' . ($lastRow + 2),
  "=SUM(F5:F$lastRow)"
);

$sheet->getStyle(
  'E' . ($lastRow + 2) .
  ':F' . ($lastRow + 2)
)->getFont()->setBold(true);

foreach (range('A', 'F') as $col) {
  $sheet->getColumnDimension($col)
        ->setAutoSize(true);
}

header(
  'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
);

header(
  'Content-Disposition: attachment;filename="Laporan_Penjualan.xlsx"'
);

header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');

exit;