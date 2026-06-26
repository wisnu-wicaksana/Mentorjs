const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Route registrasi pengguna baru
router.post('/register', authController.registerUser);

// Route login pengguna
router.post('/login', authController.loginUser);

// Route verifikasi OTP
router.post('/verify-otp', authController.verifyOTP);

// Route kirim ulang OTP
router.post('/resend-otp', authController.resendOTP);

// Route logout pengguna
router.post('/logout', authenticateToken, authController.logoutUser);

// Route untuk mendapatkan profil pengguna saat ini
router.get('/me', authenticateToken, authController.getUserProfile);

module.exports = router;
