import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./GalleryManager.css";

export default function GalleryManager() {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, [activeTab]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://parth-events.onrender.com/api/gallery?type=${activeTab}&page=1&limit=100`
      );
      const data = await res.json();
      setFiles(data.files);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?"))
      return;

    try {
      const res = await fetch(
        `https://parth-events.onrender.com/api/gallery/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="gallery-manager">
      <h2 className="gallery-title">Gallery Manager</h2>

      <div className="gallery-tabs">
        <button
          className={activeTab === "image" ? "active" : ""}
          onClick={() => setActiveTab("image")}
        >
          Images
        </button>

        <button
          className={activeTab === "video" ? "active" : ""}
          onClick={() => setActiveTab("video")}
        >
          Videos
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="gallery-grid">
          {files.map((file) => (
            <div key={file._id} className="gallery-card">
              {file.type === "image" ? (
                <img src={file.url} alt="" />
              ) : (
                <video src={file.url} />
              )}

              <button
                className="delete-btn"
                onClick={() => handleDelete(file._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
