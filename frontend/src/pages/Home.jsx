import "./Home.css";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { images } from "../assets/resource";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  /* ===============================
     CONTACT STATE
  =============================== */
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const openWhatsApp = (userData = null) => {
    let message;

    if (userData) {
      message = `
Hello Parth Events 👋

Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone}

I am interested in your decoration services.
Please share quotation and available dates.
      `;
    } else {
      message = `
Hello Parth Events 👋

I am interested in your decoration services.
Please share quotation and available dates.
      `;
    }

    const encoded = encodeURIComponent(message);

    window.open(
      `https://wa.me/919619624040?text=${encoded}`,
      "_blank"
    );
  };

  const handleContactClick = () => {
    const hasSubmitted = localStorage.getItem("hasSubmittedContact");

    if (hasSubmitted) {
      openWhatsApp();
    } else {
      setContactOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeContact = () => {
    setContactOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleContactSubmit = async () => {
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    const userData = { name, email, phone };

    try {
      await fetch("https://parth-events.onrender.com/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Lead save failed");
    }

    localStorage.setItem("hasSubmittedContact", "true");

    setName("");
    setEmail("");
    setPhone("");

    closeContact();
    openWhatsApp(userData);
  };

  /* ===============================
     GALLERY STATE
  =============================== */
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  /* ===============================
     LIGHTBOX STATE
  =============================== */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  /* ===============================
     KEYBOARD SUPPORT
  =============================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxOpen && e.key === "Escape") closeLightbox();
      if (contactOpen && e.key === "Escape") closeContact();

      if (!lightboxOpen) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, contactOpen]);

  /* ===============================
     DELAY GALLERY
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGallery(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /* ===============================
     FETCH LATEST IMAGES
  =============================== */
  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const res = await fetch(
          "https://parth-events.onrender.com/api/gallery?type=image&page=1&limit=12"
        );
        const data = await res.json();
        const imageUrls = data.files.map((file) => file.url);
        setGalleryImages(imageUrls);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLatestImages();
  }, []);

  /* ===============================
     STABLE MASONRY RESIZE (FIXED)
  =============================== */
  useEffect(() => {
    if (!showGallery) return;

    const resizeAllGridItems = () => {
      const grid = document.querySelector(".masonry-grid");
      if (!grid) return;

      const rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
      );
      const rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue("gap")
      );

      const allItems = document.querySelectorAll(".masonry-item");

      allItems.forEach((item) => {
        const img = item.querySelector("img");
        if (!img || !img.complete) return;

        const itemHeight = img.getBoundingClientRect().height;
        if (itemHeight === 0) return;

        const rowSpan = Math.ceil(
          (itemHeight + rowGap) / (rowHeight + rowGap)
        );

        item.style.gridRowEnd = `span ${rowSpan}`;
      });
    };

    const imagesList = document.querySelectorAll(".masonry-item img");

    imagesList.forEach((img) => {
      img.addEventListener("load", resizeAllGridItems);
    });

    window.addEventListener("resize", resizeAllGridItems);
    resizeAllGridItems();

    return () => {
      window.removeEventListener("resize", resizeAllGridItems);
    };
  }, [showGallery, galleryImages]);

  return (
    <div
      className="home-bg"
      style={{ backgroundImage: `url(${images.partyBackground})` }}
    >
      {/* HERO */}
      <div className="hero-content">
        <h2>Turning Your Moments Into Magical Celebrations</h2>
        <p>
          From beautiful decorations to seating arrangements, entertainment,
          and special kids’ party attractions like magic shows — we take care
          of everything needed to make your event unforgettable.
        </p>
      </div>

      {/* CONTENT */}
      <div className="content-section">
        <h3 className="section-title">
          Decorations for Every Special Moment
        </h3>

        <div className="card-grid">
          <Card image={images.valentine} title="Valentines Decorations" />
          <Card image={images.room} title="Room Decorations" />
          <Card image={images.firstNight} title="First Night Decorations" />
          <Card image={images.anniversary} title="Anniversary Decorations" />
          <Card image={images.haldi} title="Haldi Decorations" />
          <Card image={images.mothersDay} title="Mother's Day Decorations" />
          <Card image={images.fathersDay} title="Father's Day Decorations" />
          <Card image={images.pet} title="Pet Decorations" />
          <Card image={images.retirement} title="Retirement Decorations" />
          <Card image={images.babyShower} title="Baby Shower Decorations" />
          <Card image={images.welcomeBaby} title="Welcome Baby" />
          <Card image={images.naming} title="Naming Ceremony" />
        </div>

        <div className="contact-quote-wrapper">
          <button
            className="view-more-btn"
            onClick={handleContactClick}
          >
            Contact for Quotation
          </button>
        </div>
      </div>

      {/* GALLERY PREVIEW */}
      {showGallery && (
        <div className="gallery-preview">
          <h3 className="section-title">Latest Celebrations</h3>

          <div className="masonry-grid">
            {galleryImages.map((img, index) => (
              <div
                className="masonry-item"
                key={index}
                onClick={() => openLightbox(index)}
              >
                <div className="image-wrapper">
                  <div className="skeleton"></div>
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    onLoad={(e) => {
                      e.target.classList.add("loaded");
                      const skeleton =
                        e.target.previousElementSibling;
                      if (skeleton) skeleton.style.display = "none";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="view-more-wrapper">
            <button
              className="view-more-btn"
              onClick={() => navigate("/gallery")}
            >
              View More
            </button>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>

            <button className="lightbox-btn left" onClick={prevImage}>
              ❮
            </button>

            <img
              src={galleryImages[currentIndex]}
              alt=""
              className="lightbox-image"
            />

            <button className="lightbox-btn right" onClick={nextImage}>
              ❯
            </button>
          </div>
        </div>
      )}

      {/* CONTACT LIGHTBOX */}
      {contactOpen && (
        <div className="lightbox-overlay" onClick={closeContact}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeContact}>
              ✕
            </button>

            <div className="contact-form-container">
              <h3>Request Quotation</h3>

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                className="submit-quote-btn"
                onClick={handleContactSubmit}
              >
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
