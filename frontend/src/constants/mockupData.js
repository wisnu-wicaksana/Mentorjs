// Token definition for User Mockup Question
export const userTokens = [
  { text: "Why does the console print ", className: "text-gray-300" },
  { text: "\"Victory!\"", className: "text-amber-300 font-semibold" },
  { text: " in this code?", className: "text-gray-300" }
];

// Token definition for Chat Mockup Response
export const chatTokens = [
  { text: "How does the ", className: "text-gray-300" },
  { text: "if", className: "text-pink-400 font-semibold" },
  { text: " block evaluate the condition? What is the role of ", className: "text-gray-300" },
  { text: "isWinner", className: "text-violet-300 font-semibold" },
  { text: " in this logic?", className: "text-gray-300" }
];

export const totalUserLength = userTokens.reduce((sum, token) => sum + token.text.length, 0);
export const totalChatLength = chatTokens.reduce((sum, token) => sum + token.text.length, 0);

// FAQ Section Static Questions Data
export const faqData = [
  {
    question: "Apa itu MentorJS?",
    answer: "MentorJS adalah platform belajar JavaScript interaktif berbasis kecerdasan buatan (AI) yang menggunakan metode sokratik. Dibanding langsung memberikan jawaban berupa baris kode, AI Mentor kami akan membimbing Anda langkah-demi-langkah lewat pertanyaan logis, analogi, dan petunjuk terarah agar logika berpikir Anda terlatih."
  },
  {
    question: "Apa itu metode Sokratik?",
    answer: "Metode Sokratik adalah pendekatan pembelajaran aktif yang berfokus pada tanya-jawab interaktif. AI Mentor tidak akan langsung menyuapi Anda dengan baris kode solusi, melainkan mengajukan pertanyaan-pertanyaan kritis untuk merangsang logika berpikir Anda sehingga Anda dapat menemukan jalan keluar secara mandiri."
  },
  {
    question: "Mengapa MentorJS menggunakan metode Sokratik?",
    answer: "Metode Sokratik membantu melatih kemampuan pemecahan masalah (problem-solving) dan pemikiran kritis Anda secara mendalam. Dengan dibimbing untuk mencari jawaban sendiri, pemahaman logika pemrograman Anda akan melekat jauh lebih kuat dibanding sekadar menyalin kode solusi."
  },
  {
    question: "Apakah platform ini gratis digunakan?",
    answer: "Ya! Anda dapat menggunakan sandbox workspace, menguji coba kode JavaScript secara lokal, memeriksa konsol log, serta berkonsultasi dengan Socratic AI Mentor secara gratis."
  },
  {
    question: "Fitur apa saja yang ditawarkan oleh Sandbox Workspace?",
    answer: "Sandbox kami dilengkapi dengan editor kode Monaco (mirip VS Code) dengan fitur auto-format, Inspector Variabel untuk melacak nilai variabel secara real-time langkah demi langkah, Konsol Output interaktif, serta AI Mentor yang dilengkapi konversi teks ke suara (Text-to-Speech)."
  }

];
