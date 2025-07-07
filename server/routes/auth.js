const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// 📌 Register
// router.post("/register", async (req, res) => {
//   console.log("📩 Register route hit with data:", req.body);
//   const { name, email, password, role, firm_name } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   let firmId = null;

//   if (role === "admin") {
//     // admin = create new firm
//     await new Promise((resolve, reject) => {
//       db.query(
//         "INSERT INTO firms (name) VALUES (?)",
//         [firm_name],
//         (err, result) => {
//           if (err) return reject(err);
//           firmId = result.insertId;
//           resolve();
//         }
//       );
//     });
//   } else if (role === "lawyer" && firm_name) {
//     // lawyer must join existing firm
//     const rows = await new Promise((resolve, reject) => {
//       db.query(
//         "SELECT id FROM firms WHERE name = ?",
//         [firm_name],
//         (err, rows) => (err ? reject(err) : resolve(rows))
//       );
//     });
//     if (!rows.length)
//       return res.status(400).json({ error: "Firm not found. Ask admin to create it." });
//     firmId = rows[0].id;
//   } else if (role === "client" && firm_name) {
//     const insertClient = `
//     INSERT INTO clients (user_id, name, email, firm_id)
//     VALUES (?, ?, ?, ?)
//   `;
//   db.query(
//     insertClient,
//     [result.insertId, name, email, firm_id || null],
//     (err) => {
//       if (err) {
//         console.error("❌ Failed to auto-create client entry:", err);
//         // not returning error to client — allow login to proceed
//       }
//     }
//   );
//     // optional firm join for client
//     const rows = await new Promise((resolve, reject) => {
//       db.query("SELECT id FROM firms WHERE name = ?", [firm_name], (err, r) =>
//         err ? reject(err) : resolve(r)
//       );
//     });
//     if (rows.length) firmId = rows[0].id; // silently ignore if not found
//   }

//   db.query(
//     "INSERT INTO users (name, email, password, role, firm_id) VALUES (?, ?, ?, ?,?)",
//     [name, email, hashed, role || "client", firmId],
//     (err, result) => {
//       if (err) {
//         if (err.code === "ER_DUP_ENTRY") {
//           return res.status(400).json({ message: "Email already registered" });
//         }
//         return res.status(500).json({ message: "Error registering user" });
//       }
//       res.json({ success: true, userId: result.insertId });
//     }
//   );
// });
router.post("/register", async (req, res) => {
  console.log("📩 Register route hit with data:", req.body);
  const { name, email, password, role, firm_name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  let firmId = null;

  // 1. 🏢 Admin creates a new firm
  if (role === "admin") {
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
  }

  // 2. 👨‍⚖️ Lawyer joins existing firm
  else if (role === "lawyer" && firm_name) {
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
  }

  // 3. 👤 Client optionally joins a firm
  else if (role === "client" && firm_name) {
    const rows = await new Promise((resolve, reject) => {
      db.query("SELECT id FROM firms WHERE name = ?", [firm_name], (err, r) =>
        err ? reject(err) : resolve(r)
      );
    });
    if (rows.length) firmId = rows[0].id; // silently ignore if not found
  }

  // 4. 👤 Create user
  db.query(
    "INSERT INTO users (name, email, password, role, firm_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashed, role || "client", firmId],
    async (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Error registering user" });
      }

      const userId = result.insertId;

      // 5. ✅ Updated "find-or-link" logic for clients
     // 5️⃣ If the new user is a CLIENT …
if (role === "client") {
  // A. find existing client record by email
  const rows = await new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM clients WHERE email = ? LIMIT 1",
      [email],
      (e, r) => (e ? reject(e) : resolve(r))
    );
  });

  if (rows.length) {
    // 🔗 link that record to this new user
    db.query(
      "UPDATE clients SET user_id = ? WHERE id = ?",
      [userId, rows[0].id],
      (err) => {
        if (err) console.error("Link client->user failed", err);
      }
    );
  } else {
    // ➕ create fresh client row
    db.query(
      "INSERT INTO clients (user_id, name, email, firm_id) VALUES (?,?,?,?)",
      [userId, name, email, firmId || null],
      (err) => {
        if (err) console.error("Auto‑create client failed", err);
      }
    );
  }
}


      res.json({ success: true, userId });
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
