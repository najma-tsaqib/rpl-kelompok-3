<?php

require 'vendor/autoload.php';

use Dompdf\Dompdf;

$conn = pg_connect(
  "host=localhost dbname=UDLestari user=postgres password=dz1234"
);

if (!$conn) {
  die("Koneksi gagal");
}

$month = date('m');
$year = date('Y');

/* =========================
   SUMMARY
========================= */

$pemasukan = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(total_harga),0)
    FROM \"UDLestari\".pesanan
    WHERE status_pesanan IN ('Dikonfirmasi','Selesai')
    AND EXTRACT(MONTH FROM tanggal_pesanan) = '$month'
    AND EXTRACT(YEAR FROM tanggal_pesanan) = '$year'
  "),
  0,
  0
);

$saldo = pg_fetch_result(
  pg_query($conn, "
    SELECT COALESCE(SUM(total_harga),0)
    FROM \"UDLestari\".pesanan
    WHERE status_pesanan IN ('Dikonfirmasi','Selesai')
  "),
  0,
  0
);

/* =========================
   TRANSAKSI
========================= */

$orders = pg_query($conn, "
SELECT
  p.id_pesanan,
  TO_CHAR(
    p.tanggal_pesanan,
    'DD Mon YYYY'
  ) AS tanggal,
  p.total_harga AS total
FROM \"UDLestari\".pesanan p
WHERE p.status_pesanan IN ('Dikonfirmasi','Selesai')
ORDER BY p.tanggal_pesanan DESC
");

$html = "

<h1 style='text-align:center;color:#2563eb'>
UD LESTARI
</h1>

<h2 style='text-align:center'>
LAPORAN KEUANGAN
</h2>

<p style='text-align:center'>
Periode " . date('F Y') . "
</p>

<hr>

<table width='100%' cellpadding='10'>

<tr>

<td>
<b>Pemasukan Bulan Ini</b><br>
Rp " . number_format($pemasukan,0,',','.') . "
</td>

<td>
<b>Laba Bersih</b><br>
Rp " . number_format($pemasukan,0,',','.') . "
</td>

<td>
<b>Total Pendapatan</b><br>
Rp " . number_format($saldo,0,',','.') . "
</td>

</tr>

</table>

<br><br>

<h3>Rincian Transaksi</h3>

<table
border='1'
width='100%'
cellspacing='0'
cellpadding='6'
>

<tr>
<th>Tanggal</th>
<th>Keterangan</th>
<th>Tipe</th>
<th>Jumlah</th>
</tr>
";

while ($row = pg_fetch_assoc($orders)) {

  $html .= "

  <tr>

    <td>{$row['tanggal']}</td>

    <td>
      Penjualan Ayam #ORD-" .
      str_pad(
        $row['id_pesanan'],
        4,
        '0',
        STR_PAD_LEFT
      ) . "
    </td>

    <td>Pemasukan</td>

    <td>
      Rp " .
      number_format(
        $row['total'],
        0,
        ',',
        '.'
      ) . "
    </td>

  </tr>

  ";
}

$html .= "
</table>

<br><br>

<p style='text-align:right'>
Dicetak pada: " . date('d/m/Y H:i') . "
</p>
";

$dompdf = new Dompdf();

$dompdf->loadHtml($html);

$dompdf->setPaper(
  'A4',
  'portrait'
);

$dompdf->render();

$dompdf->stream(
  'Laporan_Keuangan.pdf',
  ['Attachment' => true]
);