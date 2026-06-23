import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header = ({ onLaunchApp }) => {
  return (
    <header className="border-b border-gray-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-900/30">
            M
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            MentorJS
          </span>
        </div>
        
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        </nav>

        <Button 
          variant="primary" 
          size="sm"
          onClick={onLaunchApp}
        >
          <span>Launch App</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </header>
  );
};
