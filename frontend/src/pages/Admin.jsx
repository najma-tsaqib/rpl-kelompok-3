import React, {
  useState,
  useEffect
} from "react";

import "../styles/Admin.css";

import Navbar_Admin from "../components/Navbar_Admin";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import SalesChart from "../components/SalesChart";
import OrderTable from "../components/OrderTable";

function Admin() {

  const [summary, setSummary] = useState({

    orders: 0,
    income: 0,
    stock: 0,
    customers: 0

  });

  /* FETCH DASHBOARD */
  useEffect(() => {

    fetch(
      "http://203.194.115.52dashboard_summary.php"
    )
      .then((res) => res.json())

      .then((data) => {

        console.log(data);

        setSummary(data);

      })

      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (

    <div className="admin-container">

      <Navbar_Admin />

      <div className="admin-body">

        <Sidebar />

        <main className="dashboard">

          <h2>
            Dashboard
          </h2>

          <p className="dashboard-subtitle">
            Selamat datang, Admin!
            Berikut ringkasan aktivitas toko hari ini.
          </p>

          {/* CARDS */}
          <div className="cards">

            <Card
              title="Total Pesanan"
              value={summary.orders}
            />

            <Card
              title="Stok Tersisa"
              value={`${summary.stock} kg`}
            />

            <Card
              title="Total Pelanggan"
              value={summary.customers}
            />

            <Card
              title="Pendapatan Hari Ini"
              value={`Rp${Number(summary.income)
                .toLocaleString("id-ID")}`}
            />

          </div>

          {/* CHART */}
          <div className="chart-section">

            <SalesChart />

            <div className="best-products">

              <h3>
                Produk Terlaris
              </h3>

              <ul>

                <li>
                  Ayam 1 Ekor
                </li>

                <li>
                  Daging Ayam
                </li>

                <li>
                  Ceker Ayam
                </li>

                <li>
                  Tulang Ayam
                </li>

              </ul>

            </div>

          </div>

          {/* TABLE */}
          <OrderTable />

        </main>

      </div>

    </div>
  );
}

export default Admin;