import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/Login.css";

import logo from "./assets/logo.png";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  

const handleSendOTP = async () => {

  if (!username.trim()) {

    alert("Username wajib diisi");
    return;

  }

  const res = await fetch(
    "http://203.194.115.52/forgot_password.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username
      })
    }
  );

  const data = await res.json();

  if (data.status === "success") {

    navigate("/verify-otp", {
      state: {
        username
      }
    });

  } else {

    alert(data.message);

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

        <h1>Lupa Password?</h1>

        <p>
          Masukkan username Anda untuk mengatur ulang password.
        </p>

        <input
          type="text"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <button onClick={handleSendOTP}>
          Lanjutkan
        </button>

      </div>

    </div>
  );
}