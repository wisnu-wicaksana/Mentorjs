const ai = require('../config/gemini');

/**
 * Mengirimkan data chat, kode, dan error ke Gemini untuk mendapatkan petunjuk Socratic
 * @param {string} userMessage - Pesan/pertanyaan custom dari user
 * @param {string} currentCode - Kode JS saat ini dari editor
 * @param {string} errorMessage - Pesan error konsol jika ada
 * @param {Array} history - Riwayat percakapan sebelumnya untuk memori model
 */
const getSocraticGuidance = async (userMessage, currentCode, errorMessage, history = []) => {
  // 1. Definisikan instruksi sistem Socratic
  const systemInstruction = 
    `Kamu adalah MentorJS, AI Mentor Pemrograman JavaScript yang berstatus sebagai Senior Software Engineer.
    Tugas utamanya adalah membimbing pengguna belajar JavaScript secara praktis menggunakan metode Socratic.

    ATURAN KETAT (PENTING):
    1. JANGAN PERNAH memberikan baris kode solusi jadi yang langsung bisa di-copy-paste! Berikan petunjuk logika secara langsung atau tanyakan pertanyaan penuntun agar pengguna sadar letak kesalahannya secara mandiri.
    2. Jika pengguna meminta kode langsung, tolak secara tegas dan to the point, ingatkan mereka bahwa mereka harus memecahkannya sendiri demi proses belajar.
    3. Selalu analisis secara kritis kode saat ini (currentCode) dan pesan error (errorMessage) yang dilampirkan untuk memberikan saran yang relevan dan tajam.
    4. Sampaikan panduan menggunakan bahasa yang sama dengan bahasa yang digunakan oleh pengguna (misal jika pengguna bertanya dengan bahasa Inggris, jawab dengan bahasa Inggris) dengan gaya yang ringkas, objektif, tajam, langsung pada inti permasalahan (to the point), dan JANGAN PERNAH menggunakan emoji apa pun dalam jawabanmu.`;

  // 2. Format history chat agar sesuai dengan kontrak API Gemini
  // Format Gemini API contents: [{ role: 'user' | 'model', parts: [{ text: string }] }]
  const contents = [];

  // Masukkan riwayat chat sebelumnya jika ada
  if (Array.isArray(history)) {
    history.forEach(msg => {
      // Petakan sender dari frontend ke role api gemini
      // user -> user, mentor -> model (atau assistant -> model)
      const role = msg.sender === 'user' ? 'user' : 'model';
      contents.push({
        role: role,
        parts: [{ text: msg.text }]
      });
    });
  }

  // Tambahkan prompt terbaru beserta konteks editor dan console error
  let latestPrompt = "";
  if (currentCode) {
    latestPrompt += `[Konteks Editor Kode]:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\n`;
  }
  if (errorMessage) {
    latestPrompt += `[Konteks Konsol Error]:\n${errorMessage}\n\n`;
  }
  latestPrompt += `[Pertanyaan/Pesan Pengguna]: ${userMessage || "Minta petunjuk untuk kode saya di atas."}`;

  contents.push({
    role: 'user',
    parts: [{ text: latestPrompt }]
  });

  // 3. Panggil API Gemini 2.5 Flash
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};

module.exports = {
  getSocraticGuidance
};
