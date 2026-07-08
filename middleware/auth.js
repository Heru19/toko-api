require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifikasiToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ pesan: "Token tidak ditemukan" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ pesan: "Token tidak valid atau expired" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifikasiToken;