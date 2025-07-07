const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const { authMiddleware, requireRole } = require("../middleware/auth");

// GET  /api/users/lawyers  → returns all lawyers in admin's firm
router.get("/lawyers", authMiddleware, requireRole("admin"), (req, res) => {
  db.query(
    "SELECT id, name FROM users WHERE role = 'lawyer' AND firm_id = ?",
    [req.user.firm_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", err });
      res.json(rows);
    }
  );
});

module.exports = router;





// 📩 Register route hit with data: {
//   name: 'kinjal',
//   email: 'kinjal@gmail.com',
//   password: 'kinjal@123',
//   role: 'lawyer',
//   firm_name: 'kinjal'
// }
// 📩 Register route hit with data: {
//   name: 'abc',
//   email: 'abc@gmail.com',
//   password: 'abc@12345',
//   role: 'client',
//   firm_name: 'kinjal'
// }
// 📩 Register route hit with data: {
//   name: 'bhavesh',
//   email: 'bhavesh@gmail.com',
//   password: 'bhavesh@123',
//   role: 'admin',
//   firm_name: 'Bhavesh'
// }
// 📩 Register route hit with data: {
//   name: 'bhavesh1',
//   email: 'bhavesh1@gmail.com',
//   password: 'abc@12345',
//   role: 'lawyer',
//   firm_name: 'Bhavesh'
// }
// 📩 Register route hit with data: {
//   name: 'bhavesh2',
//   email: 'bhavesh2@gmail.com',
//   password: 'abc@12345',
//   role: 'client',
//   firm_name: 'Bhavesh'
// }