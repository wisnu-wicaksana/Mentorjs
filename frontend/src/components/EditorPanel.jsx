
import { Play, Trash2, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';

const TEMPLATES = {
  default: `// Tulis kode JavaScript di sini\nconst mentor = "AuraJS";\nconsole.log("Halo dari " + mentor + "!");`,
  loops: `// Contoh Perulangan (Loops) di JavaScript\nconsole.log("--- Mencetak angka 1 sampai 5 ---");\nfor (let i = 1; i <= 5; i++) {\n  console.log("Angka:", i);\n}`,
  arrays: `// Contoh Array & Manipulasinya\nconst buah = ["Apel", "Mangga", "Pisang"];\nconsole.log("Daftar buah:", buah);\n\nconsole.log("Mencetak buah satu per satu:");\nbuah.forEach((item, index) => {\n  console.log(\`Buah ke-\${index + 1}: \${item}\`);\n});`,
  functions: `// Contoh Fungsi (Functions)\nfunction hitungLuasPersegi(sisi) {\n  return sisi * sisi;\n}\n\nconst sisi = 8;\nconst luas = hitungLuasPersegi(sisi);\nconsole.log(\`Luas persegi dengan sisi \${sisi} adalah \${luas}\`);`
};

export const EditorPanel = ({ activeTab, code, setCode, runCode, consoleOutput, clearConsole }) => {
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
