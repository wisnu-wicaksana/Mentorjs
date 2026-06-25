import { useState, useEffect } from 'react';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import { useChat } from '../../hooks/useChat';
import { EditorPanel } from './components/EditorPanel';
import { ChatPanel } from './components/ChatPanel';
import { BottomNav } from './components/BottomNav';
import { StatusBar } from './components/StatusBar';
import { HistorySidebar } from './components/HistorySidebar';
import { historyAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const SandboxPage = ({ onBackToHome, onGoToAuth }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
        await createSession('', setCode);
      }
    };
    initWorkspace();
    
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    await createSession('', setCode);
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
      
      {/* 1. Backdrop Overlay (Hanya muncul di Mobile jika sidebar dibuka) */}
      {isAuthenticated && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Kiri (Riwayat Sesi Chat & Akun) */}
      {isAuthenticated && (
        <div className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <HistorySidebar 
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onCreateSession={handleCreateSession}
            onDeleteSession={(id) => deleteSession(id, setCode)}
          />
        </div>
      )}

      {/* 3. Konten Utama Workspace */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Editor & Panel Chat Sampingan */}
        <div className="flex-1 flex flex-col md:flex-row landscape:flex-row min-h-0">
          
          {/* Editor Panel */}
          <EditorPanel 
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
          />

          {/* Chat Panel */}
          <ChatPanel 
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

    </div>
  );
};
