const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Ambil token dari cookie 'token'
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Please sign in to access this resource.',
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
      message: 'Your session has expired or the token is invalid. Please sign in again.',
    });
  }
};

// Middleware opsional: Tidak memblokir request jika pengguna belum login
const optionalAuthenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Lanjutkan request sebagai tamu (guest) tanpa req.user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach data user jika token terbukti valid
    next();
  } catch (error) {
    // Abaikan token yang expired/tidak valid, lanjut sebagai tamu
    console.warn('Token opsional tidak valid:', error.message);
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuthenticateToken
};
