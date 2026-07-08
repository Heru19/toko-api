// db.js
// File ini khusus mengurus koneksi ke database
// Dipisah supaya semua file lain tinggal import dari sini
// tanpa perlu nulis konfigurasi koneksi berulang-ulang

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl diperlukan untuk koneksi ke Railway dari luar
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;
// module.exports → "ekspor" pool supaya bisa diimport file lain
// caranya: const pool = require("../db")