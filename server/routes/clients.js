const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const { authMiddleware, requireRole } = require("../middleware/auth");

// ✅ Add client
router.post("/add", authMiddleware, requireRole("admin", "lawyer"), (req, res) => {

  const { name, email, phone } = req.body;
  const { id: userId, firm_id, role } = req.user;

  db.query(
    "INSERT INTO clients (user_id, name, email, phone, firm_id, added_by_user_id) VALUES (?, ?, ?, ?, ?, ? )",
    [userId, name, email, phone, firm_id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      // 🔗 if the creator is a lawyer, auto‑assign the client to them
      if (role === "lawyer") {
        db.query(
          "INSERT INTO client_assignments (client_id, lawyer_id) VALUES (?, ?)",
          [result.insertId, userId]
        );
      }
      res.json({ success: true, clientId: result.insertId });

    }
  );
});


// 🔸 helper: returns a promise that resolves true/false
function canAccessClient(user, clientId) {
  return new Promise((resolve, reject) => {
    const { id: userId, role } = user;

    if (role === "admin") {
      // admin can access any client in same firm
      db.query(
        "SELECT 1 FROM clients WHERE id = ? AND firm_id = ? LIMIT 1",
        [clientId, user.firm_id],
        (err, rows) => (err ? reject(err) : resolve(rows.length > 0))
      );
    } else if (role === "lawyer") {
      // lawyer only if assigned
      db.query(
        "SELECT 1 FROM client_assignments WHERE client_id = ? AND lawyer_id = ? LIMIT 1",
        [clientId, userId],
        (err, rows) => (err ? reject(err) : resolve(rows.length > 0))
      );
    } else {
      // client only if the record is themselves
      resolve(false);
    }
  });
}


// ✅ Get clients of logged-in user
router.get("/my", authMiddleware, (req, res) => {
  const { id: userId, role, firm_id } = req.user;

  let sql, params;

  if (role === "admin") {
    sql = "SELECT * FROM clients WHERE firm_id = ? AND (added_by_user_id IS NULL OR added_by_user_id = ?)";
    params = [firm_id, userId];
  } else if (role === "lawyer") {
    sql = `
      SELECT c.*
      FROM clients c
      JOIN client_assignments a ON a.client_id = c.id
      WHERE a.lawyer_id = ?
    `;
    params = [userId];
  } else {
    // role === 'client'
    sql = "SELECT * FROM clients WHERE user_id = ?";
    params = [userId];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);

  });
});


// ✅ Update client
router.put("/:id", authMiddleware, async (req, res) => {
  const clientId = req.params.id;

  // 🔐 check permission
  if (!(await canAccessClient(req.user, clientId))) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { name, email, phone } = req.body;
  db.query(
    "UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, clientId],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error", err });
      res.json({ success: true, msg: "Client updated" });
    }
  );
});

// ✅ Delete client
router.delete("/:id", authMiddleware, async (req, res) => {
  const clientId = req.params.id;
  if (!(await canAccessClient(req.user, clientId))) {
    return res.status(403).json({ error: "Access denied" });
  }

  db.query("DELETE FROM clients WHERE id = ?", [clientId], (err) => {
    if (err) return res.status(500).json({ message: "DB error", err });
    res.json({ success: true, msg: "Client deleted" });
  });
});


//Assign Clients to Lawyer
router.post("/assign", authMiddleware, requireRole("admin"), (req, res) => {
  const { client_id, lawyer_id } = req.body;
  const { firm_id } = req.user;

  // make sure both belong to admin's firm
  db.query(
    `SELECT * FROM clients WHERE id = ? AND firm_id = ?`,
    [client_id, firm_id],
    (err, cRows) => {
      if (err) return res.status(500).json({ message: "DB error", err });
      if (!cRows.length) return res.status(400).json({ error: "Client not in your firm" });
      
      db.query(
        `SELECT 1 FROM users WHERE id = ? AND role = 'lawyer' AND firm_id = ?`,
        [lawyer_id, firm_id],
        (err, lRows) => {
          if (err) return res.status(500).json({ message: "DB error", err });
          if (!lRows.length) return res.status(400).json({ error: "Lawyer not in your firm" });

          // insert or replace assignment
          db.query(
            `REPLACE INTO client_assignments (client_id, lawyer_id) VALUES (?, ?)`,
            [client_id, lawyer_id],
            (err) => {
              if (err) return res.status(500).json({ message: "DB error", err });
              res.json({ success: true, msg: "Client assigned" });
            }
          );
        }
      );
    }
  );
}
);



module.exports = router;
