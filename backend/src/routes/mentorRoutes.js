const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Route utama untuk interaksi Socratic Mentor (wajib login)
router.post('/', authenticateToken, mentorController.getMentorResponse);

module.exports = router;
