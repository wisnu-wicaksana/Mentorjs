import { useState } from 'react';
import { Homepage } from './pages/Home/Homepage';
import { SandboxPage } from './pages/Sandbox/SandboxPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'workspace' | 'auth'

  // 1. Tampilkan layar loading saat verifikasi status login (session check)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3 select-none">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-sans tracking-wide">Menghubungkan Sesi Aman...</span>
      </div>
    );
  }

  // 2. Tampilkan Halaman Login & Registrasi
  if (currentPage === 'auth') {
    return (
      <AuthPage 
        onLoginSuccess={() => setCurrentPage('workspace')} 
        onBackToHome={() => setCurrentPage('home')} 
      />
    );
  }

  // 3. Tampilkan aplikasi utama
  if (currentPage === 'home') {
    return (
      <Homepage 
        onLaunchApp={() => setCurrentPage('workspace')} 
        onGoToAuth={() => setCurrentPage('auth')}
      />
    );
  }

  return (
    <SandboxPage 
      onBackToHome={() => setCurrentPage('home')} 
      onGoToAuth={() => setCurrentPage('auth')}
    />
  );
}

export default App;