import { useState, useEffect, useRef, useCallback } from 'react';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useChat } from '../../hooks/useChat';
import { EditorPanel } from './components/EditorPanel';
import { ChatPanel } from './components/ChatPanel';
import { BottomNav } from './components/BottomNav';
import { StatusBar } from './components/StatusBar';
import { HistorySidebar } from './components/HistorySidebar';
import { historyAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ProfileModal } from './components/ProfileModal';

const DEFAULT_CODE = `// Write JavaScript code here\nconst mentor = "MentorJS";\nconsole.log("Hello from " + mentor + "!");`;

export const SandboxPage = ({ onBackToHome, onGoToAuth }) => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // States & Refs for Split Screen Drag Resizer
  const [editorWidth, setEditorWidth] = useState(65); // Default 65% width
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsDragging(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    if (!containerWidth) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = mouseMoveEvent.clientX - containerRect.left;
    const newPercentage = (newLeftWidth / containerWidth) * 100;

    // Constrain width between 30% and 80%
    if (newPercentage >= 30 && newPercentage <= 80) {
      setEditorWidth(newPercentage);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isDragging, resize, stopResizing]);
  
  const { code, setCode, consoleOutput, variables, runCode, clearConsole } = useCodeRunner();
  const { 
    sessions, 
    activeSessionId, 
    chatHistory, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    loadSessions, 
    selectSession, 
    createSession, 
    deleteSession, 
    sendMessage 
  } = useChat();

  // 1. Inisialisasi sesi belajar saat SandboxPage dipasang
  useEffect(() => {
    let active = true;
    const initWorkspace = async () => {
      const list = await loadSessions();
      if (!active) return;
      
      if (list && list.length > 0) {
        // Load sesi paling terakhir diupdate
        await selectSession(list[0].id, setCode);
      } else {
        // Buat sesi baru jika database masih kosong
        await createSession(DEFAULT_CODE, setCode);
      }
    };
    initWorkspace();
    
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1.5. Reset workspace state ketika user logout (transisi ke mode tamu)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!isAuthenticated) {
      setCode(DEFAULT_CODE);
      clearConsole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 2. Handler Pindah Sesi (Auto-save kode sesi lama sebelum pindah)
  const handleSelectSession = async (sessionId) => {
    if (isAuthenticated && activeSessionId) {
      try {
        await historyAPI.saveCode(activeSessionId, code);
      } catch (err) {
        console.error("Gagal auto-save kode:", err.message);
      }
    }
    await selectSession(sessionId, setCode);
    setIsSidebarOpen(false); // Tutup drawer sidebar di mobile setelah memilih
  };

  // 3. Handler Buat Sesi Baru (Auto-save kode lama)
  const handleCreateSession = async () => {
    if (isAuthenticated && activeSessionId) {
      try {
        await historyAPI.saveCode(activeSessionId, code);
      } catch (err) {
        console.error("Gagal auto-save kode:", err.message);
      }
    }
    await createSession(DEFAULT_CODE, setCode);
    setIsSidebarOpen(false);
  };

  // 4. Handler Kembali ke Home (Auto-save kode aktif)
  const handleBackToHome = async () => {
    if (isAuthenticated && activeSessionId) {
      try {
        await historyAPI.saveCode(activeSessionId, code);
      } catch (err) {
        console.error("Gagal auto-save kode:", err.message);
      }
    }
    onBackToHome();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden relative">
      
      {/* 1. Backdrop Overlay (Muncul di semua mode jika sidebar dibuka) */}
      {isAuthenticated && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Kiri (Riwayat Sesi Chat & Akun) */}
      {isAuthenticated && (
        <div className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}>
          <HistorySidebar 
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onCreateSession={handleCreateSession}
            onDeleteSession={(id) => deleteSession(id, setCode)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>
      )}

      {/* 3. Konten Utama Workspace */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Editor & Panel Chat Sampingan */}
        <div 
          ref={containerRef} 
          className="flex-1 flex flex-col md:flex-row landscape:flex-row min-h-0 relative"
          style={isDragging ? { userSelect: 'none', cursor: 'col-resize' } : {}}
        >
          
          {/* Editor Panel */}
          <EditorPanel 
            style={isDesktop ? { width: `${editorWidth}%`, flex: 'none' } : {}}
            activeTab={activeTab}
            code={code}
            setCode={setCode}
            runCode={runCode}
            consoleOutput={consoleOutput}
            clearConsole={clearConsole}
            variables={variables}
            onBackToHome={handleBackToHome}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            isAuthenticated={isAuthenticated}
            onGoToAuth={onGoToAuth}
            onOpenProfile={() => setIsProfileOpen(true)}
          />

          {/* Vertical Divider Resizer (Desktop only) */}
          <div 
            onMouseDown={startResizing}
            className={`hidden md:block w-1 hover:w-1.5 bg-gray-800/80 hover:bg-violet-500 cursor-col-resize select-none transition-all relative z-20 shrink-0 ${isDragging ? 'bg-violet-500 w-1.5' : ''}`}
          >
            {/* Tiny vertical visual dots indicator inside divider */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col justify-center gap-1.5 opacity-30 hover:opacity-100">
              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
            </div>
          </div>

          {/* Chat Panel */}
          <ChatPanel 
            style={isDesktop ? { width: `${100 - editorWidth}%`, flex: 'none' } : {}}
            activeTab={activeTab}
            chatHistory={chatHistory}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isLoading={isLoading}
            onSendMessage={() => sendMessage(code, consoleOutput)}
            onResetChat={async () => {
              if (isAuthenticated && activeSessionId) {
                // Untuk reset chat di DB, kita hapus lalu buat sesi baru
                await deleteSession(activeSessionId, setCode);
              } else {
                // Untuk guest, cukup bersihkan chat history di hook
                await deleteSession(null, setCode);
              }
            }}
            isAuthenticated={isAuthenticated}
          />

        </div>

        {/* Navigasi Tab Mobile */}
        <div className="md:hidden landscape:hidden shrink-0">
          <BottomNav 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Status Bar */}
        <div className="short-screen-hide-status shrink-0">
          <StatusBar />
        </div>

      </div>

      {/* Profile & Analytics Modal */}
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        sessionsCount={sessions.length}
        onGoToAuth={onGoToAuth}
        onProfileUpdated={(updatedUser) => setUser(updatedUser)}
      />

    </div>
  );
};
