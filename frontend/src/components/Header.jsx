import React from 'react';
import '../styles/Header.css';
import logo from '../assets/LOGO.png';

export default function Header({ toggleSidebar, setCurrentPage }) {
  return (
    <div className="header">
      <div className="header-left">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="navbar-title">
            LESTARI STORE
            <span>Ayam Potong Premium</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          className="back-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          ← Kembali ke Toko
        </button>

        <div className="profile-btn">A</div>
      </div>
    </div>
  );
}