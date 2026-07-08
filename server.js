// server.js
// File utama yang menyatukan semua bagian

const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const produkRoutes = require("./routes/produk");

// Daftarkan routes ke app
// Semua route di authRoutes akan diawali /auth
// Semua route di produkRoutes akan diawali /produk
app.use("/auth", authRoutes);
app.use("/produk", produkRoutes);

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});