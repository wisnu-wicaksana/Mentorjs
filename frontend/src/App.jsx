import { useState } from 'react';
import { Homepage } from './pages/Home/Homepage';
import { SandboxPage } from './pages/Sandbox/SandboxPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'workspace'

  if (currentPage === 'home') {
    return <Homepage onLaunchApp={() => setCurrentPage('workspace')} />;
  }

  return <SandboxPage onBackToHome={() => setCurrentPage('home')} />;
}

export default App;