const prisma = require('../config/db');

/**
 * 1. Mengambil semua daftar sesi belajar milik user yang aktif (Hanya Metadata)
 * Efisien: Hanya men-select field yang diperlukan untuk daftar sidebar (menghemat bandwidth database).
 */
const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc', // Sesi yang terakhir diupdate akan berada paling atas
      },
    });

    res.json({
      status: 'success',
      data: sessions,
    });
  } catch (error) {
    console.error('Error di getSessions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil riwayat sesi belajar: ' + error.message,
    });
  }
};

/**
 * 2. Membuat Sesi Belajar Baru
 */
const createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, initialCode } = req.body;

    const newSession = await prisma.session.create({
      data: {
        userId,
        title: title || 'Sesi Belajar Baru',
        lastSavedCode: initialCode || '',
      },
      select: {
        id: true,
        title: true,
        lastSavedCode: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newSession,
    });
  } catch (error) {
    console.error('Error di createSession:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat sesi belajar baru: ' + error.message,
    });
  }
};

/**
 * 3. Mengambil Detail Sesi Belajar (Pesan & Kode Snapshot) berdasarkan ID
 * Keamanan: Memastikan sesi yang dicari benar-benar milik user yang sedang aktif.
 */
const getSessionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId, // Proteksi data: hanya pemilik sesi yang bisa mengakses
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc', // Urutkan pesan dari yang terlama ke terbaru
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesi belajar tidak ditemukan.',
      });
    }

    res.json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    console.error('Error di getSessionById:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal memuat detail sesi belajar: ' + error.message,
    });
  }
};

/**
 * 4. Memperbarui Snapshot Kode Terakhir di Editor
 */
const updateSessionCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { lastSavedCode } = req.body;

    // Cek dulu kepemilikan sesi sebelum diupdate
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesi belajar tidak ditemukan.',
      });
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { lastSavedCode },
      select: {
        id: true,
        lastSavedCode: true,
        updatedAt: true,
      },
    });

    res.json({
      status: 'success',
      data: updatedSession,
    });
  } catch (error) {
    console.error('Error di updateSessionCode:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui kode editor: ' + error.message,
    });
  }
};

/**
 * 5. Menghapus Sesi Belajar
 * Efisien: Berkat onDelete: Cascade di schema, pesan-pesan relasi otomatis dibersihkan oleh database.
 */
const deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Cek kepemilikan sesi
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesi belajar tidak ditemukan.',
      });
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    res.json({
      status: 'success',
      message: 'Sesi belajar berhasil dihapus.',
    });
  } catch (error) {
    console.error('Error di deleteSession:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus sesi belajar: ' + error.message,
    });
  }
};

module.exports = {
  getSessions,
  createSession,
  getSessionById,
  updateSessionCode,
  deleteSession,
};
