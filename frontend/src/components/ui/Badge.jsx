
export const Badge = ({ type = 'default', children, className = '' }) => {
  const baseStyle = "px-2 py-0.5 rounded text-[9px] md:text-[10px] uppercase font-bold border select-none transition-all";
  
  const colors = {
    default: "bg-slate-800 text-slate-400 border-slate-700",
    string: "bg-amber-950/30 text-amber-400 border-amber-800/50",
    number: "bg-blue-950/30 text-blue-400 border-blue-800/50",
    boolean: "bg-violet-950/30 text-violet-400 border-violet-800/50",
    array: "bg-emerald-950/30 text-emerald-400 border-emerald-800/50",
    object: "bg-cyan-950/30 text-cyan-400 border-cyan-800/50",
    function: "bg-rose-950/30 text-rose-400 border-rose-800/50",
  };

  const styleClass = colors[type.toLowerCase()] || colors.default;

  return (
    <span className={`${baseStyle} ${styleClass} ${className}`}>
      {children}
    </span>
  );
};
