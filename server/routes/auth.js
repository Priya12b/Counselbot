const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// 📌 Register
router.post("/register", async (req, res) => {
  console.log("📩 Register route hit with data:", req.body);
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Error registering user" });
      }
      res.json({ success: true, userId: result.insertId });
    }
  );
});

// 📌 Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

module.exports = router;
