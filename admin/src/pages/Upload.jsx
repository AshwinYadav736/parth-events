
import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Upload.css";

export default function Upload() {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setProgress(0);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      // STEP 1: Upload to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("upload_preset", "admin_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dedjgox5n/auto/upload",
        cloudData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      // STEP 2: Save metadata to backend
      await axios.post(
        "https://parth-events.onrender.com/api/gallery",
        {
          url: cloudRes.data.secure_url,
          public_id: cloudRes.data.public_id,
          type: cloudRes.data.resource_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      handleRemove();
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <h1>Upload Media</h1>
      <p>Add new images or videos to the gallery</p>

      <div className="upload-card">
        {!file && (
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        )}

        {preview && (
          <div className="preview-box">
            <button className="remove-btn" onClick={handleRemove}>
              ✕
            </button>

            {file.type.startsWith("video") ? (
              <video src={preview} />
            ) : (
              <img src={preview} alt="Preview" />
            )}
          </div>
        )}

        {uploading && (
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
        )}

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? `Uploading ${progress}%` : "Upload"}
        </button>
      </div>

      {success && (
        <div className="success-modal">
          <div className="success-box">
            <h3>Uploaded Successfully 🎉</h3>
            <button onClick={() => setSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
