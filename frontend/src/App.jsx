import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerDashboard from "./pages/CustomerDashboard";

import "./App.css";

// components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Payment from "./pages/Payment";
import SalesReport from "./pages/SalesReport";
import FinancialReport from "./pages/FinancialReport";
import Customers from "./pages/Customer";
import Stock from "./pages/Stock";
import Register from "./pages/Register"; // 🔥 INI PENTING (bukan ./Register)
import Cart from "./pages/Cart";
import Success from "./pages/Success";

// auth
import Login from "./Login";

function App() {
  const [isLogin, setIsLogin] = useState(
  localStorage.getItem("isLogin") === "true"
);

const [role, setRole] = useState(
  localStorage.getItem("role") || ""
);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      case "payment":
        return <Payment />;
      case "sales":
        return <SalesReport />;
      case "financial":
        return <FinancialReport />;
      case "customers":
        return <Customers />;
      case "stock":
        return <Stock />;
      default:
        return <Dashboard />;
    }
  };

  
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 HOME */}
        <Route
          path="/"
          element={
            <Home
              isLogin={isLogin}
              role={role}
            />
          }
        />

        {/* 🔐 LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setIsLogin={setIsLogin}
              setRole={setRole}
              isLogin={isLogin}
              role={role}
            />
          }
        />

        {/* 📝 REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* 🧑‍💼 ADMIN */}
        <Route
          path="/admin"
          element={
            isLogin ? (
              <div className="app-container">
              <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setIsLogin={setIsLogin} // 🔥 tambah ini
              />
                <div className="main-content">
                  <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  />
                  <div className="page-content">{renderPage()}</div>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/customer"
          element={
            <CustomerDashboard
              isLogin={isLogin}
              role={role}
            />
          }
        />

        <Route
        path="/cart"
        element={
          <Cart
            isLogin={isLogin}
            role={role}
          />
        }
      />

      <Route
        path="/checkout"
        element={
          <Payment
            isLogin={isLogin}
            role={role}
          />
        }
      />

          <Route
      path="/success"
      element={
        <Success
          isLogin={isLogin}
          role={role}
        />
      }
    />
      </Routes>
    </BrowserRouter>
  );
}

export default App;