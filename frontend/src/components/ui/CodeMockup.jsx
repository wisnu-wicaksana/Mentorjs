import { codeTokens, totalCodeLength } from '../../constants/templates';


const renderTokens = (tokens, maxChars) => {
  let charsLeft = maxChars;
  return tokens.map((token, index) => {
    if (charsLeft <= 0) return null;
    const textToShow = token.text.slice(0, charsLeft);
    charsLeft -= token.text.length;
    return (
      <span key={index} className={token.className}>
        {textToShow}
      </span>
    );
  });
};

export const CodeMockup = ({ codeCharCount, showConsole }) => {
  return (
    <div className="flex-1 bg-slate-950 p-4 border-b sm:border-b-0 sm:border-r border-gray-900 overflow-hidden text-left flex flex-col justify-between select-none">
      <div className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs leading-relaxed">
        {renderTokens(codeTokens, codeCharCount)}
        {codeCharCount < totalCodeLength && (
          <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse" />
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-950 min-h-[60px]">
        <span className="text-cyan-400 block text-[9px] uppercase tracking-wider font-sans font-bold select-none mb-1">Console Output</span>
        {showConsole && (
          <span className="text-emerald-300 block animate-fade-in">&gt; Victory!</span>
        )}
      </div>
    </div>
  );
};
