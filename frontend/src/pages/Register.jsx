import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../styles/Register.css";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {

    if (form.password !== form.confirmPassword) {
      alert("Password tidak cocok");
      return;
    }

    const res = await fetch("http://localhost/UDLestari/register_customer.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: form.username,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("Register berhasil!");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-page">

        <div className="register-card">

          <div className="register-logo">

            <div className="register-logo-icon">
              <img src={logo} alt="logo" />
            </div>

            <div className="register-logo-text">
              <h3>LESTARI STORE</h3>
              <p>Ayam Potong Premium</p>
            </div>

          </div>

          <h1 className="register-title">
            Buat Akun Baru di Lestari Store
          </h1>

          <p className="register-subtitle">
            Daftar sekarang dan nikmati kemudahan belanja ayam segar di Lestari Store
          </p>

          <div className="register-group">
            <label className="register-label">Username</label>
            <input
              className="register-input"
              name="username"
              placeholder="Masukkan username"
              onChange={handleChange}
            />
          </div>

          <div className="register-group">
            <label className="register-label">Nama Lengkap</label>
            <input
              className="register-input"
              name="name"
              placeholder="Masukkan nama lengkap"
              onChange={handleChange}
            />
          </div>

          <div className="register-group">
            <label className="register-label">Email</label>
            <input
              className="register-input"
              name="email"
              placeholder="Masukkan email"
              onChange={handleChange}
            />
          </div>

          <div className="register-group">
            <label className="register-label">No. Telepon</label>
            <input
              className="register-input"
              name="phone"
              placeholder="Masukkan no. telepon"
              onChange={handleChange}
            />
          </div>

          <div className="register-group">
            <label className="register-label">Password</label>
            <input
              type="password"
              className="register-input"
              name="password"
              placeholder="Masukkan password"
              onChange={handleChange}
            />
          </div>

          <div className="register-group">
            <label className="register-label">Konfirmasi Password</label>
            <input
              type="password"
              className="register-input"
              name="confirmPassword"
              placeholder="Ulangi password"
              onChange={handleChange}
            />
          </div>

          <button
            className="register-btn"
            onClick={handleRegister}
          >
            Daftar Sekarang
          </button>

          <div className="register-footer">
            Sudah punya akun?
            <span onClick={() => navigate("/")}>
              {" "}Login
            </span>
          </div>

        </div>

      </div>
    </>
  );
}