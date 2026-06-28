import { useState, useEffect } from 'react';
import { Homepage } from './pages/Home/Homepage';
import { SandboxPage } from './pages/Sandbox/SandboxPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { authLoading } = useAuth();
  
  // State halaman yang di-sinkronkan dengan Hash URL
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'auth', 'workspace'];
    if (validPages.includes(hash)) return hash;
    return localStorage.getItem('currentPage') || 'home';
  });

  // Fungsi helper untuk navigasi mengganti hash URL
  const navigateTo = (page) => {
    window.location.hash = '#' + page;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'auth', 'workspace'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
        localStorage.setItem('currentPage', hash);
      } else {
        // Fallback jika mengetik hash acak
        window.location.hash = '#home';
      }
    };

    // Dengarkan perubahan hash URL (tombol back/forward browser)
    window.addEventListener('hashchange', handleHashChange);

    // Setel hash awal jika kosong
    const initialHash = window.location.hash.replace('#', '');
    const validPages = ['home', 'auth', 'workspace'];
    if (!validPages.includes(initialHash)) {
      window.location.hash = '#' + currentPage;
    } else {
      localStorage.setItem('currentPage', initialHash);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPage]);

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
        onLoginSuccess={() => navigateTo('workspace')} 
        onBackToHome={() => navigateTo('home')} 
      />
    );
  }

  // 3. Tampilkan aplikasi utama
  if (currentPage === 'home') {
    return (
      <Homepage 
        onLaunchApp={() => navigateTo('workspace')} 
        onGoToAuth={() => navigateTo('auth')}
      />
    );
  }

  return (
    <SandboxPage 
      onBackToHome={() => navigateTo('home')} 
      onGoToAuth={() => navigateTo('auth')}
    />
  );
}

export default App;