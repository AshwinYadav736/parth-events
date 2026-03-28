import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { images } from "../assets/resource";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* ===============================
     HOME CLICK LOGIC
  =============================== */
  const handleHomeClick = () => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      // If already on home → scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // If you REALLY want reload instead, use:
      // window.location.reload();
    } else {
      navigate("/");
    }
  };

  /* ===============================
     ABOUT SCROLL LOGIC
  =============================== */
  const handleAboutClick = () => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .querySelector(".content-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document
        .querySelector(".content-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ===============================
     SIMPLE PAGE NAVIGATION
  =============================== */
  const goToPage = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-left" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
          <img src={images.logo} className="logo" alt="logo" />
          <h1>PARTH EVENTS</h1>
        </div>

        {/* Desktop Menu */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={handleHomeClick}>Home</li>
          <li onClick={handleAboutClick}>About</li>
          <li onClick={() => goToPage("/gallery")}>Gallery</li>
          <li onClick={() => goToPage("/contact")}>Contact</li>
        </ul>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </div>
  );
}
