import React, { useEffect, useState } from 'react';
import '../styles/FinancialReport.css';

export default function FinancialReport() {

  /* ================= STATE ================= */
  const [financialHistory, setFinancialHistory] = useState([]);
  const [summary, setSummary] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    laba: 0,
    saldo: 0
  });

  /* ================= FETCH TABLE ================= */
  useEffect(() => {
    fetch("http://localhost/UDLestari/orders.php")
    .then(res => res.json())
    .then(data => {

      let saldo = 0;

      const formatted = data.map(item => {

        const jumlah = Number(item.total);
        const tipe = "Pemasukan";

        saldo += jumlah;

        return {
          date: item.tanggal,
          type: `Penjualan Ayam #ORD-${String(item.id_pesanan).padStart(4, '0')}`,
          category: tipe,
          amount: `+Rp${jumlah.toLocaleString('id-ID')}`,
          balance: `Rp${saldo.toLocaleString('id-ID')}`
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
    fetch("http://localhost/UDLestari/summary.php?month=06&year=2024")
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
        <h1 className="page-title">Laporan Penjualan</h1>
        <p className="page-subtitle">Ringkasan penjualan harian</p>
      </div>

      <div className="financial-stats-grid">

  <div className="financial-stat-card">
    <div className="stat-header">
      <span className="stat-icon">📈</span>
      <span className="stat-label">Pemasukan Bulan Ini</span>
    </div>
    <div className="stat-value">
      {formatRupiah(summary.pemasukan)}
    </div>
  </div>

    <div className="financial-stat-card">
  <div className="stat-header">
    <span className="stat-icon">📉</span>
    <span className="stat-label">Pengeluaran</span>
  </div>
  <div className="stat-value">
    {formatRupiah(summary.pengeluaran)}
  </div>
</div>

<div className="financial-stat-card">
  <div className="stat-header">
    <span className="stat-icon">⚖️</span>
    <span className="stat-label">Laba Bersih</span>
  </div>
  <div className="stat-value">
    {formatRupiah(summary.laba)}
  </div>
</div>

<div className="financial-stat-card">
  <div className="stat-header">
    <span className="stat-icon">🐷</span>
    <span className="stat-label">Total Saldo</span>
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
          <button className="btn btn-secondary">Export</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>KETERANGAN</th>
                <th>TIPE</th>
                <th>JUMLAH</th>
                <th>SALDO</th>
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

                  <td className="balance">{item.balance}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}