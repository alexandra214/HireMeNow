import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ message: "Admin only" });
    req.user = payload;
    next();
  } catch { res.status(401).json({ message: "Invalid token" }); }
};

// Get all users
router.get("/users", adminOnly, async (req, res) => {
  const [rows] = await pool.query("SELECT id, name, email, role FROM users");
  res.json(rows);
});

// Delete user
router.delete("/users/:id", adminOnly, async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "User deleted" });
});

// Toggle job active status
router.patch("/jobs/:id", adminOnly, async (req, res) => {
  const { active } = req.body;
  await pool.query("UPDATE jobs SET active = ? WHERE id = ?", [active ? 1 : 0, req.params.id]);
  res.json({ message: "Job updated" });
});

// Delete job
router.delete("/jobs/:id", adminOnly, async (req, res) => {
  await pool.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);
  res.json({ message: "Job deleted" });
});

export default router;