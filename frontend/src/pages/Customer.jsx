import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [customerDetail, setCustomerDetail] = useState(null);

  const [customerOrders, setCustomerOrders] = useState([]);

  // FETCH DATABASE
  useEffect(() => {

    fetch("http://203.194.115.52/getCustomers.php")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      });

  }, []);

  const handleDetail = async (customer) => {

  setShowModal(true);

  // DETAIL CUSTOMER
  const detailRes = await fetch(
    `http://203.194.115.52/customer_detail.php?id_customer=${customer.id}`
  );

  const detailData = await detailRes.json();

  setCustomerDetail(detailData);

  // RECENT ORDERS
  const orderRes = await fetch(
    `http://203.194.115.52/customer_orders.php?id_customer=${customer.id}`
  );

  const orderData = await orderRes.json();

  setCustomerOrders(orderData);

};

  // SEARCH FILTER
  const filteredCustomers = customers.filter(customer =>

    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||

    customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||

    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  // STATS
  const totalCustomers = customers.length;

  const activeCustomers =
    customers.filter(c => c.status === 'Aktif').length;

  const totalOrders =
    customers.reduce(
      (sum, c) => sum + Number(c.total_pesanan),
      0
    );

  return (

    <div className="customers-page">

      {/* HEADER */}
      <div className="customer-page-header">

        <h1 className="customer-page-title">
          Manajemen Pelanggan
        </h1>

        <p className="customer-page-subtitle">
          Kelola data pelanggan terdaftar
        </p>

      </div>

      {/* CARD */}
      <div className="customer-card">

        <div className="customer-card-header">

          <h2 className="customer-card-title">
            Data Pelanggan
          </h2>

          <div className="customer-header-controls">

            {/* SEARCH */}
            <div className="customer-search-wrapper">

              <input
                type="text"
                placeholder="Cari pelanggan..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="customer-search-input"
              />

              <span className="customer-search-icon">
                🔍
              </span>

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="customer-table">

          <table>

            <thead>

              <tr>
                <th>NAMA</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>NO. TELEPON</th>
                <th>TOTAL PESANAN</th>
                <th>AKSI</th>
              </tr>

            </thead>

            <tbody>

              

              {filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  {/* NAMA */}
                  <td className="customer-name">
                    {customer.name}
                  </td>

                  {/* USERNAME */}
                  <td>
                    {customer.username}
                  </td>

                  {/* EMAIL */}
                  <td>
                    {customer.email}
                  </td>

                  {/* PHONE */}
                  <td>
                    {customer.phone}
                  </td>

                  {/* TOTAL ORDER */}
                  <td>
                <span className="order-count">
                  {customer.total_pesanan} pesanan
                </span>
                  </td>

                  {/* AKSI */}
                  <td className="customer-action-cell">

                  <button
                    className="action-btn view"
                    onClick={() => handleDetail(customer)}
                  >
                    Detail
                  </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
</div>

        {/* FOOTER */}
        <div className="customer-table-footer">

          <span className="customer-result-info">

            Menampilkan {filteredCustomers.length}
            dari {customers.length} pelanggan

          </span>

        </div>

      </div>

{showModal && customerDetail && (

  <div className="customer-modal-overlay">

    <div className="customer-detail-modal">

      <div className="customer-modal-header">

        <div>

          <h2>Detail Pelanggan</h2>

          <p>
            Customer ID:
            #{customerDetail.id_customer}
          </p>

        </div>

        <button
          className="customer-close-btn"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>

      </div>

      <div className="customer-modal-body">

        {/* TITLE */}
        <div className="detail-section-title">

          <div className="detail-section-line"></div>

          <h3>Informasi Pelanggan</h3>

        </div>

        {/* GRID */}
        <div className="customer-detail-grid">

          <div className="customer-detail-item">
            <span>Nama Pelanggan</span>
            <strong>{customerDetail.name}</strong>
          </div>

          <div className="customer-detail-item">
            <span>Username</span>
            <strong>{customerDetail.username}</strong>
          </div>

          <div className="customer-detail-item">
            <span>Email</span>
            <strong>{customerDetail.email}</strong>
          </div>

          <div className="customer-detail-item">
            <span>No WhatsApp</span>
            <strong>
              {customerDetail.nomor_telepon}
            </strong>
          </div>

          <div className="customer-detail-item">
            <span>Total Pesanan</span>

            <div className="detail-order-badge">
              {customerDetail.total_pesanan} orders
            </div>

          </div>

          <div className="customer-detail-item">
            <span>Total Belanja</span>

            <strong>
              Rp
              {Number(
                customerDetail.total_belanja
              ).toLocaleString()}
            </strong>

          </div>

        </div>

        {/* RECENT ORDERS */}
        <div className="recent-orders">
        <div className="recent-orders-title">
          <div className="detail-section-line"></div>
          <h3>Recent Orders</h3>
        </div>
              
          {customerOrders.map((order) => (

            <div
              className="recent-order-card"
              key={order.id_pesanan}
            >

              <div>

                <strong>
                  #ORD-{order.id_pesanan}
                </strong>

                <p>{order.tanggal}</p>

              </div>

              <div>
                Rp
                {Number(order.total)
                  .toLocaleString()}
              </div>

              <span className="recent-badge">
                {order.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

)}
    </div>

  );
}