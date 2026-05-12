import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import "./styles/Login.css";

import logo from "./assets/logo.png";

export default function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

    const username =
    location.state?.username || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {

    if (password !== confirmPassword) {

      alert("Password tidak cocok");
      return;

    }

    const res = await fetch(
      "http://localhost/UDLestari/reset_password.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        username,
        password
        })
      }
    );

    const data = await res.json();

    if (data.status === "success") {

      alert("Password berhasil diubah");

      navigate("/login");

    }
  };

  return (

    <div className="forgot-page">

      <div className="forgot-card">

        <div className="forgot-logo">

          <img src={logo} alt="" />

          <div>
            <h2>LESTARI STORE</h2>
            <p>Ayam Potong Premium</p>
          </div>

        </div>

        <h1>Buat Password Baru</h1>

        <p>
          Masukkan password baru untuk akun Anda.
        </p>

        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button onClick={handleReset}>
          Simpan Password Baru
        </button>

      </div>

    </div>
  );
}