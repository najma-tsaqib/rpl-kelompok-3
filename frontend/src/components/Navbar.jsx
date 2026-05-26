import { useNavigate, useLocation } from "react-router-dom";

import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({
  isLogin,
  role,
  searchTerm,
  setSearchTerm
}) {

  const navigate = useNavigate();
  const location = useLocation();
  const showSearch =
    location.pathname === "/" ||
    location.pathname === "/customer" ||
    location.pathname === "/cart";

  const cart =
  JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const totalCart = cart.reduce(
    (acc, item) => acc + item.qty,
    0
  );
  
  const user =
  JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn = !!user;

  const userRole =
    user?.role || null;


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
        value={searchTerm || ""}
        onChange={(e) => setSearchTerm?.(e.target.value)}
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
        {!isLoggedIn  && (
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
        {isLoggedIn && userRole === "customer" && (
          <>

            <span
              className="nav-link"
              onClick={() => navigate("/orders")}
            >
              Pesanan
            </span>

            <div
              className="cart-btn"
              onClick={() => navigate("/cart")}
            >

              <i className="fas fa-shopping-cart"></i>

            <div className="cart-badge">
              {totalCart}
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