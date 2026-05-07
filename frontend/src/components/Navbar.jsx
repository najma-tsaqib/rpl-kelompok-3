import { useNavigate, useLocation } from "react-router-dom";

import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ isLogin, role }) {

  const navigate = useNavigate();
  const location = useLocation();
const showSearch =
  location.pathname === "/" ||
  location.pathname === "/customer";
  return (

    <nav className="navbar">

      {/* LEFT */}
      <div className="navbar-brand">

        <div className="navbar-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="navbar-title">
          LESTARI STORE
          <span>Ayam Potong Premium</span>
        </div>

      </div>


{/* SEARCH */}
    {showSearch && (
      <div className="navbar-search">

        <input
          type="text"
          placeholder="Cari produk ayam..."
        />

        <button>
          <i className="fas fa-search"></i>
        </button>

      </div>
    )}

      {/* RIGHT */}
      <div className="navbar-nav">

        <span
          className="nav-link"
          onClick={() => navigate("/")}
        >
          Beranda
        </span>

        <span
          className="nav-link"
          onClick={() => navigate("/customer")}
        >
          Produk
        </span>

        {/* BELUM LOGIN */}
        {!isLogin && (
          <>

            <button
              className="btn-nav-outline"
              onClick={() => navigate("/login")}
            >
              Masuk
            </button>
            
            <button
              className="btn-nav-solid"
              onClick={() => navigate("/register")}
            >
              Daftar
            </button>

          </>
        )}

        {/* CUSTOMER LOGIN */}
        {isLogin && role === "customer" && (
          <>

            <span className="nav-link">
              Pesanan
            </span>

            <div className="cart-btn">

              <i className="fas fa-shopping-cart"></i>

              <div className="cart-badge">
                2
              </div>

            </div>

            <div className="profile-circle">
              T
            </div>

          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;