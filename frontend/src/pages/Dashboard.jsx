import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import '../styles/Dashboard.css';

import ordersIcon from '../assets/total pesanan.png';
import incomeIcon from '../assets/pendapatan hari ini.png';
import stockIcon from '../assets/stok tersisa.png';
import customerIcon from '../assets/total pelanggan.png';

export default function Dashboard({
    setCurrentPage
  }) {
  const [selectedYear, setSelectedYear] = useState("2026")

  const [chartData, setChartData] = useState([]);

  const [summary, setSummary] = useState({});

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
    fetch(`http://203.194.115.52/chart.php?year=${selectedYear}`)
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

  useEffect(() => {

  fetch("http://203.194.115.52/dashboard_summary.php")
    .then(res => res.json())
    .then(data => {

      console.log("SUMMARY:", data);

      setSummary(data);

    });

}, []);

const stats = [

  {
    label: 'Total Pesanan',
    image: ordersIcon,
    value: summary.orders || 0,

    change:
      `${summary.orders_percent || 0}%`,

    changeType:
      summary.orders_percent >= 0
      ? 'positive'
      : 'negative',

    changeText: 'dari kemarin'
  },

  {
    label: 'Stok Tersisa',
    image: stockIcon,

    value:
      `${summary.stock || 0} kg`,

    change: '',

    changeType: 'neutral',

    changeText: 'stok tersedia',
  },

  {
    label: 'Total Pelanggan',
    image: customerIcon,

    value:
      summary.customers || 0,
  },

  {
    label: 'Pendapatan Hari Ini',
    image: incomeIcon,

    value:
      `Rp${Number(summary.income || 0)
        .toLocaleString("id-ID")}`,

    change:
      `${summary.income_percent || 0}%`,

    changeType:
      summary.income_percent >= 0
      ? 'positive'
      : 'negative',

    changeText: 'dari kemarin',
  }

];

  const [topProducts, setTopProducts] = useState([]);

  const [recentOrders, setRecentOrders] = useState([]);

fetch("http://203.194.115.52/orders.php")
  .then(res => res.json())
  .then(data => {

    const formatted = data.map(order => ({
      id: `#ORD-${String(order.id_pesanan).padStart(4, '0')}`,

      customer: order.nama_pelanggan,

      product: order.produk,

      total: `Rp${Number(order.total).toLocaleString("id-ID")}`,

      status: order.status,

      tanggal: order.tanggal,

      no_telepon: order.no_telepon,

      status_pembayaran: order.status_pembayaran,

      metode_pembayaran: order.metode_pembayaran,

      metode_pengiriman: order.metode_pengiriman
    }));

    setRecentOrders(formatted.slice(0, 5));
  });

useEffect(() => {

  fetch("http://203.194.115.52/top_products.php")

    .then((res) => res.json())

    .then((data) => {
      setTopProducts(data);
    });

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
  
  const maxSold =
  topProducts[0]?.total || 1;
  
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Selamat datang, Admin! Berikut ringkasan aktivitas toko hari ini.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-top">

            <div className="stat-icon-box">
              <img
                src={stat.image}
                alt={stat.label}
                className="stat-image"
              />
            </div>

            <div className="stat-content">

              <div className="stat-value">
                {stat.value}
              </div>

              <div className="stat-label">
                {stat.label}
              </div>

              {stat.change && (
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.changeType === "negative" ? "↓" : "↑"} {stat.change}
                  <span className="change-text">
                    {stat.changeText}
                  </span>
                </div>
              )}

            </div>

          </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Chart Section */}
        <div className="card chart-container">
          <div className="chart-header">
  <div className="chart-title">
     <span>Grafik Penjualan Bulanan</span>
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
{/* Top Products */}
<div className="card products-container">

  <div className="card-header">
    <h2 className="card-title">
      Produk Terlaris
    </h2>
  </div>

  <div className="products-list">

    {topProducts.map((product, idx) => {

      const percentage = Math.round(
        (product.total / topProducts[0].total) * 100
      );

      return (
        <div
          key={idx}
          className="product-item"
        >

          <img
            src={product.foto}
            alt={product.name}
            className="top-product-image"
          />

          <div className="product-content">

            <div className="product-top">

              <span className="product-name">
                {product.name}
              </span>

              <span className="product-percentage">
                {percentage}%
              </span>

            </div>

            <div className="product-bar">

              <div
                className="product-fill"
                style={{
                  width: `${percentage}%`
                }}
              ></div>

            </div>

          </div>

        </div>
      );
    })}

  </div>

</div>
      </div>

      {/* Recent Orders */}
      <div className="card orders-container">
        <div className="card-header">
          <h2 className="card-title">Pesanan Terbaru</h2>
          <span
            className="link-button"
            onClick={() => {
              setCurrentPage("orders");
            }}
          >
            Lihat Semua
          </span>
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
        <div>
          <h2>Detail Pesanan</h2>
          <p>{selectedOrder.id}</p>
        </div>

        <button
          className="close-btn"
          onClick={closeDetail}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

      <div className="detail-order-grid">

        <div className="detail-order-item">
          <span>Nama Pelanggan</span>
          <strong>{selectedOrder.customer}</strong>
        </div>

        <div className="detail-order-item">
          <span>Tanggal Pesanan</span>
          <strong>{selectedOrder.tanggal}</strong>
        </div>

        <div className="detail-order-item">
          <span>No. WhatsApp</span>
          <strong>{selectedOrder.no_telepon}</strong>
        </div>

        <div className="detail-order-item">
          <span>Status Pembayaran</span>

          <div>
            <span className="badge badge-warning">
              {selectedOrder.status_pembayaran}
            </span>
          </div>
        </div>

        <div className="detail-order-item">
          <span>Metode Pembayaran</span>
          <strong>{selectedOrder.metode_pembayaran}</strong>
        </div>

        <div className="detail-order-item">
          <span>Metode Pengiriman</span>
          <strong>{selectedOrder.metode_pengiriman}</strong>
        </div>

        <div className="detail-order-item full-width">
          <span>Status Pesanan</span>

          <div>
            <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>
        </div>

      </div>

      </div>

      <div className="modal-footer">
        <button
          className="btn-close"
          onClick={closeDetail}
        >
          Tutup
        </button>
      </div>

    </div>
  </div>
)}
      
    </div>
  );
}