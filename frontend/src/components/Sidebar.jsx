import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Sidebar.css';
import logo from "../assets/LOGO.png";

export default function Sidebar({ currentPage, setCurrentPage, setIsLogin }) {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'orders', label: 'Pesanan'},
        { id: 'products', label: 'Produk'},
        { id: 'payment', label: 'Pembayaran'},
      ]
    },
    {
      label: 'LAPORAN',
      items: [
        { id: 'sales', label: 'Laporan Penjualan'},
        { id: 'financial', label: 'Keuangan' },
      ]
    },
    {
      label: 'PENGATURAN',
      items: [
        { id: 'customers', label: 'Pelanggan'},
      ]
      
    }
    
  ];

const handleLogout = async () => {
  try {
    await fetch("http://203.194.115.52logout.php");

    setIsLogin(false);

    /* CLEAR SEMUA LOGIN */
    localStorage.clear();
    sessionStorage.clear();

    navigate("/");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="sidebar">
      <div className="sidebar-header">
    <div className="logo">
      <div className="logo-img">
        <img src={logo} alt="logo" />
      </div>

      <div className="logo-text-group">
        <span className="logo-title">LESTARI STORE</span>
        <span className="logo-sub">Admin Panel</span>
      </div>
</div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((section, idx) => (
          <div key={idx} className="nav-section">
            <h3 className="nav-section-title">{section.label}</h3>
            <ul className="nav-items">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-label">Keluar</span>
        </button>
      </div>
    </div>
  );
}