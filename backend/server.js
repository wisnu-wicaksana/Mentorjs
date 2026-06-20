const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mentorRoutes = require('./src/routes/mentorRoutes');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('AuraJS/Mentorjs Backend API sudah aktif dengan Arsitektur Bersih!');
});

// Daftarkan route mentor di endpoint /api/mentor
app.use('/api/mentor', mentorRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`[START] Server Mentorjs berjalan di http://localhost:${PORT}`);
});