import React, { useState, useEffect } from 'react';
import '../styles/SalesReport.css';

export default function SalesReport() {
  const monthMap = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07"
};

  const currentYear = new Date().getFullYear(); // 🔥 TAHUN OTOMATIS

  const currentMonthIndex = new Date().getMonth(); // 🔥 BULAN SEKARANG

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni","Juli"
  ];

  const availableMonths = months.slice(0, currentMonthIndex + 1);
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[availableMonths.length - 1]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);


useEffect(() => {

fetch(`http://203.194.115.52daily_sales.php?month=${monthMap[selectedMonth]}&year=${currentYear}`)
  .then(res => res.json())
  .then(data => {

    // 🔥 CEK DATA KOSONG
    if (data.length === 0) {
      console.log("Data kosong bulan ini");
      setChartData([]);
      return;
    }

    const fixed = data.map(item => ({
      day: item.day,
      value: Number(item.value)
    }));

    setChartData(fixed);
  });

}, [selectedMonth]);

  const [summary, setSummary] = useState({
    pemasukan: 0,
    pesanan: 0,
    produk: 0
  });

const stats = [
  {
    label: 'Total Pendapatan Bulan Ini',
    value: `Rp${(summary.pemasukan / 1000000).toFixed(1)}jt`,
    change: `${summary.pemasukan_percent || 0}%`,
    subtitle: 'dari bulan lalu'
  },
  {
    label: 'Total Produk Terjual',
    value: summary.produk,
    change: `${summary.produk_percent || 0}%`,
    subtitle: 'dari bulan lalu'
  },
  {
    label: 'Total Pesanan Bulan Ini',
    value: `${summary.pesanan} kg`,
    change: `${summary.pesanan_percent || 0}%`,
    subtitle: 'dari bulan lalu'
  }
];

useEffect(() => {

  fetch(
    `http://203.194.115.52sales_summary.php?month=${monthMap[selectedMonth]}&year=${currentYear}`
  )
    .then(res => res.json())
    .then(data => {

      setSummary(data);

    });

}, [selectedMonth]);

useEffect(() => {
  fetch(`http://203.194.115.52orders.php?month=${monthMap[selectedMonth]}&year=${currentYear}`)
    .then(res => res.json())
    .then(data => setTransactions(data));
}, [selectedMonth]);


const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="sales-report-page">
      <div className="page-header">
        <h1 className="page-title">Laporan Penjualan</h1>
        <p className="page-subtitle">Lihat laporan penjualan lengkap dan analitik bisnis</p>
      </div>

      {/* Stats Cards */}
      <div className="sales-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="sales-stat-card">
            <div className="sales-stat-label">{stat.label}</div>
            <div className="sales-stat-value">{stat.value}</div>
            <div className="sales-stat-change positive">
              ↑ {stat.change}
              <span className="change-text">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="card chart-container">
        <div className="card-header">
          <h2 className="card-title">
            📈 Grafik Penjualan Harian ({selectedMonth} {currentYear})
          </h2>
          <div className="header-controls">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              className="btn btn-secondary"
              onClick={() =>
                window.open(
                  `http://203.194.115.52export_excel.php?month=${monthMap[selectedMonth]}&year=${currentYear}`
                )
              }
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="chart-bars">
            {chartData.length === 0 && (
            <p style={{ textAlign: "center" }}>
              Tidak ada data di bulan ini
            </p>
          )}
          {chartData.map((data, idx) => (
            <div key={idx} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  
                  style={{ height: `${(data.value / maxValue) * 150}px` }}
                  title={`Rp${(data.value / 1000).toFixed(0)}k`}
                ></div>
              </div>
              <span className="chart-label">
                {selectedMonth.slice(0,3)} {data.day}
              </span>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <span className="legend-item">Nilai penjualan (Rp)</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Rincian Transaksi</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>NO. PESANAN</th>
                <th>PELANGGAN</th>
                <th>PRODUK</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx}>
                  <td>{tx.tanggal}</td>
                  <td className="order-id">
                    #ORD-{String(tx.id_pesanan).padStart(4, '0')}
                  </td>
                  <td>{tx.nama_pelanggan}</td>
                  <td>{tx.produk}</td>
                  <td>{tx.qty} kg</td>
                  <td className="amount">
                    Rp{Number(tx.total).toLocaleString('id-ID')}
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