const geminiService = require('../services/geminiService');

const getMentorResponse = async (req, res) => {
  try {
    const { message, currentCode, errorMessage, history } = req.body;

    // Validasi input minimal: harus ada pesan atau kode
    if (!message && !currentCode) {
      return res.status(400).json({
        status: "error",
        message: "Request tidak valid. Harap sertakan pesan atau kode editor."
      });
    }

    // Panggil Service untuk berinteraksi dengan API Gemini
    const reply = await geminiService.getSocraticGuidance(
      message,
      currentCode,
      errorMessage,
      history
    );

    res.json({
      status: "success",
      data: {
        reply
      }
    });

  } catch (error) {
    console.error("Error di mentorController:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal terhubung ke AI Mentor: " + error.message
    });
  }
};

module.exports = {
  getMentorResponse
};
