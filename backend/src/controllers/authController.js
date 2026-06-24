const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Fungsi pembantu untuk membuat JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token berlaku selama 7 hari
  });

  // Set token di dalam cookie HTTP-Only yang aman
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Hanya kirim lewat HTTPS jika di production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
  });
};

// 1. Registrasi Akun Baru
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Semua kolom input harus diisi.' });
    }

    // Cek apakah email atau username sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Username atau Email sudah terdaftar.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Buat token JWT dan pasang di cookie
    generateToken(res, newUser.id);

    res.status(201).json({
      status: 'success',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error di registerUser:', error);
    res.status(500).json({ status: 'error', message: 'Gagal melakukan registrasi: ' + error.message });
  }
};

// 2. Login Pengguna
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email dan password harus diisi.' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Email atau password salah.' });
    }

    // Validasi password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'Email atau password salah.' });
    }

    // Buat token JWT dan pasang di cookie
    generateToken(res, user.id);

    res.json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error di loginUser:', error);
    res.status(500).json({ status: 'error', message: 'Gagal melakukan login: ' + error.message });
  }
};

// 3. Logout Pengguna (Menghapus Cookie)
const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set tanggal kedaluwarsa ke masa lalu agar terhapus
  });
  res.json({ status: 'success', message: 'Berhasil keluar (logout).' });
};

// 4. Dapatkan Profil User Saat Ini (Melalui Cookie valid)
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Error di getUserProfile:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat profil: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};
