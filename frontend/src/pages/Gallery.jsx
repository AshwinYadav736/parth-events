import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../pages/Home.css";
import "./Gallery.css";
import { images } from "../assets/resource";

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* =========================
     LIGHTBOX STATE
  ========================= */
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const limit = activeTab === "image" ? 15 : 8;

  useEffect(() => {
    fetchGallery(1, true);
  }, [activeTab]);

  const fetchGallery = async (pageNumber, reset = false) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/gallery?type=${activeTab}&page=${pageNumber}&limit=${limit}`
      );
      const data = await res.json();

      if (reset) {
        setFiles(data.files);
      } else {
        setFiles((prev) => [...prev, ...data.files]);
      }

      setHasMore(data.hasMore);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleShowMore = () => {
    fetchGallery(page + 1);
  };

  const handleTabChange = (type) => {
    setActiveTab(type);
    setPage(1);
  };

  /* =========================
     LIGHTBOX FUNCTIONS
  ========================= */

  const openViewer = (index) => {
    setCurrentIndex(index);
    setViewerOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeViewer = () => {
    setViewerOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextMedia = () => {
    setCurrentIndex((prev) =>
      prev === files.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? files.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!viewerOpen) return;

      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, files]);

  return (
    <>
      <div
        className="home-bg"
        style={{
          backgroundImage: `url(${images.partyBackground})`,
        }}
      >
        <div className="content-section">

          {/* HEADER */}
          <div className="gallery-header">
            <h3 className="section-title">Full Gallery</h3>

            <div className="gallery-tabs">
              <button
                className={activeTab === "image" ? "tab-btn active" : "tab-btn"}
                onClick={() => handleTabChange("image")}
              >
                Images
              </button>

              <button
                className={activeTab === "video" ? "tab-btn active" : "tab-btn"}
                onClick={() => handleTabChange("video")}
              >
                Videos
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="masonry">
            {files.map((file, index) => (
              <div
                key={file._id}
                className="masonry-item"
                onClick={() => openViewer(index)}
              >
                {file.type === "image" ? (
                  <img src={file.url} alt="" />
                ) : (
                  <video src={file.url} />
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="show-more-container">
              <button className="show-more-btn" onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================
         PORTAL LIGHTBOX
      ========================= */}
      {viewerOpen &&
        createPortal(
          <div className="gallery-viewer-overlay" onClick={closeViewer}>
            <div
              className="gallery-viewer-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="viewer-close" onClick={closeViewer}>
                ✕
              </button>

              <button className="viewer-btn left" onClick={prevMedia}>
                ❮
              </button>

              {files[currentIndex].type === "image" ? (
                <img
                  src={files[currentIndex].url}
                  alt=""
                  className="viewer-media"
                />
              ) : (
                <video
                  src={files[currentIndex].url}
                  controls
                  autoPlay
                  className="viewer-media"
                />
              )}

              <button className="viewer-btn right" onClick={nextMedia}>
                ❯
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
