import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { SettingsModal } from './components/SettingsModal';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    sessions,
    activeSession,
    loading,
    error,
    settings,
    startNewChat,
    selectSession,
    deleteSession,
    clearAllChats,
    saveSettings,
    sendMessage,
    retryLastMessage,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Close sidebar automatically on mobile screens on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Run on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-800 antialiased font-sans">
      {/* ChatGPT-style sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={activeSession?.id || null}
        isOpen={isSidebarOpen}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onStartNewChat={startNewChat}
        onClearAllChats={clearAllChats}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={openSettings}
      />

      {/* Main chat view pane */}
      <div className="flex flex-1 flex-col h-full min-w-0">
        {/* Dynamic header navigation */}
        <Header
          activeSession={activeSession}
          onToggleSidebar={toggleSidebar}
          onOpenSettings={openSettings}
        />

        {/* Message feed & prompt panel */}
        <Chat
          activeSession={activeSession}
          loading={loading}
          error={error}
          settings={settings}
          onSendMessage={sendMessage}
          onRetry={retryLastMessage}
          onOpenSettings={openSettings}
        />
      </div>

      {/* Connection & proxy configuration overlay */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        onSaveSettings={saveSettings}
      />
    </div>
  );
}
