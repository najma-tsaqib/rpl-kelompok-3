import React, { useState } from 'react';
import '../styles/Payment.css';

export default function Payment() {
  const [payments, setPayments] = useState([
    {
      id: '#ORD-0048',
      customer: 'Budi Santoso',
      orderId: '#ORD-0048',
      method: 'Transfer Bank',
      amount: 'Rp150.000',
      date: '20 Jun 2024',
      status: 'Belum Diverifikasi'
    },
    {
      id: '#ORD-0045',
      customer: 'Dewi Lestari',
      orderId: '#ORD-0045',
      method: 'E-Wallet',
      amount: 'Rp30.000',
      date: '19 Jun 2024',
      status: 'Belum Diverifikasi'
    },
    {
      id: '#ORD-0047',
      customer: 'Siti Rahayu',
      orderId: '#ORD-0047',
      method: 'Transfer Bank',
      amount: 'Rp110.000',
      date: '20 Jun 2024',
      status: 'Terverifikasi'
    }
  ]);

  const handleVerify = (id) => {
    setPayments(payments.map(p =>
      p.id === id ? { ...p, status: 'Terverifikasi' } : p
    ));
  };

  const handleReject = (id) => {
    setPayments(payments.map(p =>
      p.id === id ? { ...p, status: 'Ditolak' } : p
    ));
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Terverifikasi') return 'badge-success';
    if (status === 'Ditolak') return 'badge-danger';
    return 'badge-warning';
  };

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1 className="page-title">Verifikasi Pembayaran</h1>
        <p className="page-subtitle">Periksa dan verifikasi bukti pembayaran dari pelanggan</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daftar Pembayaran</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>NO. PESANAN</th>
                <th>PELANGGAN</th>
                <th>METODE</th>
                <th>JUMLAH</th>
                <th>TANGGAL UPLOAD</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={idx}>
                  <td className="order-id">{payment.orderId}</td>
                  <td>{payment.customer}</td>
                  <td>{payment.method}</td>
                  <td className="amount">{payment.amount}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    {payment.status === 'Belum Diverifikasi' ? (
                      <>
                        <button
                          className="action-btn verify"
                          onClick={() => handleVerify(payment.id)}
                        >
                          Verifikasi
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleReject(payment.id)}
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <button className="action-btn view">Lihat Bukti</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="result-info">
            Total: {payments.length} | Terverifikasi: {payments.filter(p => p.status === 'Terverifikasi').length}
          </span>
        </div>
      </div>

      <div className="payment-info-card card">
        <h3>ℹ️ Panduan Verifikasi Pembayaran</h3>
        <ul className="info-list">
          <li>Periksa nomor akun penerima pembayaran pada bukti transfer</li>
          <li>Pastikan nominal pembayaran sesuai dengan total pesanan</li>
          <li>Verifikasi tanggal pembayaran tidak melebihi batas waktu yang ditentukan</li>
          <li>Jika ada keraguan, hubungi pelanggan melalui nomor telepon yang terdaftar</li>
        </ul>
      </div>
    </div>
  );
}