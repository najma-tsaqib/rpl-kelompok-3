import React, { useState } from 'react';
import '../styles/Customer.css';

export default function Customers() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Budi Santoso',
      username: 'budi_sa',
      email: 'budi@email.com',
      phone: '081212345678',
      totalOrders: 12,
      status: 'Aktif'
    },
    {
      id: 2,
      name: 'Siti Rahayu',
      username: 'siti_r',
      email: 'siti@email.com',
      phone: '081398765432',
      totalOrders: 8,
      status: 'Aktif'
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      username: 'ahmad_fah',
      email: 'ahmad@email.com',
      phone: '082255551234',
      totalOrders: 5,
      status: 'Aktif'
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      username: 'dewi_les',
      email: 'dewi@email.com',
      phone: '081567890123',
      totalOrders: 15,
      status: 'Aktif'
    },
    {
      id: 5,
      name: 'Rini Handoko',
      username: 'rini_hnd',
      email: 'rini@email.com',
      phone: '082178901234',
      totalOrders: 3,
      status: 'Aktif'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Aktif').length;
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1 className="page-title">Manajemen Pelanggan</h1>
        <p className="page-subtitle">Kelola data pelanggan terdaftar</p>
      </div>

      {/* Customer Stats */}
      <div className="customer-stats">
        <div className="stat-box">
          <div className="stat-number">{totalCustomers}</div>
          <div className="stat-label">Total Pelanggan</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{activeCustomers}</div>
          <div className="stat-label">Pelanggan Aktif</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{totalOrders}</div>
          <div className="stat-label">Total Pesanan</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{(totalOrders / totalCustomers).toFixed(1)}</div>
          <div className="stat-label">Rata-rata Pesanan</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Data Pelanggan</h2>
          <div className="header-controls">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Cari pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="btn btn-primary">+ Tambah Pelanggan</button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>NAMA</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>NO. TELEPON</th>
                <th>TOTAL PESANAN</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-name">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <span>{customer.name}</span>
                  </td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td className="order-count">{customer.totalOrders} pesanan</td>
                  <td>
                    <span className="badge badge-success">{customer.status}</span>
                  </td>
                  <td className="action-cell">
                    <button className="action-btn view">Detail</button>
                    <button className="action-btn edit">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="result-info">Menampilkan {filteredCustomers.length} dari {customers.length} pelanggan</span>
        </div>
      </div>
    </div>
  );
}