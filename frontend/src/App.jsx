import { useState } from 'react'
import { useCodeRunner } from './hooks/useCodeRunner'
import { useChat } from './hooks/useChat'
import { EditorPanel } from './components/EditorPanel'
import { ChatPanel } from './components/ChatPanel'
import { BottomNav } from './components/BottomNav'
import { StatusBar } from './components/StatusBar'

function App() {
  const [activeTab, setActiveTab] = useState('editor')
  
  // Custom hooks untuk memisahkan state/logika bisnis (Separation of Concerns)
  const { code, setCode, consoleOutput, runCode, clearConsole } = useCodeRunner()
  const { chatHistory, inputMessage, setInputMessage, isLoading, sendMessage, resetChat } = useChat()

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Editor & Konsol Output */}
        <EditorPanel 
          activeTab={activeTab}
          code={code}
          setCode={setCode}
          runCode={runCode}
          consoleOutput={consoleOutput}
          clearConsole={clearConsole}
        />

        {/* Chat AI Mentor Socratic */}
        <ChatPanel 
          activeTab={activeTab}
          chatHistory={chatHistory}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          isLoading={isLoading}
          onSendMessage={() => sendMessage(code, consoleOutput)}
          onResetChat={resetChat}
        />

      </div>

      {/* Navigasi Mobile */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Status Bar (IDE Footer style) */}
      <StatusBar />

    </div>
  )
}

export default App