// Text-to-Speech (TTS) Voice Narrator Utility

/**
 * Speaks the provided text using the Web Speech API.
 * Cleans markdown formatting and auto-detects English vs Indonesian.
 * 
 * @param {string} text - The raw text to speak.
 * @param {Function} onStart - Callback when speech begins.
 * @param {Function} onEnd - Callback when speech finishes.
 * @param {Function} onError - Callback on error.
 */
export const speak = (text, onStart, onEnd, onError) => {
  window.speechSynthesis.cancel();

  if (!text) return;

  // Clean markdown symbols to make narration sound natural
  let cleanText = text
    .replace(/```[\s\S]*?```/g, ' [Code block ignored] ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Simple regex heuristic to check if target language is Indonesian or English
  const isIndonesian = /\b(kamu|saya|dan|untuk|adalah|kode|ini|itu|yang|di|ke|dari)\b/i.test(cleanText);
  const targetLang = isIndonesian ? 'id-ID' : 'en-US';
  
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(isIndonesian ? 'id' : 'en'));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }
  utterance.lang = targetLang;
  utterance.rate = 1.0;
  
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
};

/**
 * Stops any ongoing speech synthesis.
 */
export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};
