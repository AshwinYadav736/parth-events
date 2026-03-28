import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   REGISTER ADMIN
========================= */

router.post("/register", protect, superAdminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    res.status(201).json({ message: "Admin created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   GET ALL ADMINS (Superadmin)
========================= */

router.get("/", protect, superAdminOnly, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   DELETE ADMIN (Superadmin)
========================= */

router.delete("/:id", protect, superAdminOnly, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
