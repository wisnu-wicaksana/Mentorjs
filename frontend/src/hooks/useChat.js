import { useState } from 'react';
import { sendMentorMessage } from '../services/api';

export const useChat = () => {
  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'mentor', 
      text: 'Halo! Saya MentorJS. Tulis kodemu di sebelah kiri, dan tanyakan apa saja jika kamu bingung atau menemukan error. Saya tidak akan memberikan jawaban langsung, melainkan membantumu memecahkannya!' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (code, consoleOutput) => {
    if (!inputMessage.trim() && !code.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const newUserMessage = { sender: 'user', text: userText || "Tolong periksa kode saya di sebelah kiri." };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);

    const lastErrors = consoleOutput
      .filter(log => log.type === 'error')
      .map(log => log.text)
      .join('\n');

    try {
      const result = await sendMentorMessage(userText, code, lastErrors || null, chatHistory);
      if (result.status === 'success') {
        setChatHistory(prev => [...prev, { sender: 'mentor', text: result.data.reply }]);
      } else {
        throw new Error("Gagal mengambil data");
      }
    } catch (err) {
      console.error("Error useChat hook:", err);
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'mentor', 
          text: '⚠️ Maaf, saya gagal terhubung ke backend API. Pastikan server backend Anda di port 3000 sudah aktif!' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setChatHistory([
      { 
        sender: 'mentor', 
        text: 'Halo! Saya MentorJS. Tulis kodemu di sebelah kiri, dan tanyakan apa saja jika kamu bingung atau menemukan error. Saya tidak akan memberikan jawaban langsung, melainkan membantumu memecahkannya!' 
      }
    ]);
  };

  return {
    chatHistory,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    resetChat
  };
};
