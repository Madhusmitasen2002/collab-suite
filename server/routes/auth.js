import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // ensure this path is correct

const router = express.Router();

const JWT_EXPIRES_MS = 24 * 60 * 60 * 1000; // 1 day

// Helper to create token
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
        console.log("Incoming signup:", { name, email, password });
        const testDB = await pool.query("SELECT NOW()");
    console.log("DB connection successful:", testDB.rows[0]);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 1) Check if user exists
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Insert into DB
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // 4) Create JWT and set as cookie
    const token = createToken({ id: user.id });

    // cookie options: secure must be true on prod for SameSite=None
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: JWT_EXPIRES_MS,
    };

    res.cookie("token", token, cookieOptions);

    // send user (no token in body)
    res.json({ user });
  } catch (err) {
    console.error("Signup error:", err.stack || err);
    res.status(500).json({ error: err.message || "Unexpected error"});
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken({ id: user.id });
    const isProd = process.env.NODE_ENV === "production" || process.env.RENDER; // add this
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  maxAge: JWT_EXPIRES_MS,
};

    res.cookie("token", token, cookieOptions);

    delete user.password;
    res.json({ user });
  } catch (err) {
    console.error("Login error:", err.stack || err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/testdb", async (req, res) => {
  try {
    const now = await pool.query("SELECT NOW()");
    res.json({ now: now.rows[0] });
  } catch (err) {
    console.error("Test DB error:", err);
    res.status(500).json({ error: "DB test failed" });
  }
});


export default router;
