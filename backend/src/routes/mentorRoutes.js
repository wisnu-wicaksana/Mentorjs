const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { optionalAuthenticateToken } = require('../middlewares/authMiddleware');

// Route utama untuk interaksi Socratic Mentor (login opsional untuk mencatat riwayat)
router.post('/', optionalAuthenticateToken, mentorController.getMentorResponse);

module.exports = router;
