// Monaco Editor Code Playground Templates

export const TEMPLATES = {
  default: `// Tulis kode JavaScript di sini\nconst mentor = "AuraJS";\nconsole.log("Halo dari " + mentor + "!");`,
  loops: `// Contoh Perulangan (Loops) di JavaScript\nconsole.log("--- Mencetak angka 1 sampai 5 ---");\nfor (let i = 1; i <= 5; i++) {\n  console.log("Angka:", i);\n}`,
  arrays: `// Contoh Array & Manipulasinya\nconst buah = ["Apel", "Mangga", "Pisang"];\nconsole.log("Daftar buah:", buah);\n\nconsole.log("Mencetak buah satu per satu:");\nbuah.forEach((item, index) => {\n  console.log(\`Buah ke-\${index + 1}: \${item}\`);\n});`,
  functions: `// Contoh Fungsi (Functions)\nfunction hitungLuasPersegi(sisi) {\n  return sisi * sisi;\n}\n\nconst sisi = 8;\nconst luas = hitungLuasPersegi(sisi);\nconsole.log(\`Luas persegi dengan sisi \${sisi} adalah \${luas}\`);`
};

export const codeTokens = [
  { text: "// Socratic Learning Session\n", className: "text-gray-600" },
  { text: "let ", className: "text-pink-400" },
  { text: "score", className: "text-violet-300" },
  { text: " = ", className: "text-white" },
  { text: "100", className: "text-amber-400" },
  { text: ";\n", className: "text-white" },
  { text: "const ", className: "text-pink-400" },
  { text: "isWinner", className: "text-violet-300" },
  { text: " = ", className: "text-white" },
  { text: "true", className: "text-pink-400" },
  { text: ";\n", className: "text-white" },
  { text: "// Conditional check\n", className: "text-gray-600 block mt-2" },
  { text: "if ", className: "text-pink-400" },
  { text: "(", className: "text-white" },
  { text: "isWinner", className: "text-violet-300" },
  { text: ") {\n", className: "text-white" },
  { text: "  console.log", className: "text-emerald-400 pl-4" },
  { text: "(", className: "text-white" },
  { text: "\"Victory!\"", className: "text-amber-400" },
  { text: ")", className: "text-white" },
  { text: ";\n", className: "text-white" },
  { text: "}", className: "text-white" }
];

export const totalCodeLength = codeTokens.reduce((sum, token) => sum + token.text.length, 0);

