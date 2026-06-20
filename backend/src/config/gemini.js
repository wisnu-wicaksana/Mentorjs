const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Memastikan API key tersedia
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ PENTING: GEMINI_API_KEY tidak ditemukan di file .env!");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = ai;
