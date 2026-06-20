
import { Code, Bot } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden flex border-t border-gray-800 bg-slate-950 h-16 shrink-0">
      <button 
        onClick={() => setActiveTab('editor')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'editor' ? 'text-emerald-400' : 'text-gray-500'}`}
      >
        <Code size={20} />
        <span className="text-xs">Editor</span>
      </button>
      <button 
        onClick={() => setActiveTab('chat')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'chat' ? 'text-violet-400' : 'text-gray-500'}`}
      >
        <Bot size={20} />
        <span className="text-xs">Mentor AI</span>
      </button>
    </div>
  );
};
