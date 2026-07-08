// routes/auth.js
// Berisi semua route yang berhubungan dengan autentikasi
require("dotenv").config();
const express = require("express");
const router = express.Router();
// Router → seperti "mini express" khusus untuk sekumpulan route
// Nanti digabungkan ke server.js utama

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
// "../db" → naik satu folder (keluar dari routes/) lalu ambil db.js

const SECRET_KEY = process.env.SECRET_KEY;

// POST /register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ pesan: "Username dan password wajib diisi" });
  }

  const cek = await pool.query(
    "SELECT * FROM users WHERE username = $1", [username]
  );
  if (cek.rows.length > 0) {
    return res.status(400).json({ pesan: "Username sudah dipakai" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hasil = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
    [username, hashedPassword]
  );

  res.status(201).json({ pesan: "Register berhasil", user: hasil.rows[0] });
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ pesan: "Username dan password wajib diisi" });
  }

  const hasil = await pool.query(
    "SELECT * FROM users WHERE username = $1", [username]
  );
  if (hasil.rows.length === 0) {
    return res.status(401).json({ pesan: "Username atau password salah" });
  }

  const user = hasil.rows[0];
  const passwordCocok = await bcrypt.compare(password, user.password);
  if (!passwordCocok) {
    return res.status(401).json({ pesan: "Username atau password salah" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ pesan: "Login berhasil", token });
});

module.exports = router;