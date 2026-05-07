export default function OrdersTable({
  orders = [],
  variant = "dashboard",
  showHeader = true
}) {

  const getStatusBadgeClass = (status) => {
    if (status === 'Pending') return 'badge-warning';
    if (status === 'Dikonfirmasi') return 'badge-info';
    if (status === 'Selesai') return 'badge-success';
    return '';
  };

  return (
    <div className={`orders-container ${variant}`}>
      
      {showHeader && (
        <div className="card-header orders-header">
          <h2 className="card-title">Pesanan Terbaru</h2>
          <a href="#" className="lihat-btn">Lihat Semua</a>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>NO. PESANAN</th>
              <th>PELANGGAN</th>
              <th>PRODUK</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Tidak ada data
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={idx}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>

                  <td className="order-total">
                    Rp{Number(order.total).toLocaleString()}
                  </td>

                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.status === "Pending" && (
                      <button className="action-btn btn-success">
                        Konfirmasi
                      </button>
                    )}
                    <button className="action-btn btn-primary">
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}