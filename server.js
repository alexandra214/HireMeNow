import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import jobRoutes from "./routes/jobs.js";
import profileRoutes from "./routes/profile.js";
import { pool } from "./db.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
import applicationsRoutes from "./routes/applications.js";
import portfolioRoutes from "./routes/portfolio.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => res.send("🚀 HireMeNow API running"));

app.use("/api/auth", authRoutes);
app.use("/api/auth", registerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", studentRoutes);
app.use("/api", applicationsRoutes);
app.use("/api/portfolio", portfolioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
