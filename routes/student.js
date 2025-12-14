import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const auth = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  const token = header?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/student/applications", auth, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Forbidden" });

  try {
    const [rows] = await pool.query(`
      SELECT j.*, a.job_id, a.applied_at
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    console.error("Load applications error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;