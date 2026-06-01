import React, { useState, useEffect } from 'react';
import '../styles/Orders.css';

export default function Orders() {

  const [selectedOrder, setSelectedOrder] = useState(null);
const [showModal, setShowModal] = useState(false);

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusBadgeClass = (status) => {
    if (status === "Pending") return "badge-warning";
    if (status === "Dikonfirmasi") return "badge-info";
    if (status === "Selesai") return "badge-success";
    return "";
  };

  const getPaymentBadgeClass = (payment) => {
    if (payment === "Lunas") return "badge-success";
    return "badge-warning";
  };

  const openDetail = (order) => {
  setSelectedOrder(order);
  setShowModal(true);
  };

  const closeDetail = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  // 🔥 ambil data dari backend
const fetchData = () => {
  fetch("http://203.194.115.52/orders.php")
    .then(res => res.text()) // 🔥 ubah dulu jadi text
    .then(text => {
      console.log("RAW:", text); // 🔥 LIAT INI

      try {
        const data = JSON.parse(text);
        setOrders(data);
      } catch (err) {
        console.error("JSON ERROR:", err);
      }
    });
};

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch("http://203.194.115.52/orders.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "update_status",
        id_pesanan: id,
        status: newStatus
      })
    })
      .then(res => res.json())
      .then(() => fetchData());
  };

const filteredOrders = orders.filter((order) =>

  order.nama_pelanggan
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())

  ||

  order.id_pesanan
    ?.toString()
    .includes(searchTerm)

  ||

  order.produk
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())

);


  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Manajemen Pesanan</h1>
        <h2 className="page-subtitle">Kelola dan verifikasi semua pesanan masuk</h2>
      </div>

<div className="orders-card">

  {/* HEADER */}
  <div className="orders-card-header">

    <h2 className="card-title">
      Daftar Pesanan
    </h2>

    <div className="search-box">
      <input
        type="text"
        placeholder="Cari pesanan..."
        value={searchTerm}
        onChange={(e) => {
          console.log("INPUT:", e.target.value);
          setSearchTerm(e.target.value);
        }}
      />

    </div>

  </div>

  {/* TABLE */}
  <div className="table-container">

    <table className="orders-table">
          <thead>
            <tr>
              <th>NO. PESANAN</th>
              <th>PELANGGAN</th>
              <th>TANGGAL</th>
              <th>PRODUK</th>
              <th>TOTAL</th>
              <th>PEMBAYARAN</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id_pesanan}>
                
                <td className="order-id">
                  #ORD-{String(order.id_pesanan).padStart(4, '0')}
                </td>

                <td>{order.nama_pelanggan}</td>

                <td>{order.tanggal}</td>

                <td>{order.produk}</td>

                <td className="order-total">
                  Rp{order.total}
                </td>

                <td>
                  <span className={`badge ${getPaymentBadgeClass(order.pembayaran || "Belum Bayar")}`}>
                    {order.pembayaran || "Belum Bayar"}
                  </span>
                </td>

                <td>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>

               <td className="action-cell">

              {order.status !== "Ditolak" && (
                <button
                  className="btn-success"
                  onClick={() =>
                    updateStatus(order.id_pesanan, "Dikonfirmasi")
                  }
                >
                  Konfirmasi
                </button>
              )}

                <button
                  className="btn-detail"
                  onClick={() => openDetail(order)}
                >
                  Detail
                </button>

              {order.status !== "Ditolak" && (
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm("Yakin ingin membatalkan pesanan ini?")) {
                      updateStatus(order.id_pesanan, "Ditolak");
                    }
                  }}
                >
                  Cancel
                </button>
              )}

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
          <p>
            #ORD-{String(selectedOrder.id_pesanan).padStart(4, '0')}
          </p>
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
          <strong>{selectedOrder.nama_pelanggan}</strong>
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
            <span className={`badge ${getPaymentBadgeClass(selectedOrder.status_pembayaran || "Belum Bayar")}`}>
              {selectedOrder.status_pembayaran || "Belum Bayar"}
            </span>
          </div>
        </div>

        <div className="detail-order-item">
          <span>Metode Pembayaran</span>
          <strong>{selectedOrder.metode_pembayaran || "-"}</strong>
        </div>

        <div className="detail-order-item">
          <span>Metode Pengiriman</span>
          <strong>{selectedOrder.metode_pengiriman || "-"}</strong>
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