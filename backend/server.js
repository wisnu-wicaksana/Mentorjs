const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const mentorRoutes = require('./src/routes/mentorRoutes');
const authRoutes = require('./src/routes/authRoutes');
const historyRoutes = require('./src/routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Alamat URL client React
  credentials: true // Mengizinkan browser mengirim cookie JWT
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('AuraJS/Mentorjs Backend API aktif dengan Dukungan Autentikasi!');
});

// Daftarkan route di endpoint API masing-masing
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/mentor', mentorRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`[START] Server Mentorjs berjalan di http://localhost:${PORT}`);
});