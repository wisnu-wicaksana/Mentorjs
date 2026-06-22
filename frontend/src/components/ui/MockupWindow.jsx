import React from 'react';

export const MockupWindow = ({ title = 'mentorjs-workspace', children, className = '' }) => {
  return (
    <div className={`relative mx-auto max-w-4xl rounded-xl border border-gray-800 bg-slate-950/80 p-1.5 shadow-2xl backdrop-blur-xl select-none shadow-violet-900/5 ${className}`}>
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-900 bg-slate-950 rounded-t-lg">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <span className="text-xs text-gray-500 font-mono">{title}</span>
        <div className="w-12"></div>
      </div>
      {/* Window Body */}
      {children}
    </div>
  );
};
