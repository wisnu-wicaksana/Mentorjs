import { useState, useCallback } from 'react';
import { sendMentorMessage, historyAPI } from '../services/api';
import { useAuth } from './useAuth';

const DEFAULT_WELCOME_MESSAGE = {
  sender: 'mentor',
  text: "Halo! Saya adalah MentorJS. Tulis kode Anda di sebelah kiri, dan tanyakan apa saja jika Anda bingung atau menemukan error. Saya tidak akan memberikan jawaban langsung, tetapi akan memandu Anda menyelesaikannya sendiri!"
};

export const useChat = () => {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Memuat daftar sesi belajar dari database
  const loadSessions = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      const response = await historyAPI.getSessions();
      if (response.status === 'success') {
        setSessions(response.data);
        return response.data;
      }
    } catch (err) {
      console.error('Gagal mengambil daftar sesi:', err.message);
    }
    return [];
  }, [isAuthenticated]);

  // 2. Memilih & Memuat sesi belajar tertentu ke editor & chat
  const selectSession = useCallback(async (sessionId, onCodeLoaded) => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      setActiveSessionId(sessionId);
      
      const response = await historyAPI.getSession(sessionId);
      if (response.status === 'success' && response.data) {
        const sessionData = response.data;
        
        // Update riwayat chat. Jika kosong, tampilkan pesan selamat datang default
        if (sessionData.messages && sessionData.messages.length > 0) {
          setChatHistory(sessionData.messages);
        } else {
          setChatHistory([DEFAULT_WELCOME_MESSAGE]);
        }
        
        // Panggil callback untuk memuat kode ke editor
        if (onCodeLoaded) {
          onCodeLoaded(sessionData.lastSavedCode || '');
        }
      }
    } catch (err) {
      console.error('Gagal memuat detail sesi:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 3. Membuat sesi baru
  const createSession = useCallback(async (initialCode = '', onCodeLoaded) => {
    if (!isAuthenticated) return null;
    try {
      setIsLoading(true);
      const response = await historyAPI.createSession('Sesi Belajar Baru', initialCode);
      if (response.status === 'success' && response.data) {
        const newSession = response.data;
        
        // Muat ulang daftar sesi agar sidebar terupdate
        await loadSessions();
        
        // Pasang sesi baru sebagai sesi aktif
        setActiveSessionId(newSession.id);
        setChatHistory([DEFAULT_WELCOME_MESSAGE]);
        
        if (onCodeLoaded) {
          onCodeLoaded(newSession.lastSavedCode || '');
        }
        return newSession.id;
      }
    } catch (err) {
      console.error('Gagal membuat sesi baru:', err.message);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [isAuthenticated, loadSessions]);

  // 4. Menghapus sesi belajar
  const deleteSession = useCallback(async (sessionId, onCodeLoaded) => {
    if (!isAuthenticated) {
      resetChat();
      if (onCodeLoaded) onCodeLoaded('');
      return;
    }
    try {
      const response = await historyAPI.deleteSession(sessionId);
      if (response.status === 'success') {
        const updatedList = await loadSessions();
        
        // Jika sesi yang dihapus adalah sesi aktif saat ini
        if (activeSessionId === sessionId) {
          if (updatedList.length > 0) {
            // Pindahkan ke sesi pertama yang tersisa
            await selectSession(updatedList[0].id, onCodeLoaded);
          } else {
            // Jika tidak ada sesi tersisa, bersihkan workspace
            setActiveSessionId(null);
            setChatHistory([DEFAULT_WELCOME_MESSAGE]);
            if (onCodeLoaded) onCodeLoaded('');
          }
        }
      }
    } catch (err) {
      console.error('Gagal menghapus sesi:', err.message);
    }
  }, [isAuthenticated, activeSessionId, loadSessions, selectSession]);

  // 5. Mengirim Pesan Chat & Menyimpannya ke DB secara Transaksional
  const sendMessage = async (code, consoleOutput) => {
    const userText = inputMessage.trim();
    if (!userText && !code.trim()) return;

    setInputMessage('');
    setIsLoading(true);

    // Siapkan pesan user untuk UI lokal
    const newUserMessage = { 
      sender: 'user', 
      text: userText || "Tolong periksa kode saya di editor kiri." 
    };
    
    // Update local state instan agar tidak terasa lambat
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);

    // Kumpulkan error log dari console output
    const lastErrors = consoleOutput
      .filter(log => log.type === 'error')
      .map(log => log.text)
      .join('\n');

    try {
      // Panggil API mentor, sertakan activeSessionId agar backend mencatat ke DB
      const result = await sendMentorMessage(
        userText, 
        code, 
        lastErrors || null, 
        chatHistory, 
        isAuthenticated ? activeSessionId : null
      );

      if (result.status === 'success') {
        setChatHistory(prev => [...prev, { sender: 'mentor', text: result.data.reply }]);
        
        // Muat ulang daftar sesi karena judul sesi mungkin otomatis berubah 
        // dari "Sesi Belajar Baru" menjadi ringkasan pesan pertama user
        if (isAuthenticated) {
          await loadSessions();
        }
      } else {
        throw new Error("Gagal mengambil respon mentor");
      }
    } catch (err) {
      console.error("Error saat mengirim pesan:", err);
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'mentor', 
          text: '⚠️ Maaf, gagal menghubungkan ke AI Mentor. Silakan periksa koneksi server lokal Anda.'  
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setChatHistory([DEFAULT_WELCOME_MESSAGE]);
  };

  return {
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
    sendMessage,
    resetChat
  };
};
