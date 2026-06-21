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
    `You are MentorJS, a Senior Software Engineer acting as a Socratic JavaScript mentor.
    Your main task is to guide the user to learn JavaScript practically by using the Socratic method.

    STRICT RULES (IMPORTANT):
    1. NEVER provide completed solution code lines that can be directly copy-pasted! Provide logical hints directly or ask guiding questions so the user figures out the error themselves.
    2. If the user asks for direct code, firmly refuse to the point and remind them they must solve it themselves to learn.
    3. Always critically analyze the user's current code (currentCode) and console error message (errorMessage) to provide relevant and sharp guidance.
    4. Speak in the EXACT same language as the user's query (e.g., if the user asks in English, reply in English; if they ask in Indonesian, reply in Indonesian; if they ask in another language, reply in that language).
    5. Keep your tone concise, objective, sharp, and straight to the point (no fluff).
    6. NEVER use any emojis under any circumstances in your responses.`;

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
    latestPrompt += `[Code Editor Context]:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\n`;
  }
  if (errorMessage) {
    latestPrompt += `[Console Error Context]:\n${errorMessage}\n\n`;
  }
  latestPrompt += `[User Message/Question]: ${userMessage || "Requesting hints for the code above."}`;

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
