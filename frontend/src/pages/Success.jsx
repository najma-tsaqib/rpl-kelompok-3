import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Success.css";

export default function Success() {

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const id = params.get("id");
  const total = params.get("total");

  return (

    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">
          ✅
        </div>

        <h1>
          Pesanan Berhasil!
        </h1>

        <p>
          Pesanan Anda berhasil dibuat
          dan sedang menunggu verifikasi admin.
        </p>

        <div className="success-box">

          <div className="success-row">
            <span>No. Pesanan</span>
            <strong>
              #ORD-{String(id).padStart(4, "0")}
            </strong>
          </div>

          <div className="success-row">
            <span>Status</span>
            <div className="pending-badge">
              Pending
            </div>
          </div>

          <div className="success-row">
            <span>Total</span>
            <strong className="success-total">
              Rp{Number(total).toLocaleString("id-ID")}
            </strong>
          </div>

        </div>

        <div className="success-actions">

          <button
            className="success-btn primary"
            onClick={() => navigate("/customer")}
          >
            Kembali Belanja
          </button>

          <button
            className="success-btn secondary"
            onClick={() => navigate("/orders")}
          >
            Lihat Pesanan
          </button>

        </div>

      </div>

    </div>
  );
}