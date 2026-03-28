import express from "express";
import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   SAVE METADATA (PROTECTED)
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const { url, public_id, type } = req.body;

    if (!url || !public_id || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFile = await Gallery.create({
      url,
      public_id,
      type,
    });

    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   GET PUBLIC (NO PROTECTION)
========================= */
router.get("/", async (req, res) => {
  try {
    const type = req.query.type || "image";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const files = await Gallery.find({ type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Gallery.countDocuments({ type });

    res.json({
      files,
      total,
      hasMore: skip + files.length < total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   DELETE (PROTECTED)
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const file = await Gallery.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.type,
    });

    await file.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
