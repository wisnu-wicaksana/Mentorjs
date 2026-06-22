import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-900 py-8 bg-slate-950 text-center text-xs text-gray-500 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>&copy; {new Date().getFullYear()} MentorJS. All rights reserved.</span>
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <span className="font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
            Google Gemini AI
          </span>
        </div>
      </div>
    </footer>
  );
};
