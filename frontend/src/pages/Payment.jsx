import React, { useState, useEffect } from 'react';
import '../styles/Payment.css';

export default function Payment() {

  const [payments, setPayments] = useState([]);

  /* FETCH DATA */
  const fetchData = () => {

    fetch("http://localhost/UDLestari/payment.php")
      .then(res => res.json())
      .then(data => setPayments(data));

  };

  useEffect(() => {
    fetchData();
  }, []);

  /* VERIFY */
  const handleVerify = (id) => {

    fetch("http://localhost/UDLestari/payment.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id_pembayaran: id,
        status: "Terverifikasi"
      })
    })
      .then(res => res.json())
      .then(() => fetchData());

  };

  /* REJECT */
  const handleReject = (id) => {

    fetch("http://localhost/UDLestari/payment.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id_pembayaran: id,
        status: "Ditolak"
      })
    })
      .then(res => res.json())
      .then(() => fetchData());

  };

  const getStatusBadgeClass = (status) => {

    if (status === 'Terverifikasi')
      return 'badge-success';

    if (status === 'Ditolak')
      return 'badge-danger';

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
                  <td className="order-id">#ORD-{String(payment.id_pesanan).padStart(4, '0')}</td>
                  <td>{payment.customer}</td>
                  <td>{payment.method}</td>
                  <td className="amount">Rp{Number(payment.amount).toLocaleString("id-ID")}</td>
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
                          onClick={() => handleVerify(payment.id_pembayaran)}
                        >
                          Verifikasi
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleReject(payment.id_pembayaran)}
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