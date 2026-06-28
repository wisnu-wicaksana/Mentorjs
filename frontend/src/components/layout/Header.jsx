import { ArrowRight, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Header = ({ onLaunchApp, onGoToAuth }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b border-gray-900 bg-slate-950/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all select-none">
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
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            // Jika sudah login, tampilkan informasi user & tombol Logout
            <div className="flex items-center gap-3">
              <div className="hidden xs:flex items-center gap-1.5 text-xs text-gray-400">
                <User size={13} className="text-violet-400" />
                <span className="max-w-[100px] truncate">{user?.username}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/20 rounded-lg transition-all cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            // Jika belum login, tampilkan tombol Masuk (Login)
            <button
              type="button"
              onClick={onGoToAuth}
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors px-3 py-2 cursor-pointer select-none"
            >
              Sign In
            </button>
          )}

          {/* Tombol Utama untuk masuk ke Workspace */}
          <Button 
            variant="primary" 
            size="sm"
            onClick={onLaunchApp}
          >
            <span>Launch App</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </header>
  );
};
