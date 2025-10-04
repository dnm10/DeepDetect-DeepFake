import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
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

// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, contact, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, contact, password) VALUES (?, ?, ?, ?)";
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

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", userId: user.id });
  });
});

// ================== OTP ROUTES ==================

// Temporary storage (better use DB/Redis)
let otpStorage = {};

// Configure transporter (sender email)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deepdetect2025@gmail.com",    // sender email
    pass: "wzpt vrpo kylo rogq"          // app password
  }
});

// Step 1: Send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999);

  otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: "deepdetect2025@gmail.com",  // must match sender
      to: email,                         // recipient = user email
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP", error: err });
  }
});

// Step 2: Verify OTP
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

// ================== START SERVER ==================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
