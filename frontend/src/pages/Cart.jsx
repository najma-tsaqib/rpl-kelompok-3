import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Cart.css";

import boxIcon from "../assets/box.png";
import truckIcon from "../assets/truck.png";
import gpsIcon from "../assets/gps.png";
import transferIcon from "../assets/transfer.png";
import ewalletIcon from "../assets/ewallet.png";
import codIcon from "../assets/cod.png";
import uploadIcon from "../assets/upload.png";

export default function Cart({ isLogin, role }) {

  const [cart, setCart] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [shippingMethod, setShippingMethod] =
  useState("Ambil Sendiri");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {

    const data =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(data);

  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.harga * item.qty,
    0
  );

  const getEmoji = (nama) => {

    const n = nama.toLowerCase();

    if (n.includes("ayam")) return "🐔";
    if (n.includes("daging")) return "🥩";
    if (n.includes("ceker")) return "🦶";
    if (n.includes("tulang")) return "🦴";
    if (n.includes("fillet")) return "🍗";

    return "📦";
  };

  const updateQty = (id, type) => {

    const updatedCart = cart.map((item) => {

      if (item.id_produk === id) {

      if (type === "plus") {

        if (item.qty >= item.stok) {

          alert("Stok tidak cukup");

          return item;
        }

        return {
          ...item,
          qty: item.qty + 1
        };
      }

        if (type === "minus") {

          if (item.qty === 1) {

            const confirmDelete = window.confirm(
              "Apakah anda yakin ingin menghapus produk ini dari keranjang?"
            );

            if (confirmDelete) {

              return {
                ...item,
                qty: 0
              };
            }

            return item;
          }

          return {
            ...item,
            qty: item.qty - 1
          };
        }
      }

      return item;
    })
    .filter((item) => item.qty > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const removeItem = (id) => {

    const confirmDelete = window.confirm(
      "Apakah anda yakin ingin menghapus produk ini dari keranjang?"
    );

    if (!confirmDelete) return;

    const updatedCart = cart.filter(
      (item) => item.id_produk !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const user =
  JSON.parse(localStorage.getItem("user"));

  const handleCheckout = async () => {

    const checkoutRes = await fetch(
      "http://203.194.115.52checkout.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cart,
          total,
          metode_pembayaran: paymentMethod,
          metode_pengiriman: shippingMethod,
          id_customer: user.id_customer
        })
      }
    );

    const checkoutData =
      await checkoutRes.json();

    /* upload kalau bukan COD */
    if (
      paymentMethod !== "COD" &&
      selectedFile
    ) {

      const formData = new FormData();

      formData.append(
        "id_pembayaran",
        checkoutData.id_pembayaran
      );

      formData.append(
        "file",
        selectedFile
      );

      await fetch(
        "http://203.194.115.52upload_payment.php",
        {
          method: "POST",
          body: formData
        }
      );

      setUploadSuccess(true);
    }

    localStorage.removeItem("cart");

    window.location.href =
      `/success?id=${checkoutData.id_pesanan}&total=${total}`;
  };

  return (
    <>
      <Navbar
        isLogin={isLogin}
        role={role}
      />

      <div className="cart-page">

        <div className="cart-header">

          <h1>
            🛒 Keranjang Belanja
          </h1>

          <span className="cart-count">
            {cart.length}
          </span>

        </div>

        <div className="cart-layout">

          {/* LEFT */}
          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id_produk}
              >

                <div className="cart-item-left">

                  <div className="cart-image">

                    {item.foto ? (

                      <img
                        src={item.foto}
                        alt={item.nama_produk}
                      />

                    ) : (

                      <span>
                        {getEmoji(item.nama_produk)}
                      </span>

                    )}

                  </div>

                  <div>

                    <h3>
                      {item.nama_produk}
                    </h3>

                    <p>
                      Rp{item.harga.toLocaleString("id-ID")}
                    </p>

                  </div>

                </div>

                <div className="cart-item-right">

                  <div className="qty-box">

                    <button
                      onClick={() =>
                        updateQty(item.id_produk, "minus")
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.id_produk, "plus")
                      }
                    >
                      +
                    </button>

                  </div>

                  <div className="cart-price">

                    Rp
                    {(item.harga * item.qty)
                      .toLocaleString("id-ID")}

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeItem(item.id_produk)}
                  >
                    🗑
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT */}

          <div className="summary-wrapper">

            {/* METODE PENGIRIMAN */}
<div className="summary-card">

  <h2>
    Metode Pengiriman
  </h2>

<div className="shipping-methods">

  <button
    className={`shipping-btn ${
      shippingMethod === "Ambil Sendiri"
        ? "active"
        : ""
    }`}
    onClick={() =>
      setShippingMethod("Ambil Sendiri")
    }
  >

    <div className="shipping-icon">
      <img src={boxIcon} alt="Ambil Sendiri" />
    </div>

    <span>
      Ambil Sendiri
    </span>

  </button>

  <button
    className={`shipping-btn ${
      shippingMethod === "Kurir Antar"
        ? "active"
        : ""
    }`}
    onClick={() =>
      setShippingMethod("Kurir Antar")
    }
  >

    <div className="shipping-icon gray">
      <img src={truckIcon} alt="Kurir Antar" />
    </div>

    <span>
      Kurir Antar
    </span>

  </button>

</div>

  <div className="pickup-info">

    <div className="pickup-icon">
    <img src={gpsIcon} alt= "gps" />
    </div>

    <div>

      <small>
        Alamat Toko Kami
      </small>

      <strong>
        Jl. Merpati No. 123,
        Kelurahan Sukamaju,
        Kecamatan Cibeunying
      </strong>

    </div>

  </div>

</div>
          <div className="summary-card">

            <h2>
              Ringkasan Pesanan
            </h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                Rp{total.toLocaleString("id-ID")}
              </span>

            </div>

            <div className="summary-row">

              <span>Ongkos Kirim</span>
              <span>Rp0</span>

            </div>

            <div className="summary-row">

              <span>Diskon</span>

              <span style={{ color: "#22c55e" }}>
                -Rp0
              </span>

            </div>

            <div className="summary-total">

              <span>Total</span>

              <span>
                Rp{total.toLocaleString("id-ID")}
              </span>

            </div>

            {/* PAYMENT */}
            <div className="payment-section">

              <h3>
                Metode Pembayaran
              </h3>

              <div className="payment-methods">

                <button
                  className={`payment-btn ${
                    paymentMethod === "Transfer Bank"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("Transfer Bank")
                  }
                >
                <img src={transferIcon} alt="transfer"/>
                  <span>Transfer Bank</span>
                </button>

                <button
                  className={`payment-btn ${
                    paymentMethod === "E-Wallet"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("E-Wallet")
                  }
                >
                  <img src={ewalletIcon} alt="ewallet"/>
                  <span>E-Wallet</span>
                </button>

                <button
                  className={`payment-btn ${
                    paymentMethod === "COD"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod("COD")
                  }
                >
                <img src={codIcon} alt="cod"/>
                  <span>COD</span>
                </button>

              </div>

            </div>

            {/* INFO PEMBAYARAN */}
            {paymentMethod !== "COD" && (

              <div className="payment-info-card">

                <div className="payment-info-header">

                  <div className="payment-info-icon">

                    {paymentMethod === "Transfer Bank"
                      ? <img src={transferIcon} alt="transfer"/>
                      : <img src={ewalletIcon} alt="ewallet"/>}

                  </div>

                  <div>

                    <h4>
                      {paymentMethod}
                    </h4>

                  </div>

                </div>

                <div className="payment-info-body">

                  {paymentMethod === "Transfer Bank" ? (

                    <>

                      <div className="info-row">

                        <span>
                          Nama Bank
                        </span>

                        <strong>
                          BCA
                        </strong>

                      </div>

                      <div className="info-row">

                        <span>
                          Nama Penerima
                        </span>

                        <strong>
                          UD Lestari / Lestari Store
                        </strong>

                      </div>

                      <div className="info-row">

                        <span>
                          Nomor Rekening
                        </span>

                      </div>

                      <div className="rekening-box">

                        <strong>
                          1234567890
                        </strong>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("1234567890");
                          }}
                        >
                          Salin
                        </button>

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="info-row">

                        <span>
                          Daftar E-Wallet
                        </span>

                        <strong>
                          Gopay/Dana/Ovo
                        </strong>

                      </div>

                      <div className="info-row">

                        <span>
                          Nama Penerima
                        </span>

                        <strong>
                          UD Lestari / Lestari Store
                        </strong>

                      </div>

                      <div className="info-row">

                        <span>
                          Nomor E-Wallet
                        </span>

                      </div>

                      <div className="rekening-box">

                        <strong>
                          085827662727
                        </strong>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("085827662727");
                          }}
                        >
                          Salin
                        </button>

                      </div>

                    </>

                  )}

                </div>

              </div>

            )}

            {/* UPLOAD */}
            {paymentMethod !== "COD" && (

              <div className="upload-section">

                <h3>
                  Upload Bukti Pembayaran
                </h3>

                <label className="upload-box">

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  hidden
                  onChange={(e) => {

                    const file = e.target.files[0];

                    if (!file) return;

                    setSelectedFile(file);

                    setUploadSuccess(false);

                  }}
                />

                  <div className="upload-icon">
                  <img src={uploadIcon} alt="upload"/>
                  </div>

                  <p>
                    Klik untuk upload bukti transfer
                  </p>

                  <span>
                    Format: JPG, PNG, PDF
                  </span>

                  {selectedFile && (

                    <div className="uploaded-file">

                      📄 {selectedFile.name}

                    </div>

                  )}

                  {uploadSuccess && (

                    <div className="upload-success">

                      ✅ Bukti pembayaran berhasil diupload

                    </div>

                  )}

                </label>

              </div>

            )}

            <button
              className="checkout-btn"
              onClick={() => {

                if (
                  paymentMethod !== "COD" &&
                  !selectedFile
                ) {
                  alert(
                    "Silakan upload bukti pembayaran terlebih dahulu."
                  );

                  return;
                }

                setShowConfirm(true);
              }}
            >
              ✔ Konfirmasi Pesanan
            </button>

          </div>

        </div>

      </div>

      </div>
      
      {showConfirm && (

  <div className="modal-overlay">

    <div className="confirm-modal">

      <div className="confirm-icon">
        🛡️
      </div>

      <h2>
        Apakah Pesanan Sudah Sesuai?
      </h2>

      <p>
        Pastikan semua detail pesanan sudah benar.
      </p>

      <div className="warning-box">
        ⚠️ Periksa kembali produk, jumlah,
        dan alamat pengiriman sebelum melanjutkan.
      </div>

      <div className="danger-box">
        ❗ Setelah dikonfirmasi,
        pesanan tidak dapat dibatalkan.
      </div>

      <div className="modal-actions">

        <button
          className="cancel-btn"
          onClick={() => setShowConfirm(false)}
        >
          Batalkan
        </button>

        <button
          className="confirm-btn"
          onClick={handleCheckout}
        >
          Konfirmasi Pesanan
        </button>

      </div>

    </div>

  </div>

)}
    </>
  );
}