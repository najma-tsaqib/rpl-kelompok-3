import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import "../styles/MyOrders.css";

function MyOrders({ isLogin, role }) {

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Semua");

  const user =
    JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    fetch(
      `http://203.194.115.52customer_orders.php?id_customer=${user.id_customer}`
    )
      .then(res => res.json())
      .then(data => setOrders(data));

  }, []);

const normalizeStatus = (status) => {

  const s =
    status?.trim().toLowerCase();

  if (
    s === "pending" ||
    s === "menunggu konfirmasi"
  ) {
    return "menunggu konfirmasi";
  }

  if (s === "dikonfirmasi") {
    return "dikonfirmasi";
  }

  if (s === "selesai") {
    return "selesai";
  }

  return s;
};

const filteredOrders =
  activeTab === "Semua"
    ? orders
    : orders.filter(item => {

        return (
          normalizeStatus(item.status) ===
          activeTab
            .trim()
            .toLowerCase()
        );

      });

const getStatusClass = (status) => {

  const s =
    normalizeStatus(status);

  if (s === "selesai")
    return "success";

  if (s === "dikonfirmasi")
    return "confirm";

  return "pending";
};

  return (
    <>
      <Navbar
        isLogin={isLogin}
        role={role}
      />

      <div className="orders-page">

        <h1>
        Daftar Pesanan Saya
        </h1>

        {/* FILTER */}
        <div className="tabs">

          {[
            "Semua",
            "Menunggu Konfirmasi",
            "Dikonfirmasi",
            "Selesai"
          ].map(tab => (

            <button
              key={tab}
              className={
                activeTab === tab
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(tab)
              }
            >
              {tab}
            </button>

          ))}
        </div>

        {/* LIST */}
        <div className="orders-list">

          {filteredOrders.map(order => (

            <div
              className="order-card"
              key={order.id_pesanan}
            >

              <div className="order-top">

                <div>
                  <h2>
                    #ORD-
                    {String(
                      order.id_pesanan
                    ).padStart(4, "0")}
                  </h2>

                  <p>{order.tanggal}</p>
                </div>

                <div
                  className={`status ${getStatusClass(order.status)}`}
                >
                  {order.status?.trim()}
                </div>
              </div>

              <div className="product-list">

                {order.produk
                  .split(",")
                  .map((item, idx) => (

                    <div
                      className="product-item"
                      key={idx}
                    >
                    {item}
                    </div>

                  ))}
              </div>

              <div className="divider"></div>

              <div className="payment">

                <span>
                  Total Pembayaran
                </span>

                <h3>
                  Rp
                  {Number(
                    order.total
                  ).toLocaleString("id-ID")}
                </h3>
              </div>
            </div>

          ))}
        </div>
      </div>
    </>
  );
}

export default MyOrders;