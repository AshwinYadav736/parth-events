import express from "express";
import Lead from "../models/Lead.js";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CREATE LEAD (PUBLIC)
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Lead.create({ name, email, phone });

    res.status(201).json({ message: "Lead saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   GET ALL LEADS (ADMIN)
========================= */
router.get("/", protect, superAdminOnly, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
