import "../pages/Home.css";   // reuse background + overlay
import { images } from "../assets/resource";

export default function Contact() {
  return (
    <div
      className="home-bg"
      style={{
        backgroundImage: `url(${images.partyBackground})`,
      }}
    >
      <div className="content-section">
        <h3 className="section-title">Contact Us</h3>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Phone: +91 96196 24040
        </p>

        <p style={{ textAlign: "center" }}>
          Email: mailparthevents@gmail.com
        </p>
      </div>
    </div>
  );
}
