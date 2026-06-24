const geminiService = require('../services/geminiService');
const prisma = require('../config/db');

const getMentorResponse = async (req, res) => {
  try {
    const { message, currentCode, errorMessage, history, sessionId } = req.body;

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

    // Penyimpanan riwayat chat secara otomatis jika ada sessionId aktif
    if (sessionId) {
      try {
        // Cek judul sesi saat ini
        const activeSession = await prisma.session.findUnique({
          where: { id: sessionId },
          select: { title: true }
        });

        // Jika judul sesi masih default, ubah menjadi potongan pesan pertama user
        let updatedTitle = undefined;
        if (activeSession && activeSession.title === 'Sesi Belajar Baru' && message) {
          updatedTitle = message.length > 35 ? message.substring(0, 32) + '...' : message;
        }

        // Jalankan query simpan & update secara transaksional agar konsisten
        await prisma.$transaction([
          prisma.message.create({
            data: {
              sessionId,
              sender: 'user',
              text: message || '[Mengirimkan perubahan kode editor]'
            }
          }),
          prisma.message.create({
            data: {
              sessionId,
              sender: 'mentor',
              text: reply
            }
          }),
          prisma.session.update({
            where: { id: sessionId },
            data: {
              lastSavedCode: currentCode || '',
              ...(updatedTitle && { title: updatedTitle }),
              updatedAt: new Date()
            }
          })
        ]);
      } catch (dbError) {
        console.error("Gagal menyimpan percakapan ke database:", dbError.message);
        // Tetap lanjutkan pengiriman respon meskipun gagal mencatat di DB
      }
    }

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
