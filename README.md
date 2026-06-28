# MentorJS: Socratic AI-Powered JavaScript Mentor

MentorJS is an interactive educational SaaS platform designed to help beginners learn JavaScript practically. Instead of providing direct answers, MentorJS is equipped with an AI Mentor (powered by Google Gemini) that utilizes the **Socratic method**—providing logical hints, real-world analogies, and analytical guidance so users can understand and solve their code problems on their own.

---

## 🌟 Key Features

* **📝 Interactive Code Editor:** Write and execute JavaScript code directly in the browser using a VS Code-like interface powered by `@monaco-editor/react`.
* **⚙️ Local JS Execution & Terminal:** A custom sandboxed browser-based runner that overrides `console.log` and `console.error` to capture logs and runtime errors in a terminal-like console output pane.
* **🤖 Socratic AI Companion:** Intelligent guidance from Google Gemini 2.5 Flash that reads your code, console errors, and conversation history to guide you step-by-step without spoon-feeding the final solution.
* **📐 Draggable Split-Pane Workspace:** Responsive workspace featuring a draggable divider bar that lets users adjust the width of the code editor and the AI mentor panel dynamically on desktop viewports.
* **🔐 Secure Authentication & OTP Verification:** Secure sign up and sign in forms with password match validation, visibility toggle buttons, and secure 6-digit verification code OTPs sent to the user's email via SMTP.
* **🛡️ Password Recovery:** Self-service account recovery via a "Forgot Password" workflow using secure email verification OTP codes.
* **🗂️ Learning History Session Manager:** Clean sidebar navigation to manage sessions (create, delete, switch, and automatically rename based on the user's first query). Syncs to PostgreSQL for registered users, fallback to memory-state for guests.
* **📱 Mobile-First Responsive UI:** Sleek dashboard with a split-screen panel layout for desktop that transitions into an optimized tabbed view for mobile viewports, featuring a professional IDE-style status bar footer.
* **🏗️ Clean MVC & Hook-Component Architecture:** 
  * **Backend:** Express API structured with separate Routes, Controllers, Services, and Configuration modules.
  * **Frontend:** React workspace modularized with Custom Hooks (`useChat`, `useCodeRunner`, `useMockupAnimation`) and presenting stateless UI components.

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    A[React Client: Chat Form / Code Editor] -->|Axios POST request to Port 3000| B[Express server.js]
    B -->|Route Handler| C[mentorRoutes.js]
    C -->|Controller Validation| D[mentorController.js]
    D -->|Socratic prompt & history formatting| E[geminiService.js]
    E -->|Unified @google/genai SDK query| F[Google Gemini API]
    F -->|Return Socratic advice| E
    E -->|Forward response text| D
    D -->|Send JSON Success response| A
```

---

## 📂 Project Structure

```text
aura/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma # Prisma Schema configuration (PostgreSQL)
│   ├── src/
│   │   ├── config/       # Gemini and DB client configuration
│   │   ├── controllers/  # Request validation & logic handlers (auth, history, mentor)
│   │   ├── middlewares/  # JWT Token auth validation middleware
│   │   ├── routes/       # Endpoint routing definitions
│   │   ├── services/     # Socratic prompt template & Gemini service
│   │   └── utils/        # Nodemailer SMTP setup and templates
│   ├── server.js         # Backend Entry point (Express)
│   ├── .env              # API keys and secrets (DO NOT COMMIT!)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/   # Global layout elements (Header, Footer)
    │   │   └── ui/       # Atomic/stateless UI elements (Button, Badge, CodeMockup, MockupWindow, BackgroundEffect)
    │   ├── constants/    # Monaco editor templates & static mockupData
    │   ├── hooks/        # Business logic custom hooks (useChat, useCodeRunner, useMockupAnimation)
    │   ├── pages/        # Top-level view containers (Home, Auth, Sandbox)
    │   ├── services/     # Axios setup & HTTP communication with the backend (api.js)
    │   ├── utils/        # Extracted parse helpers & Text-to-Speech (TTS) engine
    │   ├── App.css
    │   ├── App.jsx       # View toggle router with Location Hash routing
    │   ├── index.css     # Base Tailwind styling v4
    │   └── main.jsx      # React entry mount point
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation and Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed.
* A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
* A running PostgreSQL database.

### 1. Backend Setup
1. Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/mentorjs?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   GEMINI_API_KEY="your_gemini_api_key_here"

   # SMTP Configuration (Optional: defaults to terminal log fallbacks if left out)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   SMTP_FROM='"MentorJS Admin" <your-email@gmail.com>'
   ```
   > [!IMPORTANT]
   > Keep your `.env` file secure. Never commit it to GitHub. It is ignored by `.gitignore`.
3. Push the database schema using Prisma:
   ```bash
   npx prisma db push
   ```
4. Start the backend server:
   ```bash
   npm start
   # or with nodemon for auto-restart in development:
   npm run dev
   ```
   The backend API will run at `http://localhost:3000`.

### 2. Frontend Setup
1. Navigate to the `frontend` folder and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open the link displayed in your terminal (usually `http://localhost:5173`) in your web browser.

---

## 🧪 Code Validation & Build

To ensure strict code quality and compatibility, the project contains strict ESLint validation.

* Run linter:
   ```bash
   cd frontend
   npm run lint
   ```
* Test production build:
   ```bash
   npm run build
   ```

---

## 🛡️ Security Best Practices
* **Environment Separation:** API Keys are kept securely on the Node.js backend. The frontend communicates with the backend local API, preventing API key exposure in the browser.
* **Credentials Lock:** The backend `.env` file is explicitly ignored in `.gitignore` to prevent leakage to public Git repositories.
* **Cookie-based Session Authentication:** JWTs are stored in secure HTTP-Only cookies, preventing script injection (XSS) from hijacking user sessions.