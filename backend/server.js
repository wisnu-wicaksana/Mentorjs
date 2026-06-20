const express = require('express');
const cors = require('cors');
require('dotenv').config();


const { GoogleGenAI } = require('@google/genai');

// Mengaktifkan AI dengan mengambil API Key dari brankas .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware: Satpam lalu lintas data
app.use(cors()); // Mengizinkan domain frontend nanti mengakses API ini
app.use(express.json()); // Memastikan Express bisa mengurai data JSON dari Frontend/Postman

// 2. Endpoint Pemanasan (Cek Kesehatan Server)
app.get('/', (req, res) => {
  res.send('AuraJS Backend API sudah aktif!');
});

// 3. Endpoint Utama (Sistem Kontrak API kita)
app.post('/api/mentor', async (req, res) => {
  try {
    console.log("Paket tiba dari Postman:", req.body);
    const { currentCode, errorMessage } = req.body;
    

    // Sintaks wajib dari Google untuk memanggil AI
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Model gratis dan cepat
      contents: `Kode saya: ${currentCode}. Error: ${errorMessage}`,
      config: {
        // Di sini tempatmu memasukkan aturan galak agar AI bertindak sebagai mentor
        systemInstruction: "Kamu adalah AuraJS Mentor. Berikan petunjuk, JANGAN berikan jawaban langsung!",
        temperature: 0.7, 
      }
    });

    // Kirim teks hasil analisa AI kembali ke Postman
    res.json({
      status: "success",
      data: {
        reply: response.text // response.text adalah cara mengambil string jawaban dari Gemini
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Gagal terhubung ke AI" });
  }
});

// 4. Menyalakan Mesin
app.listen(PORT, () => {
  console.log(`[START] Server AuraJS menyala di http://localhost:${PORT}`);
});