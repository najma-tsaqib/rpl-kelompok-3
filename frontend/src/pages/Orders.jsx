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
  fetch("http://localhost/UDLestari/orders.php")
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

  // 🔥 update status (pakai POST biar aman)
  const updateStatus = (id, newStatus) => {
    fetch("http://localhost/UDLestari/orders.php", {
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

  // 🔥 search fix (pakai field DB)
const filteredOrders = orders.filter(order => {
  const term = searchTerm.toLowerCase();

  if (!term || term.trim() === "") return true;

  return JSON.stringify(order)
    .toLowerCase()
    .includes(term);
});

  console.log(orders);
  console.log("SEARCH:", `"${searchTerm}"`);
  console.log("TOTAL:", orders.length);
  console.log("FILTERED:", filteredOrders.length);
  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Manajemen Pesanan</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daftar Pesanan</h2>

          <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari pesanan..."
            value={searchTerm}
            onChange={(e) => {
              console.log("INPUT:", e.target.value); // 🔥
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        </div>

        <table>
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

                <button
                  className="btn-success"
                  onClick={() => updateStatus(order.id_pesanan, "Dikonfirmasi")}
                >
                  Konfirmasi
                </button>

                <button
                  className="btn-detail"
                  onClick={() => openDetail(order)}
                >
                  Detail
                </button>

                <button
                  className="btn-danger"
                  onClick={() => updateStatus(order.id_pesanan, "Dibatalkan")}
                >
                  Cancel
                </button>

              </td>

              </tr>
            ))}
          </tbody>
        </table>
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

        <div className="detail-grid">

          <div className="detail-item">
            <span>Nama Pelanggan</span>
            <strong>{selectedOrder.nama_pelanggan}</strong>
          </div>

          <div className="detail-item">
            <span>Tanggal</span>
            <strong>{selectedOrder.tanggal}</strong>
          </div>

          <div className="detail-item">
            <span>Produk</span>
            <strong>{selectedOrder.produk}</strong>
          </div>

          <div className="detail-item">
            <span>Total</span>
            <strong>Rp{selectedOrder.total}</strong>
          </div>

          <div className="detail-item">
            <span>Pembayaran</span>

            <div>
              <span className={`badge ${getPaymentBadgeClass(selectedOrder.pembayaran || "Belum Bayar")}`}>
                {selectedOrder.pembayaran || "Belum Bayar"}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <span>Status</span>

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