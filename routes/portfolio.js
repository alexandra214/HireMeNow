import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

// Save / Update portfolio (form data)
router.post("/form", auth, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Students only" });

  const { full_name, email, phone, education, experience, skills, summary } = req.body;

  await pool.query(
    `INSERT INTO portfolios (user_id, full_name, email, phone, education, experience, skills, summary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       full_name=VALUES(full_name), email=VALUES(email), phone=VALUES(phone),
       education=VALUES(education), experience=VALUES(experience),
       skills=VALUES(skills), summary=VALUES(summary)`,
    [req.user.id, full_name, email, phone, education, experience, skills, summary]
  );

  res.json({ message: "Portfolio saved!" });
});

router.get("/form/:userId?", auth, async (req, res) => {
  const targetId = req.params.userId ? parseInt(req.params.userId) : req.user.id;
  
  if (isNaN(targetId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Allow: own portfolio OR employer/admin viewing any student
  if (req.user.id !== targetId && !["employer", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const [rows] = await pool.query("SELECT * FROM portfolios WHERE user_id = ?", [targetId]);
  res.json(rows[0] || null);
});

export default router;