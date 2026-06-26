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
      return res.status(400).json({ status: 'error', message: 'Semua kolom input (Nama Pengguna, Email, dan Kata Sandi) wajib diisi.' });
    }

    // Cek apakah email atau username sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      // Jika user terdaftar tapi belum diverifikasi, kita perbarui OTP-nya dan kirim ulang
      if (!existingUser.isVerified) {
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit string
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            otpCode: otp,
            otpExpires,
          }
        });
        
        const { sendOTPEmail } = require('../utils/mailer');
        await sendOTPEmail(email, otp);
        
        return res.status(200).json({
          status: 'unverified',
          message: 'Username/Email ini belum diverifikasi. Kode OTP baru telah dikirim.',
          email: existingUser.email,
        });
      }
      
      return res.status(400).json({ 
        status: 'error', 
        message: 'Alamat email atau nama pengguna ini sudah digunakan. Silakan gunakan email lain, atau silakan masuk ke akun Anda.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // Simpan user baru ke database (dengan isVerified: false)
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        otpCode: otp,
        otpExpires,
      },
    });

    // Kirim email verifikasi OTP
    const { sendOTPEmail } = require('../utils/mailer');
    await sendOTPEmail(email, otp);

    res.status(201).json({
      status: 'unverified',
      message: 'Registrasi berhasil! Kode OTP verifikasi telah dikirim ke email Anda.',
      email: newUser.email,
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
      return res.status(400).json({ status: 'error', message: 'Alamat email dan kata sandi wajib diisi untuk masuk.' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: `Alamat email "${email}" belum terdaftar. Silakan periksa kembali penulisan email Anda, atau pilih tab "Daftar" untuk membuat akun baru.` });
    }

    // Validasi password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'Kata sandi yang Anda masukkan salah. Periksa kembali tombol Caps Lock dan coba lagi.' });
    }

    // Cek apakah akun sudah terverifikasi
    if (!user.isVerified) {
      // Generate OTP baru
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: otp,
          otpExpires,
        },
      });

      // Kirim email verifikasi OTP
      const { sendOTPEmail } = require('../utils/mailer');
      await sendOTPEmail(user.email, otp);

      return res.status(200).json({
        status: 'unverified',
        message: 'Email Anda belum diverifikasi. Kode OTP baru telah dikirim ke email Anda.',
        email: user.email,
      });
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

// 5. Verifikasi OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ status: 'error', message: 'Alamat email dan 6 digit kode OTP wajib diisi.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email tidak terdaftar.' });
    }

    if (user.isVerified) {
      // Jika sudah terverifikasi, langsung berikan token
      generateToken(res, user.id);
      return res.json({
        status: 'success',
        message: 'Email sudah terverifikasi.',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }

    // Cek kecocokan OTP
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ status: 'error', message: 'Kode OTP yang Anda masukkan salah. Periksa kembali pesan di kotak masuk email Anda (atau log terminal).' });
    }

    // Cek kedaluwarsa OTP
    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ status: 'error', message: 'Kode OTP telah kedaluwarsa karena melebihi batas waktu 15 menit. Silakan klik "Kirim Ulang OTP" untuk mendapatkan kode baru.' });
    }

    // Update status user ke verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    // Buat token JWT dan pasang di cookie
    generateToken(res, updatedUser.id);

    res.json({
      status: 'success',
      message: 'Verifikasi berhasil! Selamat datang di MentorJS.',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Error di verifyOTP:', error);
    res.status(500).json({ status: 'error', message: 'Gagal melakukan verifikasi OTP: ' + error.message });
  }
};

// 6. Kirim Ulang OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email harus diisi.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email tidak ditemukan.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ status: 'error', message: 'Email ini sudah terverifikasi.' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires,
      },
    });

    // Kirim email verifikasi OTP
    const { sendOTPEmail } = require('../utils/mailer');
    await sendOTPEmail(user.email, otp);

    res.json({
      status: 'success',
      message: 'Kode OTP baru telah dikirim ke email Anda.',
    });
  } catch (error) {
    console.error('Error di resendOTP:', error);
    res.status(500).json({ status: 'error', message: 'Gagal mengirim ulang OTP: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  verifyOTP,
  resendOTP,
};
