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

// FAQ Section Static Questions Data (English Translation)
export const faqData = [
  {
    question: "What is MentorJS?",
    answer: "MentorJS is an interactive JavaScript learning platform powered by a Socratic AI Mentor. Instead of giving direct code solutions, our AI mentor guides you step-by-step with logical hints, analogies, and targeted questions to train your programming logic."
  },
  {
    question: "What is the Socratic method?",
    answer: "The Socratic method is an active learning approach focused on interactive questioning. The AI Mentor does not spoon-feed you code, but instead asks critical questions to stimulate your thinking so you can find the solution independently."
  },
  {
    question: "Why does MentorJS use the Socratic method?",
    answer: "The Socratic method helps build deep problem-solving skills and critical thinking in programming. By guiding you to discover answers yourself, your understanding of programming logic will be much stronger than simply copying a solution."
  },
  {
    question: "Is this platform free to use?",
    answer: "Yes! You can use the sandbox workspace, write and run JavaScript locally, inspect variable states, check console outputs, and get guidance from our Socratic AI Mentor completely for free."
  },
  {
    question: "What features are offered by the Sandbox Workspace?",
    answer: "Our sandbox features a Monaco code editor (like VS Code) with auto-formatting, a real-time Variable Inspector to track variable values step-by-step, an interactive Console Output, and an AI Mentor with built-in Text-to-Speech support."
  }
];
