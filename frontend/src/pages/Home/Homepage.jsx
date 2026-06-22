import React, { useState, useEffect } from 'react';
import { Code, Bot, Sparkles, Terminal, Volume2, ArrowRight } from 'lucide-react';
import { BackgroundEffect } from '../../components/ui/BackgroundEffect';
import { Button } from '../../components/ui/Button';
import { MockupWindow } from '../../components/ui/MockupWindow';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CodeMockup, totalCodeLength } from '../../components/ui/CodeMockup';

// Token definition for User Mockup Question
const userTokens = [
  { text: "Why does the console print ", className: "text-gray-300" },
  { text: "\"Victory!\"", className: "text-amber-300 font-semibold" },
  { text: " in this code?", className: "text-gray-300" }
];

// Token definition for Chat Mockup Response
const chatTokens = [
  { text: "How does the ", className: "text-gray-300" },
  { text: "if", className: "text-pink-400 font-semibold" },
  { text: " block evaluate the condition? What is the role of ", className: "text-gray-300" },
  { text: "isWinner", className: "text-violet-300 font-semibold" },
  { text: " in this logic?", className: "text-gray-300" }
];

const totalUserLength = userTokens.reduce((sum, token) => sum + token.text.length, 0);
const totalChatLength = chatTokens.reduce((sum, token) => sum + token.text.length, 0);

const renderTokens = (tokens, maxChars) => {
  let charsLeft = maxChars;
  return tokens.map((token, index) => {
    if (charsLeft <= 0) return null;
    const textToShow = token.text.slice(0, charsLeft);
    charsLeft -= token.text.length;
    return (
      <span key={index} className={token.className}>
        {textToShow}
      </span>
    );
  });
};

export const Homepage = ({ onLaunchApp }) => {
  const [codeCharCount, setCodeCharCount] = useState(0);
  const [userCharCount, setUserCharCount] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [chatCharCount, setChatCharCount] = useState(0);
  const [showMentor, setShowMentor] = useState(false);

  useEffect(() => {
    // Left-side first, then right-side mockup animation sequence
    let timer;
    let currentStage = 'typing-code'; // 'typing-code' | 'show-console' | 'typing-user' | 'send-user' | 'typing-chat' | 'pause-end'
    let currentCodeCount = 0;
    let currentUserCount = 0;
    let currentChatCount = 0;

    const run = () => {
      if (currentStage === 'typing-code') {
        if (currentCodeCount < totalCodeLength) {
          currentCodeCount += 1;
          setCodeCharCount(currentCodeCount);
          timer = setTimeout(run, 30);
        } else {
          currentStage = 'show-console';
          timer = setTimeout(run, 500);
        }
      } else if (currentStage === 'show-console') {
        setShowConsole(true);
        currentStage = 'typing-user';
        timer = setTimeout(run, 800);
      } else if (currentStage === 'typing-user') {
        if (currentUserCount < totalUserLength) {
          currentUserCount += 1;
          setUserCharCount(currentUserCount);
          timer = setTimeout(run, 35);
        } else {
          currentStage = 'send-user';
          timer = setTimeout(run, 500);
        }
      } else if (currentStage === 'send-user') {
        currentStage = 'typing-chat';
        timer = setTimeout(run, 800);
      } else if (currentStage === 'typing-chat') {
        setShowMentor(true);
        if (currentChatCount < totalChatLength) {
          currentChatCount += 1;
          setChatCharCount(currentChatCount);
          timer = setTimeout(run, 45);
        } else {
          currentStage = 'pause-end';
          timer = setTimeout(run, 5000);
        }
      } else if (currentStage === 'pause-end') {
        currentCodeCount = 0;
        currentUserCount = 0;
        currentChatCount = 0;
        setCodeCharCount(0);
        setUserCharCount(0);
        setChatCharCount(0);
        setShowConsole(false);
        setShowMentor(false);
        currentStage = 'typing-code';
        timer = setTimeout(run, 1000);
      }
    };

    timer = setTimeout(run, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden relative">
      <BackgroundEffect />
      
      {/* Header / Navigation */}
      <Header onLaunchApp={onLaunchApp} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pb-24 lg:pt-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-400 mb-6 select-none animate-pulse">
            <Sparkles size={12} />
            <span>Socratic Learning Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-none">
            Master JavaScript <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              The Socratic Way
            </span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Unlock your programming potential with a Socratic AI mentor. MentorJS critically guides you step-by-step using logic, analogies, and questions—never spoiling raw code answers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="white" 
              size="lg"
              onClick={onLaunchApp}
              className="w-full sm:w-auto"
            >
              <span>Start Learning Now</span>
              <ArrowRight size={16} />
            </Button>
            <a 
              href="#features"
              className="w-full sm:w-auto"
            >
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full"
              >
                Explore Features
              </Button>
            </a>
          </div>

          {/* Reusable IDE Mockup Window */}
          <MockupWindow title="mentorjs-workspace" className="mt-16">
            {/* Window Body */}
            <div className="flex flex-col sm:flex-row h-72 sm:h-96 font-mono text-[11px] sm:text-xs">
              {/* Left Side: Code Editor Mockup */}
              <CodeMockup codeCharCount={codeCharCount} showConsole={showConsole} />
              {/* Right Side: Chat Mockup */}
              <div className="w-full sm:w-80 bg-slate-900/40 p-4 flex flex-col justify-between overflow-hidden text-left border-t sm:border-t-0 border-gray-900 min-h-[200px] sm:min-h-0">
                <div className="space-y-4 flex-1 flex flex-col justify-end pb-2 overflow-y-auto">
                  {/* User Message (appears after typing is completed) */}
                  {userCharCount === totalUserLength && (
                    <div className="space-y-1 self-end text-right max-w-[85%] animate-fade-in">
                      <div className="text-gray-500 text-[10px] select-none">You</div>
                      <div className="bg-violet-600 border border-violet-500 p-2.5 rounded-lg rounded-tr-none text-white text-[11px] sm:text-xs text-left leading-relaxed shadow-lg shadow-violet-900/10">
                        {renderTokens(userTokens, totalUserLength)}
                      </div>
                    </div>
                  )}

                  {/* AI Mentor Message (appears after user message is sent) */}
                  {showMentor && (
                    <div className="space-y-1 self-start max-w-[85%] animate-fade-in">
                      <div className="text-gray-500 text-[10px] flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span> Mentor AI
                      </div>
                      <div className="bg-slate-900 border border-gray-800 p-2.5 rounded-lg rounded-tl-none text-gray-300 text-[11px] sm:text-xs leading-relaxed shadow-lg">
                        {renderTokens(chatTokens, chatCharCount)}
                        {chatCharCount < totalChatLength && (
                          <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Waiting state before User types */}
                  {userCharCount === 0 && (
                    <div className="py-8 text-center text-gray-600 text-xs italic animate-pulse flex flex-col items-center justify-center gap-2 select-none h-full my-auto">
                      <Bot size={24} className="text-gray-700 animate-bounce" />
                      <span>Ask mentor...</span>
                    </div>
                  )}
                </div>
                
                {/* Dynamic Chat Input Bar */}
                <div className="border border-gray-800 bg-slate-950/50 rounded p-2 flex items-center justify-between text-gray-600 mt-2 font-sans text-xs select-none">
                  <span className="text-gray-500 truncate max-w-[75%] font-sans">
                    {userCharCount > 0 && userCharCount < totalUserLength ? (
                      <span className="text-gray-300">
                        {renderTokens(userTokens, userCharCount)}
                        <span className="inline-block w-1 h-3 bg-violet-400 ml-0.5 animate-pulse" />
                      </span>
                    ) : (
                      "Ask mentor..."
                    )}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border border-gray-800 transition-all font-bold ${userCharCount >= totalUserLength ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/30' : 'bg-slate-900 text-gray-500'}`}>
                    Send
                  </span>
                </div>
              </div>
            </div>
          </MockupWindow>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-gray-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Engineered For Modern Learning
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
              Experience a sandboxed local environment that brings professional editor utilities directly to your educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="border border-gray-900 bg-slate-900/30 p-6 rounded-xl hover:border-violet-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-lg bg-violet-950/50 border border-violet-800/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Code size={20} />
              </div>
              <h3 className="text-base font-bold mb-2">Monaco Code Editor</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Write clean JavaScript inside a full VS Code-like Monaco editor equipped with auto-formatting and settings.
              </p>
            </div>
            {/* Card 2 */}
            <div className="border border-gray-900 bg-slate-900/30 p-6 rounded-xl hover:border-violet-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-lg bg-violet-950/50 border border-violet-800/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Terminal size={20} />
              </div>
              <h3 className="text-base font-bold mb-2">Variable Inspector</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Inspect local variables and values step-by-step as you execute your scripts in a secure browser sandbox.
              </p>
            </div>
            {/* Card 3 */}
            <div className="border border-gray-900 bg-slate-900/30 p-6 rounded-xl hover:border-violet-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-lg bg-violet-950/50 border border-violet-800/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot size={20} />
              </div>
              <h3 className="text-base font-bold mb-2">Socratic AI Mentor</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Gemini-powered senior mentor analyzes your editor syntax, console logs, and errors to guide you systematically.
              </p>
            </div>
            {/* Card 4 */}
            <div className="border border-gray-900 bg-slate-900/30 p-6 rounded-xl hover:border-violet-500/30 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-lg bg-violet-950/50 border border-violet-800/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Volume2 size={20} />
              </div>
              <h3 className="text-base font-bold mb-2">Voice Assistance (TTS)</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Listen to your mentor's guidance with smart language auto-detection for English or Indonesian narrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 border-t border-gray-900 bg-slate-950 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
              Follow these three simple steps to start sharpening your JavaScript problem-solving skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative select-none">
            {/* Step 1 */}
            <div className="relative text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-gray-800 flex items-center justify-center text-violet-400 font-bold mb-4 shadow-lg shadow-violet-900/10">
                1
              </div>
              <h3 className="text-base font-bold mb-2">Select Template</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Choose a built-in starting code template (loops, arrays, functions) to practice in the editor.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-gray-800 flex items-center justify-center text-violet-400 font-bold mb-4 shadow-lg shadow-violet-900/10">
                2
              </div>
              <h3 className="text-base font-bold mb-2">Run Code Sandbox</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Execute your code. Examine logs inside Console Output and evaluate values in the Variable Inspector.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-gray-800 flex items-center justify-center text-violet-400 font-bold mb-4 shadow-lg shadow-violet-900/10">
                3
              </div>
              <h3 className="text-base font-bold mb-2">Interact With Mentor AI</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Ask questions to the Socratic AI Mentor to get logical hints, analogies, and guide yourself to solutions.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={onLaunchApp}
              className="mx-auto"
            >
              <span>Launch Sandbox Workspace</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};
