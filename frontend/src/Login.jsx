import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/Login.css";

import Navbar from "./components/Navbar";
import logo from "./assets/logo.png";

function Login({
  setIsLogin,
  setRole,
  isLogin,
  role
}) {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] =
  useState(false);

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await fetch(
        "http://localhost/UDLestari/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem(
        "isLogin",
        "true"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role: data.role
        })
      );

      localStorage.setItem(
        "role",
        data.role
      );

        setIsLogin(true);
        setRole(data.role);

        // ADMIN
        if (data.role === "admin") {
          navigate("/admin");
        }

        // CUSTOMER
        else {
          navigate("/customer");
        }

      } else {

        alert("Username atau password salah");

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    }
  };

  return (
    <>

      <Navbar
        isLogin={isLogin}
        role={role}
      />

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-logo">

            <div className="auth-logo-icon">
              <img src={logo} alt="logo" />
            </div>

            <div className="auth-logo-text">
              <strong>LESTARI STORE</strong>
              <span>Ayam Potong Premium</span>
            </div>

          </div>

          <div className="auth-title">
            Selamat Datang Kembali!
          </div>

          <div className="auth-subtitle">
            Masuk untuk melanjutkan belanja ayam segar di Lestari Store
          </div>

          {/* USERNAME */}
          <div className="form-group">

            <label className="form-label">
              Username
            </label>

            <div className="input-icon">

              <i className="fas fa-user"></i>

              <input
                type="text"
                className="form-input"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label className="form-label">
              Password
            </label>

            <div className="input-icon">

              <i className="fas fa-lock"></i>

              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "18px",
            }}
          >

            <label
              style={{
                display: "flex",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />
              Ingat saya
            </label>

            <a
              style={{
                color: "#1E90FF",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate("/forgot-password")
              }
            >
              Lupa password?
            </a>

          </div>

          {/* LOGIN BUTTON */}
          <button
            className="btn-primary"
            onClick={handleLogin}
          >
            <i className="fas fa-sign-in-alt"></i>
            {" "}Login to Continue
          </button>

          <div className="auth-switch">

            Belum punya akun?

            <span
              style={{
                color: "#1E90FF",
                cursor: "pointer",
              }}
              onClick={() => navigate("/register")}
            >
              {" "}Daftar sekarang
            </span>

          </div>

        </div>

      </div>

    </>
  );
}

export default Login;