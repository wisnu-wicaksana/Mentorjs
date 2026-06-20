
import { Play, Trash2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

export const EditorPanel = ({ activeTab, code, setCode, runCode, consoleOutput, clearConsole }) => {
  return (
    <div className={`flex-1 flex flex-col ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'} md:w-2/3 min-h-0`}>
      
      {/* Header Panel Editor */}
      <div className="p-4 bg-slate-950 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-400">main.js</h2>
        <button 
          onClick={runCode}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20"
        >
          <Play size={16} />
          Jalankan Kode
        </button>
      </div>

      {/* Area Monaco Editor */}
      <div className="flex-1 min-h-[350px] relative bg-slate-950">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>

      {/* Panel Konsol Output (Terminal Style) */}
      <div className="h-56 bg-slate-950 border-t border-gray-800 flex flex-col">
        <div className="px-4 py-2 bg-slate-900/50 border-b border-gray-800 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Konsol Output</span>
          <button 
            onClick={clearConsole}
            className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            title="Clear console"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 bg-black/40">
          {consoleOutput.length === 0 ? (
            <span className="text-gray-600 italic">Belum ada output. Klik "Jalankan Kode" untuk melihat hasil.</span>
          ) : (
            consoleOutput.map((log, idx) => (
              <div 
                key={idx} 
                className={`pl-4 border-l-2 py-0.5 ${
                  log.type === 'error' 
                    ? 'text-rose-400 border-rose-500 bg-rose-950/10' 
                    : log.type === 'system' 
                      ? 'text-cyan-400 border-cyan-500 bg-cyan-950/10' 
                      : 'text-emerald-300 border-emerald-500/50 bg-emerald-950/5'
                }`}
              >
                <span className="text-gray-500 select-none mr-2">
                  {log.type === 'error' ? '❌' : log.type === 'system' ? '⚙️' : '>'}
                </span>
                {log.text}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
