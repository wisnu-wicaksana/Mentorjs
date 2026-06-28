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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map(url => url.replace(/\/$/, ""));

app.use(cors({
  origin: function (origin, callback) {
    // izinkan request tanpa origin (seperti mobile apps, postman, curl)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.indexOf(cleanOrigin) === -1) {
      console.warn(`[CORS Blocked] Request Origin: ${origin}, Sanitized: ${cleanOrigin}. Allowed list:`, allowedOrigins);
      const msg = 'Kebijakan CORS memblokir akses dari origin ini.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

// Jalankan Server (Hanya jika dijalankan langsung, bukan sebagai Vercel Serverless Function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[START] Server Mentorjs berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;