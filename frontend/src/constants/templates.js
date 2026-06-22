// Monaco Editor Code Playground Templates

export const TEMPLATES = {
  default: `// Tulis kode JavaScript di sini\nconst mentor = "AuraJS";\nconsole.log("Halo dari " + mentor + "!");`,
  loops: `// Contoh Perulangan (Loops) di JavaScript\nconsole.log("--- Mencetak angka 1 sampai 5 ---");\nfor (let i = 1; i <= 5; i++) {\n  console.log("Angka:", i);\n}`,
  arrays: `// Contoh Array & Manipulasinya\nconst buah = ["Apel", "Mangga", "Pisang"];\nconsole.log("Daftar buah:", buah);\n\nconsole.log("Mencetak buah satu per satu:");\nbuah.forEach((item, index) => {\n  console.log(\`Buah ke-\${index + 1}: \${item}\`);\n});`,
  functions: `// Contoh Fungsi (Functions)\nfunction hitungLuasPersegi(sisi) {\n  return sisi * sisi;\n}\n\nconst sisi = 8;\nconst luas = hitungLuasPersegi(sisi);\nconsole.log(\`Luas persegi dengan sisi \${sisi} adalah \${luas}\`);`
};
