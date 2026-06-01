import React, { useState } from 'react';
import { useEffect } from "react";
import '../styles/Products.css';

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  
console.log("POST KEKIRIM");

useEffect(() => {

  fetchProducts();

  const interval = setInterval(() => {

    fetchProducts();

  }, 2000);

  return () => clearInterval(interval);

}, []);

  const [formData, setFormData] = useState({
    name: '',
    category: 'ayam-potong',
    price: '',
    stock: '',
    description: '',
    foto: null   // 🔥 TAMBAH INI
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [loading, setLoading] = useState(false);

const handleAddProduct = () => {
  const form = new FormData();

  form.append("nama", formData.name);
  form.append("kategori", formData.category);
  form.append("harga", formData.price);
  form.append("stok", formData.stock);
  if (formData.foto) {
  form.append("foto", formData.foto);
  }; // 🔥 file masuk sini

  console.log(formData.foto);

  fetch("http://203.194.115.52/products.php", {
    method: "POST",
    body: form   // ❗ jangan pakai JSON lagi
  })
  
  .then(res => res.json())
  .then(() => {
    fetchProducts();
    setShowForm(false);
  });
};

const handleUpdateProduct = () => {
  const form = new FormData();

  form.append("id_produk", selectedProduct.id_produk);
  form.append("nama", selectedProduct.nama_produk);
  form.append("kategori", selectedProduct.kategori);
  form.append("harga", selectedProduct.harga);
  form.append("stok", selectedProduct.stok);

  if (selectedProduct.foto instanceof File) {
    form.append("foto", selectedProduct.foto);
  } else {
    form.append("foto_lama", selectedProduct.foto);
  }

  fetch("http://203.194.115.52/products.php", {
    method: "POST", // 🔥 ubah jadi POST
    body: form
  })
  .then(res => res.json())
  .then(() => {
    setIsEditOpen(false);
    fetchProducts();
  });
};

const handleDeleteProduct = (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) {
    return;
  }
  fetch("http://203.194.115.52/products.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id_produk: id })
  })
    .then(res => res.json())
    .then(() => fetchProducts());
};

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchProducts = () => {
    fetch("http://203.194.115.52/products.php")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data); // debug
        setProducts(data);
      });
  };

  const categories = [
  "ayam potong",
  "daging",
  "jeroan",
  "kepala",
  "ceker",
  "tulang",
  "fillet"
];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Manajemen Produk</h1>
        <p className="page-subtitle">Kelola daftar produk, harga, dan stok</p>
      </div>

      <div className="card">
      <div className="card-header">
        <h2 className="card-title">Daftar Produk</h2>

        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari produk..." />
          </div>

          <button className="btn-add" onClick={() => setShowForm(true)}>
            + Tambah Produk
          </button>
        </div>
      </div>
        {isEditOpen && selectedProduct && (
      <div className="modal-overlay">
        <div className="modal-card">

          <h3>Edit Produk</h3>

<input
  value={selectedProduct.nama_produk}
  onChange={(e) =>
    setSelectedProduct({
      ...selectedProduct,
      nama_produk: e.target.value
    })
  }
/>

<select
  value={selectedProduct.kategori}
  onChange={(e) =>
    setSelectedProduct({
      ...selectedProduct,
      kategori: e.target.value
    })
  }
>
  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </option>
  ))}
</select>

<input
  type="number"
  value={selectedProduct.stok}
  onChange={(e) =>
    setSelectedProduct({
      ...selectedProduct,
      stok: e.target.value
    })
  }
/>

<input
  value={selectedProduct.harga}
  onChange={(e) =>
    setSelectedProduct({
      ...selectedProduct,
      harga: e.target.value
    })
  }
/>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        foto: e.target.files[0]
      })
    }
  />

          <div className="modal-actions">
            <button onClick={() => setIsEditOpen(false)}>Batal</button>
            <button onClick={handleUpdateProduct}>Simpan</button>
          </div>

        </div>
      </div>
    )}
      

        {showForm && (
          <div className="form-container">
            <div className="form-group">
              <label>Nama Produk</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: Ayam 1 Ekor"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Harga/kg</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Rp50.000"
                />
              </div>
              <div className="form-group">
                <label>Stok (kg)</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi produk..."
              ></textarea>
            </div>
            <div className="form-group">
            <label>Link Gambar (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  foto: e.target.files[0]   // 🔥 ambil file, bukan string
                }));
              }}
            />
          </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleAddProduct}>+ Tambah Produk</button>
            </div>
          </div>
        )}

<table className="products-table">
  <thead>
    <tr>
      <th>PRODUK</th>
      <th>KATEGORI</th>
      <th>HARGA/KG</th>
      <th>STOK</th>
      <th>STATUS</th>
      <th>AKSI</th>
    </tr>
  </thead>

  <tbody>
    {products.map((product) => (
      <tr key={product.id_produk}>
        
<td>
  <div className="product-cell">

    {product.foto ? (
      <img
        src={product.foto}
        alt={product.nama_produk}
        className="product-img"
      />
    ) : (
        <span className="product-emoji">
          📦
        </span>
    )}

    <div>
      <div className="product-name">
        {product.nama_produk}
      </div>
      <div className="product-id">
        #PRD-{String(product.id_produk).padStart(4, "0")}
      </div>
    </div>

  </div>
</td>

        <td>
          <span className="badge badge-info">{product.kategori}</span>
        </td>

        <td className="price">Rp{product.harga}</td>

        <td>{product.stok} kg</td>

        <td>
          <span className="badge badge-success">{product.status}</span>
        </td>

        <td className="action-cell">
          <button
              className="btn-edit"
              onClick={() => {
                setSelectedProduct(product);
                setIsEditOpen(true);
              }}
            >
              Edit
            </button>
          <button 
            className="btn-delete"
            onClick={() => handleDeleteProduct(product.id_produk)}
          >
            Hapus
          </button>
        </td>

      </tr>
    ))}
  </tbody>
</table>
    </div>
        </div>
  );
}
