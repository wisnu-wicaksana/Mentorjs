import { useState, useEffect } from 'react';
import { totalCodeLength } from '../constants/templates';
import { totalUserLength, totalChatLength } from '../constants/mockupData';

export const useMockupAnimation = () => {
  const [codeCharCount, setCodeCharCount] = useState(0);
  const [userCharCount, setUserCharCount] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [chatCharCount, setChatCharCount] = useState(0);
  const [showMentor, setShowMentor] = useState(false);

  useEffect(() => {
    let timer;
    let currentStage = 'typing-code'; // 'typing-code' | 'show-console' | 'typing-user' | 'send-user' | 'typing-chat' | 'pause-end'
    let currentCodeCount = 0;
    let currentUserCount = 0;
    let currentChatCount = 0;

    const run = () => {
      if (currentStage === 'typing-code') {
        if (currentCodeCount < totalCodeLength) {
          currentCodeCount += 1;
          setCodeCharCount(currentCodeCount);
          timer = setTimeout(run, 30);
        } else {
          currentStage = 'show-console';
          timer = setTimeout(run, 500);
        }
      } else if (currentStage === 'show-console') {
        setShowConsole(true);
        currentStage = 'typing-user';
        timer = setTimeout(run, 800);
      } else if (currentStage === 'typing-user') {
        if (currentUserCount < totalUserLength) {
          currentUserCount += 1;
          setUserCharCount(currentUserCount);
          timer = setTimeout(run, 35);
        } else {
          currentStage = 'send-user';
          timer = setTimeout(run, 500);
        }
      } else if (currentStage === 'send-user') {
        currentStage = 'typing-chat';
        timer = setTimeout(run, 800);
      } else if (currentStage === 'typing-chat') {
        setShowMentor(true);
        if (currentChatCount < totalChatLength) {
          currentChatCount += 1;
          setChatCharCount(currentChatCount);
          timer = setTimeout(run, 45);
        } else {
          currentStage = 'pause-end';
          timer = setTimeout(run, 5000);
        }
      } else if (currentStage === 'pause-end') {
        currentCodeCount = 0;
        currentUserCount = 0;
        currentChatCount = 0;
        setCodeCharCount(0);
        setUserCharCount(0);
        setChatCharCount(0);
        setShowConsole(false);
        setShowMentor(false);
        currentStage = 'typing-code';
        timer = setTimeout(run, 1000);
      }
    };

    timer = setTimeout(run, 1000);
    return () => clearTimeout(timer);
  }, []);

  return {
    codeCharCount,
    userCharCount,
    showConsole,
    chatCharCount,
    showMentor,
  };
};
