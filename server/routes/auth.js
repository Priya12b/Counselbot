const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// 📌 Register
router.post("/register", async (req, res) => {
  console.log("📩 Register route hit with data:", req.body);
  const { name, email, password, role, firm_name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  let firmId = null;

  if (role === "admin") {
    // admin = create new firm
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO firms (name) VALUES (?)",
        [firm_name],
        (err, result) => {
          if (err) return reject(err);
          firmId = result.insertId;
          resolve();
        }
      );
    });
  } else if (role === "lawyer" && firm_name) {
    // lawyer must join existing firm
    const rows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM firms WHERE name = ?",
        [firm_name],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    if (!rows.length)
      return res.status(400).json({ error: "Firm not found. Ask admin to create it." });
    firmId = rows[0].id;
  } else if (role === "client" && firm_name) {
    // optional firm join for client
    const rows = await new Promise((resolve, reject) => {
      db.query("SELECT id FROM firms WHERE name = ?", [firm_name], (err, r) =>
        err ? reject(err) : resolve(r)
      );
    });
    if (rows.length) firmId = rows[0].id; // silently ignore if not found
  }

  db.query(
    "INSERT INTO users (name, email, password, role, firm_id) VALUES (?, ?, ?, ?,?)",
    [name, email, hashed, role || "client", firmId],
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

  db.query(`SELECT u.id, u.name, u.email, u.password, u.role, u.firm_id, f.name AS firm_name
   FROM users u
   LEFT JOIN firms f ON u.firm_id = f.id
   WHERE u.email = ?`, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, firm_id: user.firm_id }, // 🎯 add role + firm
      JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id,
        firm_name: user.firm_name
      },
    });
  });
});

module.exports = router;
