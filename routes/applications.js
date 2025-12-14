// routes/applications.js
import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware – works with lowercase "authorization" header
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

// POST – Apply to job (only once)
router.post("/applications", auth, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students" });

  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ message: "jobId required" });

  try {
    const [existing] = await pool.query(
      "SELECT 1 FROM applications WHERE student_id = ? AND job_id = ?",
      [req.user.id, jobId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already applied!" });
    }

    await pool.query(
      "INSERT INTO applications (student_id, job_id) VALUES (?, ?)",
      [req.user.id, jobId]
    );

    res.json({ message: "Applied successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

// GET – Employer sees applicants + student_id
router.get("/jobs/:jobId/applicants", auth, async (req, res) => {
  const { jobId } = req.params;

  try {
    const [jobRows] = await pool.query("SELECT employer_id FROM jobs WHERE id = ?", [jobId]);
    if (jobRows.length === 0) return res.status(404).json({ message: "Job not found" });

    const isOwner = jobRows[0].employer_id === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    const [applicants] = await pool.query(`
      SELECT 
        u.id AS student_id,
        COALESCE(p.full_name, u.name) AS name,
        u.email,
        a.applied_at
      FROM applications a
      JOIN users u ON a.student_id = u.id
      LEFT JOIN portfolios p ON u.id = p.user_id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `, [jobId]);

    res.json(applicants);
  } catch (err) {
    console.error("Get applicants error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE – Student cancels application
router.delete("/applications/:jobId", auth, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Forbidden" });

  const jobId = parseInt(req.params.jobId);
  if (isNaN(jobId)) return res.status(400).json({ message: "Invalid job ID" });

  try {
    const [result] = await pool.query(
      "DELETE FROM applications WHERE student_id = ? AND job_id = ?",
      [req.user.id, jobId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application cancelled" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;