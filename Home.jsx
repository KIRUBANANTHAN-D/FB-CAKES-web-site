import { Link } from "react-router-dom";
import "../styles/home.css";


import callImg from "../assets/callorder.png";
import onlineImg from "../assets/onlineorder.png";
import offerImg from "../assets/cakesoffer.jpg";
import pastryImg from "../assets/fbpastry.jpg";

function Home() {
  console.log("HOME COMPONENT RENDERED");
  return (
    <>
  
      <section className="hero">
        <Link
          to="/contact"
          className="hero-card call-card"
          style={{ backgroundImage: `url(${callImg})` }}
        >
          <div className="hero-overlay">
            <h2>Call & Order Now</h2>
            <p>📞 Quick phone order</p>
          </div>
        </Link>

        <Link
          to="/menu"
          className="hero-card online-card"
          style={{ backgroundImage: `url(${onlineImg})` }}
        >
          <div className="hero-overlay">
            <h2>Online Order</h2>
            <p>🛒 Easy & Fast</p>
          </div>
        </Link>
      </section>

      <section className="menu">
        <Link to="/menu">
          <div
            className="banner offers-banner"
            style={{ backgroundImage: `url(${offerImg})` }}
          ></div>
        </Link>
      </section>

  
      <section className="menu">
        <Link to="/menu">
          <div
            className="banner pastry-banner"
            style={{ backgroundImage: `url(${pastryImg})` }}
          ></div>
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#ffffff",
          color: "#000",
          textAlign: "center",
          padding: "20px",
          marginTop: "40px",
        }}
      >
        <p>© 2025 FB CAKES | Fresh & Delicious Cakes Delivered Free & Fast</p>
      </footer>
    </>
  );
}

export default Home;

