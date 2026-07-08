// db.js
// File ini khusus mengurus koneksi ke database
// Dipisah supaya semua file lain tinggal import dari sini
// tanpa perlu nulis konfigurasi koneksi berulang-ulang

require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

module.exports = pool;
// module.exports → "ekspor" pool supaya bisa diimport file lain
// caranya: const pool = require("../db")