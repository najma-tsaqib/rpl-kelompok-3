import React, { useEffect, useState } from 'react';
import '../styles/FinancialReport.css';

export default function FinancialReport() {

  const currentYear = new Date().getFullYear();

  const currentMonth = String(
    new Date().getMonth() + 1
  ).padStart(2, '0');
  /* ================= STATE ================= */
  const [financialHistory, setFinancialHistory] = useState([]);
  const [summary, setSummary] = useState({
    pemasukan: 0,
    laba: 0,
    saldo: 0
  });

  /* ================= FETCH TABLE ================= */
  useEffect(() => {
    fetch("http://203.194.115.52/orders.php")
    .then(res => res.json())
    .then(data => {
      let totalSaldo = data.reduce(
  (sum, item) => sum + Number(item.total),
  0
);

const formatted = data.map(item => {

  const jumlah = Number(item.total);

  const currentSaldo = totalSaldo;

  totalSaldo -= jumlah;

  return {
    date: item.tanggal,

    type:
      `Penjualan Ayam #ORD-${String(item.id_pesanan).padStart(4, '0')}`,

    category: "Pemasukan",

    amount:
      `+Rp${jumlah.toLocaleString('id-ID')}`,

    balance:
      `Rp${currentSaldo.toLocaleString('id-ID')}`
  };
});

      setFinancialHistory(formatted);
    });
  }, []);


  /* ================= HELPER ================= */
  const getCategoryBadgeClass = (category) => {
    return category === 'Pemasukan' ? 'badge-success' : 'badge-danger';
  };

  

  /* ================= FETCH SUMMARY ================= */
  useEffect(() => {
    fetch(
  `http://203.194.115.52/summary.php?month=${currentMonth}&year=${currentYear}`
)
      .then(res => res.json())
      .then(data => setSummary(data));
  }, []);

  /* =================Rupiah Helper ==================== */
  const formatRupiah = (num) => {
  return "Rp" + Number(num).toLocaleString("id-ID");
};

  /* ================= UI ================= */
  return (
    <div className="financial-report-page">

      <div className="page-header">
        <h1 className="page-title">Laporan Keuangan</h1>
        <p className="page-subtitle">Ringkasan penjualan harian</p>
      </div>

      <div className="financial-stats-grid">

  <div className="financial-stat-card">
    <div className="stat-header">
      <span className="stat-label">Pemasukan Bulan Ini</span>
    </div>
    <div className="stat-value">
      {formatRupiah(summary.pemasukan)}
    </div>
  </div>

<div className="financial-stat-card">
  <div className="stat-header">
    <span className="stat-label">Laba Bersih</span>
  </div>
  <div className="stat-value">
    {summary.laba === null
      ? "-"
      : formatRupiah(summary.laba)}
  </div>
</div>

<div className="financial-stat-card">
  <div className="stat-header">
    <span className="stat-label">Total Pendapatan</span>
  </div>
  <div className="stat-value">
    {formatRupiah(summary.saldo)}
  </div>
</div>

</div>

      {/* ================= TABLE ================= */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Rincian Transaksi</h2>
          <button
            className="btn btn-secondary"
            onClick={() =>
              window.open(
                "http://203.194.115.52/export_pdf.php"
              )
            }
          >
            Export PDF
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>KETERANGAN</th>
                <th>TIPE</th>
                <th>JUMLAH</th>
              </tr>
            </thead>

            <tbody>
              {financialHistory.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.type}</td>

                  <td>
                    <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                  </td>

                  <td className={`amount ${item.category?.toLowerCase()}`}>
                    {item.amount}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}