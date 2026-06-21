import { useState } from 'react';
import { Play, Trash2, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';

const TEMPLATES = {
  default: `// Tulis kode JavaScript di sini\nconst mentor = "AuraJS";\nconsole.log("Halo dari " + mentor + "!");`,
  loops: `// Contoh Perulangan (Loops) di JavaScript\nconsole.log("--- Mencetak angka 1 sampai 5 ---");\nfor (let i = 1; i <= 5; i++) {\n  console.log("Angka:", i);\n}`,
  arrays: `// Contoh Array & Manipulasinya\nconst buah = ["Apel", "Mangga", "Pisang"];\nconsole.log("Daftar buah:", buah);\n\nconsole.log("Mencetak buah satu per satu:");\nbuah.forEach((item, index) => {\n  console.log(\`Buah ke-\${index + 1}: \${item}\`);\n});`,
  functions: `// Contoh Fungsi (Functions)\nfunction hitungLuasPersegi(sisi) {\n  return sisi * sisi;\n}\n\nconst sisi = 8;\nconst luas = hitungLuasPersegi(sisi);\nconsole.log(\`Luas persegi dengan sisi \${sisi} adalah \${luas}\`);`
};

export const EditorPanel = ({ activeTab, code, setCode, runCode, consoleOutput, clearConsole, variables }) => {
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
    <div className={`flex-1 flex flex-col ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'} md:w-2/3 min-h-0`}>
      
      {/* Header Panel Editor */}
      <div className="p-4 bg-slate-950 border-b border-gray-800 flex justify-between items-center select-none gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-400">main.js</h2>
          <select 
            onChange={(e) => setCode(TEMPLATES[e.target.value] || '')}
            defaultValue="default"
            className="bg-slate-900 border border-gray-800 text-[11px] md:text-xs text-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-violet-500/50 cursor-pointer transition-colors"
          >
            <option value="default">Halo Dunia (Default)</option>
            <option value="loops">Perulangan (Loops)</option>
            <option value="arrays">Array & Object</option>
            <option value="functions">Fungsi (Functions)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCode}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300 hover:text-white px-3 py-2 rounded-md text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Download Kode (.js)"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Unduh</span>
          </button>
          
          <button 
            onClick={runCode}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20"
          >
            <Play size={14} />
            <span>Jalankan</span>
          </button>
        </div>
      </div>

      {/* Area Monaco Editor */}
      <div className="flex-1 min-h-[300px] relative bg-slate-950">
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

      {/* Panel Konsol Output & Inspektur (Terminal Style) */}
      <div className="h-64 bg-slate-950 border-t border-gray-800 flex flex-col">
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
              Konsol Output
            </button>
            <button
              onClick={() => setBottomTab('inspector')}
              className={`py-2.5 px-3 text-[10px] md:text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                bottomTab === 'inspector' 
                  ? 'text-violet-400 border-violet-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Inspektur Variabel
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
                <span className="text-gray-600 italic">Belum ada output. Klik "Jalankan" untuk melihat hasil.</span>
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
                  Belum ada variabel terdeteksi. Definisikan variabel (`let`, `const`, atau `var`) di tingkat teratas (*top-level*), lalu klik "Jalankan" untuk menginspeksi nilainya secara langsung.
                </span>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs font-mono select-text border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 uppercase font-sans text-[9px] md:text-[10px] tracking-wider select-none">
                        <th className="py-2 px-3">Nama</th>
                        <th className="py-2 px-3">Tipe</th>
                        <th className="py-2 px-3">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/50">
                      {variables.map((v, idx) => {
                        let badgeColor = "bg-slate-800 text-slate-400 border-slate-700";
                        if (v.type === 'string') badgeColor = "bg-amber-950/30 text-amber-400 border-amber-800/50";
                        else if (v.type === 'number') badgeColor = "bg-blue-950/30 text-blue-400 border-blue-800/50";
                        else if (v.type === 'boolean') badgeColor = "bg-violet-950/30 text-violet-400 border-violet-800/50";
                        else if (v.type === 'array') badgeColor = "bg-emerald-950/30 text-emerald-400 border-emerald-800/50";
                        else if (v.type === 'object') badgeColor = "bg-cyan-950/30 text-cyan-400 border-cyan-800/50";
                        else if (v.type === 'function') badgeColor = "bg-rose-950/30 text-rose-400 border-rose-800/50";

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
                              <span className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] uppercase font-bold border ${badgeColor}`}>
                                {v.type}
                              </span>
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
