
export const StatusBar = () => {
  return (
    <div className="bg-slate-950 border-t border-gray-800 px-4 py-1.5 flex justify-between items-center text-[10px] md:text-xs text-gray-500 shrink-0 select-none">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span>System Ready (Online)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Powered by</span>
        <span className="font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
          Google Gemini AI
        </span>
      </div>
    </div>
  );
};
