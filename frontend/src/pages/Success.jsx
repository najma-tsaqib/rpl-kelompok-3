import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import berhasilIcon from "../assets/berhasil.png";
import lihatpesananIcon from "../assets/lihatpesanan.png";
import kembaliIcon from "../assets/kembali.png";

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
        <img src={berhasilIcon} alt="berhasil" />
        </div>

        <h1 className="success-title">
          Pesanan Berhasil!
        </h1>

        <p className="success-desc">
          Pesanan Anda telah berhasil ditempatkan.
          Tim kami akan segera memproses pesanan
          Anda dan menghubungi Anda untuk konfirmasi.
        </p>

        <div className="success-box">

          <div className="success-row">

            <span className="success-label">
              No. Pesanan:
            </span>

            <strong className="success-value">
              #ORD-{String(id).padStart(4, "0")}
            </strong>

          </div>

          <div className="success-row">

            <span className="success-label">
              Status:
            </span>

            <div className="success-status">
              Menunggu Verifikasi
            </div>

          </div>

          <div className="success-row">

            <span className="success-label">
              Total:
            </span>

            <strong className="success-total">
              Rp{Number(total).toLocaleString("id-ID")}
            </strong>

          </div>

        </div>

        <div className="success-actions">

          <button
            className="success-btn-primary"
            onClick={() => navigate("/orders")}
          >
            <img src={lihatpesananIcon} alt="lihat pesanan" /> Lihat Pesanan
          </button>

          <button
            className="success-btn-secondary"
            onClick={() => navigate("/customer")}
          >
            <img src={kembaliIcon} alt="kembali" /> Kembali
          </button>

        </div>

      </div>

    </div>
  );
}