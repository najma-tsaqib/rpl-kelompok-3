import React, { useState } from 'react';
import "../styles/Stock.css"; 

export default function Stock() {
  const [stock, setStock] = useState([
    { id: '#PRD-0000', name: '🐔 Ayam 1 Ekor', category: 'ayam-potong', current: 45, minimum: 10, unit: 'ekor', status: 'Aman' },
    { id: '#PRD-0001', name: '🍗 Kepala Ayam', category: 'kepala', current: 60, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0002', name: '🥩 Daging Ayam', category: 'daging', current: 80, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0003', name: '🦶 Ceker Ayam', category: 'ceker', current: 70, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0004', name: '🍖 Ayam Fillet', category: 'fillet', current: 35, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0005', name: '🦴 Tulang Ayam', category: 'tulang', current: 90, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0006', name: '❤️ Hati Ayam', category: 'jeroan', current: 40, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0007', name: '🫀 Ati Ampela', category: 'jeroan', current: 50, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0008', name: '🍗 Sayap Ayam', category: 'ayam-potong', current: 55, minimum: 10, unit: 'kg', status: 'Aman' },
    { id: '#PRD-0009', name: '🍗 Paha Ayam', category: 'ayam-potong', current: 65, minimum: 10, unit: 'kg', status: 'Aman' }
  ]);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');

  const handleUpdateStock = (id) => {
    setSelectedProduct(id);
    setShowUpdateForm(true);
  };

  const handleSaveStock = () => {
    if (newStock && selectedProduct) {
      setStock(stock.map(item =>
        item.id === selectedProduct
          ? { ...item, current: parseInt(newStock) }
          : item
      ));
      setShowUpdateForm(false);
      setNewStock('');
      setSelectedProduct(null);
    }
  };

  const getLowStockStatus = (current, minimum) => {
    if (current <= minimum) return 'Rendah';
    if (current <= minimum * 2) return 'Perhatian';
    return 'Aman';
  };

  const stockStats = {
    total: stock.reduce((sum, item) => sum + item.current, 0),
    products: stock.length,
    lowStock: stock.filter(item => getLowStockStatus(item.current, item.minimum) !== 'Aman').length
  };

  return (
    <div className="stock-page">
      <div className="page-header">
        <h1 className="page-title">Manajemen Stok</h1>
        <p className="page-subtitle">Pantau dan perbarui stok produk secara realtime</p>
      </div>

      {/* Stock Stats */}
      <div className="stock-stats">
        <div className="stat-box">
          <div className="stat-number">{stockStats.total}</div>
          <div className="stat-label">Total Stok</div>
          <div className="stat-unit">kg</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{stockStats.products}</div>
          <div className="stat-label">Jenis Produk</div>
        </div>
        <div className="stat-box warning">
          <div className="stat-number">{stockStats.lowStock}</div>
          <div className="stat-label">Stok Rendah</div>
        </div>
      </div>

      {/* Update Stock Form */}
      {showUpdateForm && (
        <div className="card update-form">
          <div className="form-header">
            <h3>Update Stok Produk</h3>
            <button 
              className="close-btn"
              onClick={() => setShowUpdateForm(false)}
            >
              ✕
            </button>
          </div>
          <div className="form-group">
            <label>Stok Baru (kg)</label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Masukkan jumlah stok baru"
            />
          </div>
          <div className="form-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowUpdateForm(false)}
            >
              Batal
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveStock}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Status Stok Produk</h2>
        </div>

        <div className="stock-grid">
          {stock.map((item) => {
            const status = getLowStockStatus(item.current, item.minimum);
            const percentage = (item.current / (item.minimum * 10)) * 100;
            
            return (
              <div key={item.id} className={`stock-card status-${status.toLowerCase()}`}>
                <div className="stock-header">
                  <h3 className="stock-name">{item.name}</h3>
                  <span className="stock-id">{item.id}</span>
                </div>

                <div className="stock-content">
                  <div className="stock-row">
                    <span className="label">Kategori:</span>
                    <span className="value">{item.category}</span>
                  </div>
                  <div className="stock-row">
                    <span className="label">Stok:</span>
                    <span className="value stock-current">{item.current} {item.unit}</span>
                  </div>
                  <div className="stock-row">
                    <span className="label">Minimum:</span>
                    <span className="value">{item.minimum} {item.unit}</span>
                  </div>

                  <div className="stock-meter">
                    <div className="meter-bar">
                      <div
                        className={`meter-fill status-${status.toLowerCase()}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="meter-label">{percentage.toFixed(0)}%</span>
                  </div>

                  <div className="stock-status">
                    <span className={`badge status-${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="stock-actions">
                  <button
                    className="action-btn update"
                    onClick={() => handleUpdateStock(item.id)}
                  >
                    Update Stok
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock Legend */}
      <div className="card legend-card">
        <h3>📋 Keterangan Status Stok</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-badge aman"></span>
            <span>Aman - Stok cukup dan aman</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge perhatian"></span>
            <span>Perhatian - Stok mulai berkurang</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge rendah"></span>
            <span>Rendah - Perlu segera ditambah</span>
          </div>
        </div>
      </div>
    </div>
  );
}