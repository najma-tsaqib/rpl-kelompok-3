import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Cart.css";

export default function Cart({ isLogin, role }) {

  const [cart, setCart] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

const handleCheckout = async () => {

  /* checkout */
  const checkoutRes = await fetch(
    "http://localhost/UDLestari/checkout.php",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        cart,
        total
      })
    }
  );
  
  setUploadSuccess(true);

  const checkoutData =
    await checkoutRes.json();

  /* kalau ada file */
  if (selectedFile) {

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
      "http://localhost/UDLestari/upload_payment.php",
      {
        method: "POST",
        body: formData
      }
    );
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

                <button className="payment-btn active">
                🏦
                <span>Transfer Bank</span>
                </button>

                <button className="payment-btn">
                💳
                <span>E-Wallet</span>
                </button>

            </div>

            </div>

            {/* UPLOAD */}
            <div className="upload-section">

            <h3>
                Upload Bukti Pembayaran
            </h3>
            <label className="upload-box">

                <input
              type="file"
              hidden
              onChange={(e) => {

                setSelectedFile(
                  e.target.files[0]
                );

                setUploadSuccess(false);

              }
            }
            />

                <div className="upload-icon">
                ☁️
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

            <button
            className="checkout-btn"
            onClick={handleCheckout}
            >
            ✔ Konfirmasi Pesanan
            </button>

          </div>

        </div>

      </div>
    </>
  );
}