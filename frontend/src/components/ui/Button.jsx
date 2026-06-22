import React from 'react';

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all transform active:scale-95 cursor-pointer select-none";
  
  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-sm sm:text-base",
  };

  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-900/30 border border-violet-500/20",
    secondary: "bg-slate-900 hover:bg-slate-800 border border-gray-800 text-gray-300",
    white: "bg-white hover:bg-gray-100 text-slate-950 shadow-xl",
  };

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
