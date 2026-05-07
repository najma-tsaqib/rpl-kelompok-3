import React from "react";
import "../styles/Admin.css";
import Navbar_Admin from "../components/Navbar_Admin";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import SalesChart from "../components/SalesChart";
import OrderTable from "../components/OrderTable";

function Admin() {
  return (
    <div className="admin-container">
      <Navbar_Admin />
      <div className="admin-body">
        <Sidebar />
        <main className="dashboard">
          <h2>LESTARI STORE – Ayam Potong Premium</h2>
          <div className="cards">
            <Card title="Total Pesanan" value="48" change="+12% dari kemarin" />
            <Card title="Pendapatan Hari Ini" value="Rp2,4jt" change="+8% dari kemarin" />
            <Card title="Stok Tersisa" value="324 kg" change="↓5% dari minggu lalu" />
            <Card title="Total Pelanggan" value="156" change="+3 baru hari ini" />
          </div>
          <div className="chart-section">
            <SalesChart />
            <div className="best-products">
              <h3>Produk Terlaris</h3>
              <ul>
                <li>Ayam 1 Ekor – 85%</li>
                <li>Daging Ayam – 70%</li>
                <li>Ceker Ayam – 55%</li>
                <li>Tulang Ayam – 40%</li>
              </ul>
            </div>
          </div>
          <OrderTable />
        </main>
      </div>
    </div>
  );
}

export default Admin;
