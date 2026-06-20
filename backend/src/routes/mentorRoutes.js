const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

// Route utama untuk interaksi Socratic Mentor
router.post('/', mentorController.getMentorResponse);

module.exports = router;
