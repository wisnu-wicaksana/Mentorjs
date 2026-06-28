import { useState } from 'react';
import { Play, Trash2, Download, Menu, User, LogIn } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { TEMPLATES } from '../../../constants/templates';
import { Badge } from '../../../components/ui/Badge';

export const EditorPanel = ({ activeTab, code, setCode, runCode, consoleOutput, clearConsole, variables, onBackToHome, onToggleSidebar, isAuthenticated, onGoToAuth, style, onOpenProfile }) => {
  const [bottomTab, setBottomTab] = useState('console'); // 'console' | 'inspector'

  const exportCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "main.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div 
      style={style}
      className={`flex-1 flex flex-col ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'} landscape:flex min-h-0`}
    >
      
      {/* Header Panel Editor */}
      <div className="p-3 sm:p-4 bg-slate-950 border-b border-gray-800 flex justify-between items-center select-none gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && (
            <button 
              onClick={onToggleSidebar}
              className="p-1 rounded bg-slate-900 border border-gray-800 text-gray-400 hover:text-gray-200 cursor-pointer flex items-center justify-center mr-1"
              title="Toggle Sidebar"
            >
              <Menu size={14} />
            </button>
          )}
          <button 
            onClick={onBackToHome}
            className="text-[10px] sm:text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors mr-1 sm:mr-1.5 cursor-pointer flex items-center select-none"
            title="Back to Homepage"
          >
            &larr; Home
          </button>
          <select 
            onChange={(e) => setCode(TEMPLATES[e.target.value] || '')}
            defaultValue="default"
            className="bg-slate-900 border border-gray-800 text-[10px] sm:text-xs text-gray-300 rounded pl-2 pr-6 sm:pl-3 sm:pr-8 py-1 sm:py-1.5 w-24 lg:w-auto outline-none focus:border-violet-500/50 cursor-pointer transition-colors"
          >
            <option value="default">Hello World (Default)</option>
            <option value="loops">Loops</option>
            <option value="arrays">Arrays & Objects</option>
            <option value="functions">Functions</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {!isAuthenticated && (
            <button 
              type="button"
              onClick={onGoToAuth}
              className="bg-violet-950/40 hover:bg-violet-900/50 border border-violet-900/50 text-violet-300 hover:text-violet-200 px-2.5 py-2 sm:px-3 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <LogIn size={13} className="lg:hidden" />
              <span className="hidden lg:inline">Sign In</span>
            </button>
          )}
          
          <button 
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300 hover:text-white px-2.5 py-2 sm:px-3 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Profile & Stats"
          >
            <User size={13} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Profile</span>
          </button>

          <button 
            onClick={exportCode}
            className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300 hover:text-white px-2.5 py-2 sm:px-3 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Download Code (.js)"
          >
            <Download size={13} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Download</span>
          </button>
          
          <button 
            onClick={runCode}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-2 sm:px-4 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20"
            title="Run Code"
          >
            <Play size={13} className="fill-current sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Run</span>
          </button>
        </div>
      </div>

      {/* Area Monaco Editor */}
      <div className="flex-1 editor-min-height relative bg-slate-950">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>

      {/* Panel Konsol Output & Inspektur (Terminal Style) */}
      <div className="console-height bg-slate-950 border-t border-gray-800 flex flex-col shrink-0">
        {/* Tab Headers */}
        <div className="px-4 bg-slate-900/50 border-b border-gray-800 flex justify-between items-center select-none shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setBottomTab('console')}
              className={`py-2.5 px-3 text-[10px] md:text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                bottomTab === 'console' 
                  ? 'text-emerald-400 border-emerald-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Console Output
            </button>
            <button
              onClick={() => setBottomTab('inspector')}
              className={`py-2.5 px-3 text-[10px] md:text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                bottomTab === 'inspector' 
                  ? 'text-violet-400 border-violet-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Variable Inspector
            </button>
          </div>
          
          {bottomTab === 'console' && (
            <button 
              onClick={clearConsole}
              className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer py-1.5"
              title="Clear console"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-black/40">
          {bottomTab === 'console' ? (
            <div className="font-mono text-xs md:text-sm space-y-2">
              {consoleOutput.length === 0 ? (
                <span className="text-gray-600 italic">No output yet. Click "Run" to see results.</span>
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
          ) : (
            /* Variable Inspector View */
            <div className="h-full flex flex-col">
              {variables.length === 0 ? (
                <span className="text-gray-600 italic text-xs md:text-sm font-sans">
                  No variables detected. Define top-level variables (`let`, `const`, or `var`) and click "Run" to inspect their values.
                </span>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs font-mono select-text border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 uppercase font-sans text-[9px] md:text-[10px] tracking-wider select-none">
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/50">
                      {variables.map((v, idx) => {
                        let displayValue = String(v.value);
                        if (v.type === 'string') displayValue = `"${v.value}"`;
                        else if (v.type === 'array' || v.type === 'object') {
                          try {
                            displayValue = JSON.stringify(v.value);
                          } catch {
                            displayValue = String(v.value);
                          }
                        } else if (v.value === undefined) {
                          displayValue = 'undefined';
                        } else if (v.value === null) {
                          displayValue = 'null';
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-900/20 transition-colors border-b border-gray-900/20">
                            <td className="py-2.5 px-3 font-semibold text-gray-200">{v.name}</td>
                            <td className="py-2.5 px-3">
                              <Badge type={v.type}>
                                {v.type}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-emerald-300 max-w-xs truncate" title={displayValue}>
                              {displayValue}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
