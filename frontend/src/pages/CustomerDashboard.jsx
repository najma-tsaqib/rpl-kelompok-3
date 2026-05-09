import { useEffect, useState } from "react";
import "../styles/CustomerDashboard.css";
import Navbar from "../components/Navbar";

export default function CustomerDashboard({
  isLogin,
  role
}) {

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  useEffect(() => {

    fetch("http://localhost/UDLestari/products.php")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));

  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const getEmoji = (nama) => {
  const n = nama.toLowerCase();

  if (n.includes("ayam 1 ekor")) return "🐔";
  if (n.includes("daging")) return "🥩";
  if (n.includes("ceker")) return "🦶";
  if (n.includes("tulang")) return "🦴";
  if (n.includes("fillet")) return "🍗";
  if (n.includes("ati")) return "🫀";
  if (n.includes("usus")) return "🌀";

  return "📦";
};

const filteredProducts = products.filter((item) => {

  const cocokKategori =
    selectedCategory === "Semua" ||
    item.kategori === selectedCategory;

  const cocokSearch =
    item.nama_produk
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return cocokKategori && cocokSearch;
});

const categories = [
  "Semua",
  ...new Set(products.map((item) => item.kategori))
];

  return (
    <>
      <Navbar
        isLogin={isLogin}
        role={role}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="customer-container">

<div className="customer-sidebar">

  <div>

    <h3 className="sidebar-title">
      Filter Kategori
    </h3>

    <div className="category-list">

      {categories.map((category) => (

        <button
          key={category}
          className={`category-btn ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>

      ))}

    </div>

  </div>

  {/* FOOTER */}
  <div className="customer-sidebar-footer">

    <button
      className="customer-logout-btn"
      onClick={() => {

        localStorage.removeItem("isLogin");
        localStorage.removeItem("role");

        window.location.href = "/";

      }}
    >
      <i className="fas fa-sign-out-alt"></i>
      Logout
    </button>

  </div>
</div>

        <div className="customer-content">

          <div className="content-header">

            <div>
              <h1>
                Daftar <span>Produk</span>
              </h1>

              <p>
                Menampilkan produk terbaru
              </p>
            </div>

          </div>

          <div className="product-grid">

            {filteredProducts.map((item) => (

              <div className="product-card" key={item.id_produk}>

                <div className="product-image">

                <div className="product-category">
                    {item.kategori}
                </div>

                {item.foto ? (
                    <img
                    src={item.foto}
                    alt={item.nama_produk}
                    className="product-img"
                    />
                ) : (
                    <span className="product-emoji">
                    {getEmoji(item.kategori)}
                    </span>
                )}

                </div>

                <div className="product-body">

                  <h3 className="product-name">
                    {item.nama_produk}
                  </h3>

                <div className="product-unit">
                {item.nama_produk.toLowerCase().includes("ekor")
                    ? "per ekor"
                    : "per kg"}
                </div>

                <div className="product-price">
                Rp{item.harga.toLocaleString()}
                <span>
                    {item.nama_produk.toLowerCase().includes("ekor")
                    ? "/ekor"
                    : "/kg"}
                </span>
                </div>

                  <button className="product-cart-btn">
                    <i className="fas fa-cart-plus"></i>
                    Tambah
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </>
  );
}