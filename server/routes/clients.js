const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const auth = require("../middleware/auth");

// ✅ Add client
router.post("/add", auth, (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO clients (user_id, name, email, phone) VALUES (?, ?, ?, ?)",
    [userId, name, email, phone],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ success: true, clientId: result.insertId });
    }
  );
});

// ✅ Get clients of logged-in user
router.get("/my", auth, (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM clients WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
});


// ✅ Update client
router.put("/:id", auth, (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;
  const { name, email, phone } = req.body;

  db.query(
    "UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ? AND user_id = ?",
    [name, email, phone, clientId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Client not found or unauthorized" });
      }

      res.json({ success: true, message: "Client updated successfully" });
    }
  );
});



// ✅ Delete client
router.delete("/:id", auth, (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;

  db.query(
    "DELETE FROM clients WHERE id = ? AND user_id = ?",
    [clientId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Client not found or unauthorized" });
      }

      res.json({ success: true, message: "Client deleted successfully" });
    }
  );
});


module.exports = router;
