// db.js
// File ini khusus mengurus koneksi ke database
// Dipisah supaya semua file lain tinggal import dari sini
// tanpa perlu nulis konfigurasi koneksi berulang-ulang

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = pool;
// module.exports → "ekspor" pool supaya bisa diimport file lain
// caranya: const pool = require("../db")