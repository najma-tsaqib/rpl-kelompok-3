import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import "../styles/Home.css";
import heroImage from "../assets/nyam.png";

function Home({ isLogin, role }) {

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Semua Produk");

  useEffect(() => {

    fetch("http://localhost/UDLestari/products.php")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });

  }, []);

  const categories = [
    "Semua Produk",
    ...new Set(products.map((item) => item.kategori))
  ];

const filteredProducts = products.filter((item) => {

  const matchCategory =
    selectedCategory === "Semua Produk" ||
    item.kategori === selectedCategory;

  const matchSearch =
    item.nama_produk
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return matchCategory && matchSearch;

});


  return (

    <div className="home-page">

      <Navbar
        isLogin={isLogin}
        role={role}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* HERO */}
      <section className="home-hero">

        <div className="home-hero-left">

          <div className="hero-badge">
            Produk Premium & Segar
          </div>

          <h1>
            Belanja Ayam Potong
            <br />
            Segar Langsung dari
            <br />
            Lestari Store
          </h1>

          <p>
            Daging segar, higienis dan berkualitas
            untuk keluarga sehat setiap hari.
          </p>

        </div>

        <div className="home-hero-right">

        <img
        src={heroImage}
        alt="ayam"
        />
        </div>

      </section>

      {/* CONTENT */}
      <div className="home-content">

        {/* SIDEBAR */}
        <div className="home-sidebar">

          <h3>Kategori Produk</h3>

          <div className="home-category-list">

            {categories.map((category) => (

              <button
                key={category}
                className={`home-category-btn ${
                  selectedCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>

            ))}

          </div>

          <div className="store-info">

            <h4>Info Toko</h4>

            <p>🕒 06.00 - 17.00</p>
            <p>📍 Pasar Lokal Lestari</p>
            <p>📞 0812-3456-7890</p>

          </div>

        </div>

        {/* MAIN */}
        <div className="home-main">

          {/* PROMO */}
          <div className="promo-grid">

            <div className="promo-card blue">

              <span>Produk Unggulan</span>

              <h2>Ayam 1 Ekor Utuh</h2>

              <h1>Rp50.000/kg</h1>

            </div>
          
          </div>

          {/* TITLE */}
          <div className="home-section-title">

            <h2>
              Produk <span>Terlaris</span>
            </h2>

          </div>

          {/* PRODUCTS */}
          <div className="home-products-grid">

            {filteredProducts.map((item) => (

              <div
                className="home-product-card"
                key={item.id_produk}
              >

                <div className="home-product-image">

                  <img
                    src={item.foto}
                    alt={item.nama_produk}
                  />

                </div>

                <div className="home-product-body">

                  <h3>
                    {item.nama_produk}
                  </h3>

                  <span>
                    {item.nama_produk
                      .toLowerCase()
                      .includes("ekor")
                      ? "per ekor"
                      : "per kg"}
                  </span>

                  <div className="home-product-price">

                    Rp{item.harga.toLocaleString()}

                    <small>
                      {item.nama_produk
                        .toLowerCase()
                        .includes("ekor")
                        ? "/ekor"
                        : "/kg"}
                    </small>

                  </div>

                  <button className="home-cart-btn">

                    <i className="fas fa-cart-plus"></i>

                    Tambah Keranjang

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="home-footer">

        <div>
          <h2>🐔 LESTARI STORE</h2>
          <p>
            Supplier ayam potong segar terpercaya.
          </p>
        </div>

        <div>
          <h4>Menu</h4>
          <p>Beranda</p>
          <p>Produk</p>
          <p>Pesanan</p>
        </div>

        <div>
          <h4>Kontak</h4>
          <p>📞 0812-3456-7890</p>
          <p>📍 Pasar Lokal Lestari</p>
        </div>

      </footer>

    </div>
  );
}

export default Home;