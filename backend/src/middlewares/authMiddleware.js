const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Ambil token dari cookie 'token'
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses ditolak. Silakan login terlebih dahulu untuk mengakses fitur ini.',
    });
  }

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan data user (berisi payload { id }) ke request object
    next(); // Lanjutkan ke handler berikutnya
  } catch (error) {
    console.error('Error verifikasi token JWT:', error.message);
    return res.status(403).json({
      status: 'error',
      message: 'Sesi Anda telah kedaluwarsa atau token tidak valid. Silakan login kembali.',
    });
  }
};

module.exports = {
  authenticateToken,
};
