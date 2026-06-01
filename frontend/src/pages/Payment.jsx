import React, { useState, useEffect } from "react";
import "../styles/Payment.css";

export default function Payment() {

  const [payments, setPayments] = useState([]);

  /* FETCH */
  const fetchData = () => {

    fetch("http://203.194.115.52payment.php")
      .then((res) => res.json())
      .then((data) => setPayments(data));

  };

  useEffect(() => {
    fetchData();
  }, []);

  /* VERIFY */
  const handleVerify = (id) => {

    fetch("http://203.194.115.52payment.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id_pembayaran: id,
        status: "Terverifikasi"
      })
    })
      .then((res) => res.json())
      .then(() => fetchData());

  };

  /* REJECT */
  const handleReject = (id) => {

    fetch("http://203.194.115.52payment.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id_pembayaran: id,
        status: "Ditolak"
      })
    })
      .then((res) => res.json())
      .then(() => fetchData());

  };

  const getStatusClass = (status) => {

    if (status === "Terverifikasi")
      return "status-success";

    if (status === "Ditolak")
      return "status-danger";

    return "status-warning";
  };

  return (

    <div className="payment-page">

      {/* HEADER */}
      <div className="payment-header">

        <div>

          <h1>
            Verifikasi Pembayaran
          </h1>

          <p>
            Periksa dan verifikasi bukti pembayaran dari pelanggan
          </p>

        </div>

      </div>

      {/* CARD */}
      <div className="payment-card">

        {/* CARD HEADER */}
        <div className="payment-card-header">

          <h2>
            Daftar Pembayaran
          </h2>

        </div>

        {/* TABLE CONTAINER */}
        <div className="payment-table-container">

          <table className="payment-table">

            <thead>

              <tr>
                <th>NO. PESANAN</th>
                <th>PELANGGAN</th>
                <th>METODE</th>
                <th>JUMLAH</th>
                <th>TANGGAL UPLOAD</th>
                <th>BUKTI</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>

            </thead>

            <tbody>

              {payments.map((payment) => (

                <tr key={payment.id_pembayaran}>

                  {/* ORDER ID */}
                  <td className="payment-order-id">

                    #ORD-
                    {String(payment.id_pesanan)
                      .padStart(4, "0")}

                  </td>

                  {/* CUSTOMER */}
                  <td>
                    {payment.customer}
                  </td>

                  {/* METHOD */}
                  <td>
                    {payment.method}
                  </td>

                  {/* AMOUNT */}
                  <td className="payment-amount">

                    Rp
                    {Number(payment.amount)
                      .toLocaleString("id-ID")}

                  </td>

                  {/* DATE */}
                  <td>
                    {payment.date}
                  </td>

                  {/* PROOF */}
                  <td>

                    {payment.bukti_transfer ? (

                      <a
                        href={`http://203.194.115.52${payment.bukti_transfer}`}
                        target="_blank"
                        rel="noreferrer"
                        className="proof-btn"
                      >
                        Lihat Bukti
                      </a>

                    ) : (

                      <span className="no-proof">
                        Cash On Delivery
                      </span>

                    )}

                  </td>

                  {/* STATUS */}
                  <td>

                    <span
                      className={`status-badge ${getStatusClass(payment.status)}`}
                    >
                      {payment.status}
                    </span>

                  </td>

                  {/* ACTION */}
                  <td>

                    {payment.status === "Belum Diverifikasi" ? (

                      <div className="action-buttons">

                        <button
                          className="verify-btn"
                          onClick={() =>
                            handleVerify(payment.id_pembayaran)
                          }
                        >
                          Verifikasi
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleReject(payment.id_pembayaran)
                          }
                        >
                          Tolak
                        </button>

                      </div>

                    ) : (

                      <span className="done-text">
                        —
                      </span>

                    )}

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