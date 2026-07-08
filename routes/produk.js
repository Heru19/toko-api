// routes/produk.js
// Berisi semua route yang berhubungan dengan produk

const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifikasiToken = require("../middleware/auth");

// GET semua produk (publik, tidak perlu token)
router.get("/", async (req, res) => {
  const hasil = await pool.query("SELECT * FROM produk");
  res.json(hasil.rows);
});

// GET produk by ID (publik)
router.get("/:id", async (req, res) => {
  const hasil = await pool.query(
    "SELECT * FROM produk WHERE id = $1", [req.params.id]
  );
  if (hasil.rows.length > 0) {
    res.json(hasil.rows[0]);
  } else {
    res.status(404).json({ pesan: "Produk tidak ditemukan" });
  }
});

// POST tambah produk (butuh token)
router.post("/", verifikasiToken, async (req, res) => {
  const { nama, harga } = req.body;

  if (!nama || !harga) {
    return res.status(400).json({ pesan: "Nama dan harga wajib diisi" });
  }
  if (isNaN(harga)) {
    return res.status(400).json({ pesan: "Harga harus berupa angka" });
  }

  const cek = await pool.query(
    "SELECT * FROM produk WHERE LOWER(nama) = LOWER($1)", [nama]
  );
  if (cek.rows.length > 0) {
    return res.status(400).json({ pesan: "Produk dengan nama ini sudah ada" });
  }

  const hasil = await pool.query(
    "INSERT INTO produk (nama, harga) VALUES ($1, $2) RETURNING *",
    [nama, harga]
  );
  res.status(201).json(hasil.rows[0]);
});

// PUT update produk (butuh token)
router.put("/:id", verifikasiToken, async (req, res) => {
  const { nama, harga } = req.body;

  if (!nama || !harga) {
    return res.status(400).json({ pesan: "Nama dan harga wajib diisi" });
  }

  const hasil = await pool.query(
    "UPDATE produk SET nama = $1, harga = $2 WHERE id = $3 RETURNING *",
    [nama, harga, req.params.id]
  );
  if (hasil.rows.length > 0) {
    res.json(hasil.rows[0]);
  } else {
    res.status(404).json({ pesan: "Produk tidak ditemukan" });
  }
});

// DELETE hapus produk (butuh token)
router.delete("/:id", verifikasiToken, async (req, res) => {
  const hasil = await pool.query(
    "DELETE FROM produk WHERE id = $1 RETURNING *", [req.params.id]
  );
  if (hasil.rows.length > 0) {
    res.json({ pesan: "Produk berhasil dihapus", produk: hasil.rows[0] });
  } else {
    res.status(404).json({ pesan: "Produk tidak ditemukan" });
  }
});

module.exports = router;