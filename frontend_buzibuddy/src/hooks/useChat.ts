import { useState, useEffect, useCallback } from 'react';
import { Message, ChatSession, WebhookSettings } from '../lib/types';
import { sendChatMessage } from '../lib/api';

const LOCAL_SESSIONS_KEY = 'buzibuddy-sessions';
const LOCAL_CURRENT_ID_KEY = 'buzibuddy-current-id';
const LOCAL_SETTINGS_KEY = 'buzibuddy-settings';

const DEFAULT_SETTINGS: WebhookSettings = {
  webhookUrl: 'http://localhost:5678/webhook-test/buzibuddy-frontend-connect',
  useProxy: true, // Default to true for best compatibility in the cloud preview
};

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; question: string } | null>(null);
  const [settings, setSettings] = useState<WebhookSettings>(DEFAULT_SETTINGS);

  // Initialize data on load
  useEffect(() => {
    // 1. Load Settings
    const savedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings, using defaults', e);
      }
    }

    // 2. Load Sessions
    const savedSessions = localStorage.getItem(LOCAL_SESSIONS_KEY);
    let loadedSessions: ChatSession[] = [];
    if (savedSessions) {
      try {
        loadedSessions = JSON.parse(savedSessions);
        setSessions(loadedSessions);
      } catch (e) {
        console.error('Failed to parse chat sessions', e);
      }
    }

    // 3. Load Current Session ID
    const savedCurrentId = localStorage.getItem(LOCAL_CURRENT_ID_KEY);
    if (savedCurrentId && loadedSessions.some((s) => s.id === savedCurrentId)) {
      setCurrentSessionId(savedCurrentId);
    } else if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
    } else {
      // Start a fresh chat session automatically if none exists
      const newSessionId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: newSessionId,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions([newSession]);
      setCurrentSessionId(newSessionId);
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify([newSession]));
      localStorage.setItem(LOCAL_CURRENT_ID_KEY, newSessionId);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updatedSessions));
  };

  // Switch to a different session
  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    localStorage.setItem(LOCAL_CURRENT_ID_KEY, sessionId);
    setError(null);
  }, []);

  // Start a new chat session
  const startNewChat = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newSessionId);
    localStorage.setItem(LOCAL_CURRENT_ID_KEY, newSessionId);
    setError(null);
    return newSessionId;
  }, [sessions]);

  // Delete a specific session
  const deleteSession = useCallback((sessionId: string) => {
    const filtered = sessions.filter((s) => s.id !== sessionId);
    saveSessions(filtered);

    if (currentSessionId === sessionId) {
      if (filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
        localStorage.setItem(LOCAL_CURRENT_ID_KEY, filtered[0].id);
      } else {
        // If everything is deleted, start a new one
        const newSessionId = crypto.randomUUID();
        const newSession: ChatSession = {
          id: newSessionId,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveSessions([newSession]);
        setCurrentSessionId(newSessionId);
        localStorage.setItem(LOCAL_CURRENT_ID_KEY, newSessionId);
      }
    }
    setError(null);
  }, [sessions, currentSessionId]);

  // Clear all chats
  const clearAllChats = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveSessions([newSession]);
    setCurrentSessionId(newSessionId);
    localStorage.setItem(LOCAL_CURRENT_ID_KEY, newSessionId);
    setError(null);
  }, []);

  // Update app settings
  const saveSettings = useCallback((newSettings: WebhookSettings) => {
    setSettings(newSettings);
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(newSettings));
  }, []);

  // Get current active session
  const activeSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Send message implementation
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !currentSessionId) return;

    setError(null);

    // 1. Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Find the session and update it
    const sessionIndex = sessions.findIndex((s) => s.id === currentSessionId);
    if (sessionIndex === -1) return;

    const currentSession = sessions[sessionIndex];
    const isFirstMessage = currentSession.messages.length === 0;
    
    // Set chat title from the first message
    const updatedTitle = isFirstMessage 
      ? text.length > 24 
        ? text.substring(0, 24) + '...' 
        : text 
      : currentSession.title;

    const updatedSession: ChatSession = {
      ...currentSession,
      title: updatedTitle,
      messages: [...currentSession.messages, userMessage],
      updatedAt: Date.now(),
    };

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;
    
    // Reorder sessions to bring active session to top
    const reordered = [
      updatedSession,
      ...updatedSessions.filter((s) => s.id !== currentSessionId),
    ];
    saveSessions(reordered);

    // 2. Send request to n8n webhook
    setLoading(true);
    try {
      const responseContent = await sendChatMessage(text, currentSessionId, settings);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };

      // Get freshest reference of sessions since states might have changed during network request
      const latestSessions = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || '[]');
      const latestIndex = latestSessions.findIndex((s: ChatSession) => s.id === currentSessionId);
      
      if (latestIndex !== -1) {
        const latestSession = latestSessions[latestIndex];
        const finalSession: ChatSession = {
          ...latestSession,
          messages: [...latestSession.messages, assistantMessage],
          updatedAt: Date.now(),
        };
        const finalSessions = [...latestSessions];
        finalSessions[latestIndex] = finalSession;
        saveSessions(finalSessions);
      }
    } catch (err: any) {
      console.error('Error sending chat message:', err);
      setError({
        message: err.message || 'An error occurred while connecting to BuziBuddy.',
        question: text,
      });
    } finally {
      setLoading(false);
    }
  }, [sessions, currentSessionId, settings]);

  // Retry sending the failed message
  const retryLastMessage = useCallback(() => {
    if (!error) return;
    const questionToRetry = error.question;
    setError(null);
    sendMessage(questionToRetry);
  }, [error, sendMessage]);

  return {
    sessions,
    activeSession,
    currentSessionId,
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
  };
}
