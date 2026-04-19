import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// ------------------- MySQL Connection -------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// ================== AUTH ROUTES ==================

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, contact, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, contact, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, contact, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Server error", error: err });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing up" });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.json({ message: "Login successful", userId: user.id });
  });
});

// ================== OTP ROUTES ==================

// Temporary storage
let otpStorage = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deepdetect2025@gmail.com",
    pass: "wzpt vrpo kylo rogq",
  },
});

// Send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999);
  otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: "deepdetect2025@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP", error: err });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!otpStorage[email]) {
    return res.status(400).json({ success: false, message: "No OTP found. Please request again." });
  }
  const { otp: storedOtp, expiresAt } = otpStorage[email];
  if (Date.now() > expiresAt) {
    delete otpStorage[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }
  if (parseInt(otp) === storedOtp) {
    delete otpStorage[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ================== HISTORY ROUTES ==================

// Add new prediction result
app.post("/predict", (req, res) => {
  const {
    fileName, result, confidence,
    image_url, model, width, height,
    inference_time, fake_prob, real_prob,
    gradcam, fft, face_heatmap,
    prob_chart, confidence_gauge
  } = req.body;

  const id = Date.now();
  const date = new Date();

  const sql = `
    INSERT INTO history 
    (id, fileName, result, confidence, date, image_url, model, width, height, inference_time, fake_prob, real_prob, gradcam, fft, face_heatmap, prob_chart, confidence_gauge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    id, fileName, result, confidence, date,
    image_url, model, width, height,
    inference_time, fake_prob, real_prob,
    gradcam, fft, face_heatmap,
    prob_chart, confidence_gauge
  ], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Full report saved" });
  });
});


// Get all history
app.get("/history", (req, res) => {
  const sql = "SELECT * FROM history ORDER BY date DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch history", error: err });
    res.json(results);
  });
});

// Delete a history entry
app.delete("/history/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM history WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete history", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "History not found" });
    res.json({ message: "History deleted successfully" });
  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
