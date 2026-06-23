import { Code, Bot } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden flex border-t border-gray-800 bg-slate-950 h-11 sm:h-16 shrink-0 select-none">
      <button 
        onClick={() => setActiveTab('editor')}
        className={`flex-1 flex flex-row sm:flex-col items-center justify-center gap-1.5 sm:gap-1 transition-colors ${activeTab === 'editor' ? 'text-emerald-400' : 'text-gray-500'}`}
      >
        <Code size={16} className="sm:w-5 sm:h-5" />
        <span className="text-xs">Editor</span>
      </button>
      <button 
        onClick={() => setActiveTab('chat')}
        className={`flex-1 flex flex-row sm:flex-col items-center justify-center gap-1.5 sm:gap-1 transition-colors ${activeTab === 'chat' ? 'text-violet-400' : 'text-gray-500'}`}
      >
        <Bot size={16} className="sm:w-5 sm:h-5" />
        <span className="text-xs">Mentor AI</span>
      </button>
    </div>
  );
};
