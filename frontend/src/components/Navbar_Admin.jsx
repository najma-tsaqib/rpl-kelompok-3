import "../styles/Navbar_Admin.css";

function Navbar() {
  return (
    <div className="nav">
      <div className="left">
        <img src="/src/assets/LOGO.png" alt="" />
        <div>
          <h4>LESTARI STORE</h4>
          <p>Ayam Potong Premium</p>
        </div>
      </div>

      <div className="right">
        <button className="back">← Kembali ke Toko</button>
        <div className="avatar">A</div>
      </div>
    </div>
  );
}

export default Navbar;