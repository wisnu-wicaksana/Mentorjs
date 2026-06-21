import { useState } from 'react';
import { sendMentorMessage } from '../services/api';

export const useChat = () => {
  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'mentor', 
      text: "Hello! I'm MentorJS. Write your code on the left, and ask me anything if you are confused or find an error. I won't give you direct answers, but I will help you solve it yourself!" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (code, consoleOutput) => {
    if (!inputMessage.trim() && !code.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const newUserMessage = { sender: 'user', text: userText || "Please check my code on the left." };
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
          text: '⚠️ Sorry, I failed to connect to the backend API. Please make sure your backend server is running on port 3000!'  
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
        text: "Hello! I'm MentorJS. Write your code on the left, and ask me anything if you are confused or find an error. I won't give you direct answers, but I will help you solve it yourself!" 
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
