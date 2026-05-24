import { useEffect, useState } from "react";

import '../styles/Dashboard.css';


export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("2026")

  const [chartData, setChartData] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeDetail = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetch(`http://localhost/UDLestari/chart.php?year=${selectedYear}`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA DARI BACKEND:", data);// 🔥 WAJIB
        const fixedData = data.map(item => ({
          ...item,
          value: Number(item.value)
        }));
        setChartData(fixedData);
      });
  }, [selectedYear]);

  const stats = [
    {
      label: 'Total Pesanan',
      value: '48',
      change: '+12%',
      changeType: 'positive',
      changeText: 'dari kemarin',
      icon: '📦'
    },
    {
      label: 'Stok Tersisa',
      value: '324 kg',
      change: '-5%',
      changeType: 'negative',
      changeText: 'dari minggu lalu',
      icon: '📊'
    },
    {
      label: 'Total Pelanggan',
      value: '156',
      change: '+3 baru',
      changeType: 'positive',
      changeText: 'hari ini',
      icon: '👥'
    },
    {
      label: 'Pendapatan Hari Ini',
      value: 'Rp2,4jt',
      change: '+8%',
      changeType: 'positive',
      changeText: 'dari kemarin',
      icon: '💰'
    }
  ];

  const topProducts = [
    { name: 'Ayam 1 Ekor', emoji: '🐔', percentage: 85 },
    { name: 'Daging Ayam', emoji: '🍖', percentage: 70 },
    { name: 'Ceker Ayam', emoji: '🦶', percentage: 55 },
    { name: 'Tulang Ayam', emoji: '🦴', percentage: 40 }
  ];

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
  fetch("http://localhost/UDLestari/recent_orders.php")
    .then(res => res.json())
    .then(data => setRecentOrders(data));
}, []);

  const getStatusBadgeClass = (status) => {
    if (status === 'Pending') return 'badge-warning';
    if (status === 'Dikonfirmasi') return 'badge-info';
    if (status === 'Selesai') return 'badge-success';
    return 'badge-danger';
  };

  const maxValue = Math.max(...chartData.map(d => Number(d.value)));

  const maxIndex = chartData.reduce(
    (maxIdx, item, i, arr) =>
      Number(item.value) > Number(arr[maxIdx].value) ? i : maxIdx,
    0
  );

  console.log("MAX INDEX:", maxIndex);

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Selamat datang, Admin! Berikut ringkasan aktivitas toko hari ini.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.changeType}`}>
              ↑ {stat.change} <span className="change-text">{stat.changeText}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Chart Section */}
        <div className="card chart-container">
          <div className="chart-header">
  <div className="chart-title">
    📊 <span>Grafik Penjualan Bulanan</span>
        </div>

        <select
          className="chart-year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>
          <div className="chart-bars">
            {chartData.map((data, idx) => (
              <div key={idx} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className={`chart-bar ${idx === maxIndex ? "highlight" : ""}`}
                  style={{ height: `${(Number(data.value) / maxValue) * 120}px` }}
                >
                  <span className="chart-value">
                    {(data.value / 1000000).toFixed(1)}jt
                  </span>
                </div>
              </div>

              <span className="chart-label">{data.month}</span>
            </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card products-container">
          <div className="card-header">
            <h2 className="card-title">🛒 Produk Terlaris</h2>
          </div>
          <div className="products-list">
            {topProducts.map((product, idx) => (
              <div key={idx} className="product-item">
                <div className="product-info">
                  <span className="product-emoji">{product.emoji}</span>
                  <span className="product-name">{product.name}</span>
                </div>
                <div className="product-bar">
                  <div
                    className="product-fill"
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
                <span className="product-percentage">{product.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card orders-container">
        <div className="card-header">
          <h2 className="card-title">Pesanan Terbaru</h2>
          <a href="#" className="link-button">Lihat Semua</a>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>NO. PESANAN</th>
                <th>PELANGGAN</th>
                <th>PRODUK</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td className="order-total">{order.total}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                      {order.status === "Pending" && (
                        <button className="action-btn btn-success">
                          Konfirmasi
                        </button>
                      )}
                    <button
                      className="action-btn btn-primary"
                      onClick={() => openDetail(order)}
                    >
                      Detail
                    </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedOrder && (
  <div className="modal-overlay">
    <div className="detail-modal">

      <div className="modal-header">
        <h2>Detail Pesanan</h2>

        <button
          className="close-btn"
          onClick={closeDetail}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

        <div className="detail-grid">

          <div className="detail-item">
            <span>Pelanggan</span>
            <strong>{selectedOrder.customer}</strong>
          </div>

          <div className="detail-item">
            <span>Produk</span>
            <strong>{selectedOrder.product}</strong>
          </div>

          <div className="detail-item">
            <span>Total</span>
            <strong>{selectedOrder.total}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{selectedOrder.status}</strong>
          </div>

        </div>

      </div>

    </div>
  </div>
)}
    </div>
  );
}