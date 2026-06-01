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

    fetch("http://203.194.115.52/products.php")
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

const addToCart = (product) => {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  if (!user) {

    alert("Silakan login dulu");

    window.location.href = "/login";

    return;
  }

  const cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  const existing = cart.find(
    (item) => item.id_produk === product.id_produk
  );

if (existing) {

  if (existing.qty >= product.stok) {

    alert("Stok tidak cukup");

    return;

  }

  existing.qty += 1;

} else {

    cart.push({
      ...product,
      qty: 1
    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  alert("Produk masuk keranjang");
};


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

  <div className="sidebar-logout">

  <button
    className="logout-btn"
    onClick={() => {

      localStorage.removeItem("isLogin");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      sessionStorage.clear();

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

                <button
                  className={`product-cart-btn ${
                    item.stok <= 0 ? "disabled" : ""
                  }`}
                  onClick={() => addToCart(item)}
                  disabled={item.stok <= 0}
                >

                  <i className="fas fa-cart-plus"></i>

                  {item.stok <= 0
                    ? "Stok Habis"
                    : "Tambah"}

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