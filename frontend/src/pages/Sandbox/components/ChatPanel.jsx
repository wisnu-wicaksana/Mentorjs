import React, { useEffect, useRef, useState } from 'react';
import { Bot, User, Send, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeech } from '../../../utils/tts';

export const ChatPanel = ({ activeTab, chatHistory, inputMessage, setInputMessage, isLoading, onSendMessage, onResetChat }) => {
  
  // Custom markdown & code blocks parser to render AI responses cleanly
  const renderMessageText = (text) => {
    if (!text) return null;
    
    // Split by triple backticks for code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const firstNewLineIndex = codeContent.indexOf('\n');
        
        let language = '';
        let code = codeContent;
        
        if (firstNewLineIndex !== -1) {
          language = codeContent.substring(0, firstNewLineIndex).trim();
          code = codeContent.substring(firstNewLineIndex + 1);
        }
        
        return (
          <div key={index} className="my-2 border border-slate-800 rounded-md overflow-hidden bg-slate-950 font-mono text-xs w-full max-w-full">
            {language && (
              <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-slate-400 flex justify-between items-center select-none font-sans text-[10px] font-bold uppercase tracking-wider">
                <span>{language}</span>
                <span className="text-[9px] text-slate-500 font-normal">KODE</span>
              </div>
            )}
            <pre className="p-3 overflow-x-auto text-emerald-400 select-all leading-normal whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Split by single backticks for inline code
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <span key={index} className="whitespace-pre-line leading-relaxed">
          {inlineParts.map((inlinePart, inlineIndex) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              return (
                <code key={inlineIndex} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-pink-400 border border-slate-700 font-mono text-[13px]">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            return inlinePart;
          })}
        </span>
      );
    });
  };
  
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const speakText = (text, idx) => {
    if (speakingIndex === idx) {
      stopSpeech();
      setSpeakingIndex(null);
      return;
    }
    speak(
      text,
      () => setSpeakingIndex(idx),
      () => setSpeakingIndex(null),
      () => setSpeakingIndex(null)
    );
  };

  const handleReset = () => {
    stopSpeech();
    setSpeakingIndex(null);
    onResetChat();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className={`flex-1 flex flex-col bg-slate-950 border-t md:border-t-0 md:border-l border-gray-800 ${activeTab === 'chat' ? 'flex' : 'hidden md:flex'} landscape:flex md:w-1/3 landscape:w-1/3 min-h-0`}>
      
      {/* Header Panel Chat */}
      <div className="p-2.5 sm:p-4 bg-slate-950 border-b border-gray-800 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="text-violet-400 sm:w-6 sm:h-6" size={20} />
          <h1 className="text-sm sm:text-lg font-bold tracking-tight">MentorJS AI</h1>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer active:scale-95"
          title="Reset Conversation"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Kotak Riwayat Chat */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4">
        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="text-xs text-gray-500 font-semibold">You</span>
                  <User size={12} className="text-emerald-400" />
                </>
              ) : (
                <div className="flex items-center gap-1.5 select-none">
                  <Bot size={12} className="text-violet-400" />
                  <span className="text-xs text-gray-500 font-semibold">Mentor AI</span>
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, idx)}
                    className={`ml-1 p-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                      speakingIndex === idx ? 'text-emerald-400 animate-pulse' : 'text-gray-500 hover:text-gray-300'
                    }`}
                    title={speakingIndex === idx ? "Stop Audio" : "Listen to Audio"}
                  >
                    {speakingIndex === idx ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                </div>
              )}
            </div>
            <div 
              className={`p-3 rounded-lg text-sm leading-relaxed border w-full break-words overflow-x-hidden ${
                msg.sender === 'user' 
                  ? 'bg-emerald-950/20 border-emerald-800 text-emerald-100 rounded-tr-none' 
                  : 'bg-slate-900 border-gray-800 text-slate-100 rounded-tl-none'
              }`}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}

        {/* Loader ketika AI sedang berpikir */}
        {isLoading && (
          <div className="mr-auto items-start flex flex-col max-w-[85%]">
            <div className="flex items-center gap-1.5 mb-1">
              <Bot size={12} className="text-violet-400" />
              <span className="text-xs text-gray-500 font-semibold">Mentor AI is analyzing...</span>
            </div>
            <div className="bg-slate-900 border border-gray-800 p-3 rounded-lg text-sm rounded-tl-none flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Chat Panel */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 bg-slate-950 border-t border-gray-800 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-gray-800 rounded-lg p-1.5 sm:p-2 focus-within:border-violet-500/50 transition-colors">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isLoading ? "Mentor is typing..." : "Ask mentor (e.g., 'Why is my code throwing an error?')..."} 
            className="flex-1 bg-transparent text-base md:text-sm outline-none px-1.5 sm:px-2" 
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-gray-600 text-white p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer"
          >
            <Send size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
};
