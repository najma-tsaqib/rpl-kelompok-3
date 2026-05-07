import React from "react";
import "../styles/Admin.css";

function Card({ title, value, change }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p className="value">{value}</p>
      <span className="change">{change}</span>
    </div>
  );
}

export default Card;
