// Monaco Editor Code Playground Templates

export const TEMPLATES = {
  default: `// Write JavaScript code here\nconst mentor = "MentorJS";\nconsole.log("Hello from " + mentor + "!");`,
  loops: `// Example of Loops in JavaScript\nconsole.log("--- Printing numbers 1 to 5 ---");\nfor (let i = 1; i <= 5; i++) {\n  console.log("Number:", i);\n}`,
  arrays: `// Example of Array & Manipulation\nconst fruits = ["Apple", "Mango", "Banana"];\nconsole.log("Fruit list:", fruits);\n\nconsole.log("Printing fruits one by one:");\nfruits.forEach((item, index) => {\n  console.log(\`Fruit \${index + 1}: \${item}\`);\n});`,
  functions: `// Example of Functions\nfunction calculateSquareArea(side) {\n  return side * side;\n}\n\nconst side = 8;\nconst area = calculateSquareArea(side);\nconsole.log(\`Area of a square with side \${side} is \${area}\`);`
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

