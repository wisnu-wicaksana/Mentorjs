# MentorJS: AI-Powered JavaScript Mentor

MentorJS is an interactive educational SaaS platform designed to help beginners learn JavaScript practically. Instead of providing direct answers, MentorJS is equipped with an AI Mentor (powered by Google Gemini) that utilizes the Socratic method—providing logical hints, analogies, and analytical guidance so users can understand and solve their code problems on their own.

## Key Features
* **Interactive Code Editor:** Write and execute JavaScript code directly in the browser using a VS Code-like interface (`@monaco-editor/react`).
* **Socratic AI Mentor:** Intelligent guidance from an AI that reads your code and error messages, then provides hints without spoon-feeding the final solution.
* **Modern Split-Screen UI:** A clean and responsive interface design, separating the AI discussion panel and the code editor.
* **Secure API Architecture:** The Google Gemini API key is secured on the Express backend side, maintaining security according to SaaS industry standards.

## Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* `@monaco-editor/react`
* Axios & Lucide React

**Backend:**
* Node.js & Express.js
* `@google/genai` (Gemini 2.5 Flash Model)
* CORS & Dotenv

---

## Installation and Local Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer and have an API Key from [Google AI Studio](https://aistudio.google.com/).

### 1. Backend Setup
Navigate to the backend folder and install the required dependencies:
```bash
cd backend
npm install