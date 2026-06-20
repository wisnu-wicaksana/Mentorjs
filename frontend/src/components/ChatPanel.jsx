import { useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';

export const ChatPanel = ({ activeTab, chatHistory, inputMessage, setInputMessage, isLoading, onSendMessage }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className={`flex-1 flex flex-col bg-slate-950 border-t md:border-t-0 md:border-l border-gray-800 ${activeTab === 'chat' ? 'flex' : 'hidden md:flex'} md:w-1/3 min-h-0`}>
      
      {/* Header Panel Chat */}
      <div className="p-4 bg-slate-950 border-b border-gray-800 flex items-center gap-2">
        <Bot className="text-violet-400" size={24} />
        <h1 className="text-lg font-bold tracking-tight">MentorJS AI</h1>
      </div>

      {/* Kotak Riwayat Chat */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
                  <span className="text-xs text-gray-500 font-semibold">Kamu</span>
                  <User size={12} className="text-emerald-400" />
                </>
              ) : (
                <>
                  <Bot size={12} className="text-violet-400" />
                  <span className="text-xs text-gray-500 font-semibold">Mentor AI</span>
                </>
              )}
            </div>
            <div 
              className={`p-3 rounded-lg text-sm leading-relaxed border ${
                msg.sender === 'user' 
                  ? 'bg-emerald-950/20 border-emerald-800 text-emerald-100 rounded-tr-none' 
                  : 'bg-slate-900 border-gray-800 text-slate-100 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loader ketika AI sedang berpikir */}
        {isLoading && (
          <div className="mr-auto items-start flex flex-col max-w-[85%]">
            <div className="flex items-center gap-1.5 mb-1">
              <Bot size={12} className="text-violet-400" />
              <span className="text-xs text-gray-500 font-semibold">Mentor AI sedang menganalisis...</span>
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
      <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-gray-800">
        <div className="flex items-center gap-2 bg-slate-900 border border-gray-800 rounded-lg p-2 focus-within:border-violet-500/50 transition-colors">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isLoading ? "Mentor sedang mengetik..." : "Tanya mentor (misal: 'Kenapa kode saya error?')..."} 
            className="flex-1 bg-transparent text-sm outline-none px-2" 
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-gray-600 text-white p-2 rounded-md transition-colors cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

    </div>
  );
};
