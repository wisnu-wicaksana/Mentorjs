import { useState } from 'react';
import { Code, Bot, Sparkles, Terminal, Volume2, ArrowRight, ChevronDown } from 'lucide-react';
import { BackgroundEffect } from '../../components/ui/BackgroundEffect';
import { Button } from '../../components/ui/Button';
import { MockupWindow } from '../../components/ui/MockupWindow';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CodeMockup } from '../../components/ui/CodeMockup';
import { useMockupAnimation } from '../../hooks/useMockupAnimation';
import { 
  userTokens, 
  chatTokens, 
  totalUserLength, 
  totalChatLength, 
  faqData 
} from '../../constants/mockupData';

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

export const Homepage = ({ onLaunchApp, onGoToAuth }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const {
    codeCharCount,
    userCharCount,
    showConsole,
    chatCharCount,
    showMentor
  } = useMockupAnimation();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden relative">
      <BackgroundEffect />
      
      {/* Header / Navigation */}
      <Header onLaunchApp={onLaunchApp} onGoToAuth={onGoToAuth} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 sm:pb-24 lg:pt-44">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-400 mb-6 select-none animate-pulse">
            <Sparkles size={12} />
            <span>Socratic Learning Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-[1.15]">
            Master JavaScript <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              The Socratic Way
            </span>
          </h1>
          
          <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
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
            <div className="flex flex-col sm:flex-row h-[480px] sm:h-96 font-mono text-[11px] sm:text-xs">
              {/* Left Side: Code Editor Mockup */}
              <CodeMockup codeCharCount={codeCharCount} showConsole={showConsole} />
              {/* Right Side: Chat Mockup */}
              <div className="flex-1 sm:flex-none w-full sm:w-80 bg-slate-900/40 p-4 flex flex-col justify-between overflow-hidden text-left border-t sm:border-t-0 border-gray-900 min-h-[200px] sm:min-h-0">
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
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Built for Practical Practice
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
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              How MentorJS Works
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-gray-900 bg-slate-950/40 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-400 mb-4 select-none">
              <Sparkles size={12} />
              <span>FAQ</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
              Have questions about how MentorJS works? Here are some quick answers to help you get started.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-900 bg-slate-900/30 rounded-xl hover:border-violet-500/10 transition-all duration-300 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between text-left p-5 font-semibold text-sm sm:text-base select-none text-white hover:text-violet-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-violet-400' : ''}`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 opacity-100 border-t border-gray-900/50' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 text-xs sm:text-sm text-gray-400 leading-relaxed bg-slate-950/20">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};
