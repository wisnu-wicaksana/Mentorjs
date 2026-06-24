const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Semua route di bawah ini wajib dilewati middleware authenticateToken
router.use(authenticateToken);

// 1. Mendapatkan semua daftar sesi belajar milik user
router.get('/', historyController.getSessions);

// 2. Membuat sesi belajar baru
router.post('/', historyController.createSession);

// 3. Mendapatkan detail isi sesi belajar berdasarkan ID
router.get('/:sessionId', historyController.getSessionById);

// 4. Memperbarui kode terakhir di editor untuk sesi tertentu
router.put('/:sessionId/code', historyController.updateSessionCode);

// 5. Menghapus sesi belajar tertentu
router.delete('/:sessionId', historyController.deleteSession);

module.exports = router;
