import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// GET /api/jobs → List all active jobs
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs WHERE active = 1 ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs → Create job (employer only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { title, description, type, salary } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  try {
    await pool.query(
      "INSERT INTO jobs (title, description, type, salary, employer_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, type || null, salary || null, req.user.id]
    );
    res.json({ message: "Job created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/:id → Get single job
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ? AND active = 1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/jobs/:id – employer edits own job
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });

  const [job] = await pool.query("SELECT employer_id FROM jobs WHERE id = ?", [req.params.id]);
  if (job[0]?.employer_id !== req.user.id) return res.status(403).json({ message: "Not your job" });

  const { title, description, type, salary } = req.body;
  await pool.query(
    "UPDATE jobs SET title=?, description=?, type=?, salary=? WHERE id=?",
    [title, description, type || null, salary || null, req.params.id]
  );
  res.json({ message: "Job updated" });
});

export default router;