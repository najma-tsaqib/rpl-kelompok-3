import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import "./styles/Login.css";

import logo from "./assets/logo.png";

export default function VerifyOTP() {

  const navigate = useNavigate();

  const location = useLocation();

  const handleChange = (value, index) => {

  if (isNaN(value)) return;

  const newOtp = [...otp];

  newOtp[index] = value;

  setOtp(newOtp);

  if (
    value &&
    index < 5
  ) {

    document
      .getElementById(
        `otp-${index + 1}`
      )
      .focus();

  }
};

    const username =
    location.state?.username || "";

    const [otp, setOtp] = useState(
    ["", "", "", "", "", ""]
    );

    const otpValue = otp.join("");

  const handleVerify = async () => {

    const res = await fetch(
      "http://203.194.115.52verify_otp.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        username,
        otp: otpValue
        })
      }
    );

    const data = await res.json();

    if (data.status === "success") {

      navigate("/reset-password", {
        state: {
            username
        }
        });

    } else {

      alert("OTP Salah");

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

        <h1>Masukkan Kode OTP</h1>

        <p>
          Kode OTP telah dikirim ke WhatsApp Anda
        </p>

        <div className="otp-container">

  {otp.map((data, index) => (

    <input
      key={index}
      id={`otp-${index}`}
      type="text"
      maxLength="1"
      value={data}
      onChange={(e) =>
        handleChange(
          e.target.value,
          index
        )
      }
      className="otp-input"
    />

  ))}

</div>

        <button onClick={handleVerify}>
          Verifikasi
        </button>

      </div>

    </div>
  );
}