import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // FETCH DATABASE
  useEffect(() => {

    fetch("http://localhost/UDLestari/getCustomers.php")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      });

  }, []);

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
      (sum, c) => sum + Number(c.totalOrders),
      0
    );

  return (

    <div className="customers-page">

      {/* HEADER */}
      <div className="page-header">

        <h1 className="page-title">
          Manajemen Pelanggan
        </h1>

        <p className="page-subtitle">
          Kelola data pelanggan terdaftar
        </p>

      </div>

      {/* CARD */}
      <div className="customer-card">

        <div className="card-header">

          <h2 className="card-title">
            Data Pelanggan
          </h2>

          <div className="header-controls">

            {/* SEARCH */}
            <div className="search-wrapper">

              <input
                type="text"
                placeholder="Cari pelanggan..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="search-input"
              />

              <span className="search-icon">
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
                    {customer.totalorders} pesanan
                  </span>

                  </td>

                  {/* AKSI */}
                  <td className="action-cell">

                    <button className="action-btn view">
                      Detail
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="table-footer">

          <span className="result-info">

            Menampilkan {filteredCustomers.length}
            dari {customers.length} pelanggan

          </span>

        </div>

      </div>

    </div>

  );
}