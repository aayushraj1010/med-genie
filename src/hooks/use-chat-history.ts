import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/lib/types';

// Storage key for localStorage
const STORAGE_KEY = 'med-genie-chat-history';

// Maximum number of sessions to store
const MAX_SESSIONS = 50;

// Chat session type
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  updatedAt: string;
  preview?: string;
}

// Chat history data structure
interface ChatHistoryData {
  sessions: ChatSession[];
  activeSessionId: string | null;
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as ChatHistoryData;
          setSessions(parsed.sessions || []);
          setActiveSessionId(parsed.activeSessionId || null);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // Save to localStorage whenever sessions or active session change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          sessions,
          activeSessionId
        }));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [sessions, activeSessionId, isInitialized]);

  // Create a new chat session
  const createSession = useCallback((initialMessage?: ChatMessage): string => {
    const newSessionId = `session-${Date.now()}`;
    
    // Create preview from initial message if available
    const preview = initialMessage 
      ? `${initialMessage.sender === 'user' ? 'You: ' : 'Med Genie: '}${initialMessage.text.substring(0, 40)}${initialMessage.text.length > 40 ? '...' : ''}` 
      : 'New conversation';
    
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Conversation',
      messages: initialMessage ? [initialMessage] : [],
      updatedAt: new Date().toISOString(),
      preview
    };
    
    console.log(`Creating new session: ${newSessionId}`);
    
    setSessions(prev => {
      // Add new session to the beginning of the array
      const updatedSessions = [newSession, ...prev];
      
      // Ensure we don't exceed the maximum number of sessions
      if (updatedSessions.length > MAX_SESSIONS) {
        return updatedSessions.slice(0, MAX_SESSIONS);
      }
      
      return updatedSessions;
    });
    
    // Set the active session ID
    setActiveSessionId(newSessionId);
    
    return newSessionId;
  }, []);

  // Get a specific session by ID
  const getSession = useCallback((sessionId: string): ChatSession | undefined => {
    return sessions.find(session => session.id === sessionId);
  }, [sessions]);

  // Get the current active session
  const getActiveSession = useCallback((): ChatSession | undefined => {
    if (!activeSessionId) return undefined;
    return getSession(activeSessionId);
  }, [activeSessionId, getSession]);

  // Add a message to a session
  const addMessage = useCallback((sessionId: string, message: ChatMessage) => {
    if (!sessionId) return;
    
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        // Add the message to the session
        const updatedMessages = [...session.messages, message];
        
        // Create a preview from the message
        const preview = `${message.sender === 'user' ? 'You: ' : 'Med Genie: '}${message.text.substring(0, 40)}${message.text.length > 40 ? '...' : ''}`;
        
        // Update the session name if it's still the default and this is a user message
        let name = session.name;
        if (name === 'New Conversation' && message.sender === 'user') {
          name = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
        }
        
        return {
          ...session,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          name,
          preview
        };
      }
      return session;
    }));
  }, []);

  // Update all messages in a session
  const updateSession = useCallback((sessionId: string, messages: ChatMessage[]) => {
    if (!sessionId || messages.length === 0) return;
    
    setSessions(prev => {
      // Check if the session exists
      const sessionExists = prev.some(session => session.id === sessionId);
      
      if (!sessionExists) {
        console.log(`Session ${sessionId} not found, cannot update`);
        return prev;
      }
      
      return prev.map(session => {
        if (session.id === sessionId) {
          // Generate a name from the first user message if it exists
          let name = session.name;
          if (name === 'New Conversation' && messages.length > 0) {
            const firstUserMessage = messages.find(m => m.sender === 'user');
            if (firstUserMessage) {
              name = firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
            }
          }
          
          // Generate a preview from the last message
          const lastMessage = messages[messages.length - 1];
          const preview = lastMessage ? 
            `${lastMessage.sender === 'user' ? 'You: ' : 'Med Genie: '}${lastMessage.text.substring(0, 40)}${lastMessage.text.length > 40 ? '...' : ''}` : 
            'Empty conversation';
          
          console.log(`Updating session ${sessionId} with ${messages.length} messages`);
          
          return {
            ...session,
            messages,
            name,
            preview,
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      });
    });
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If we're deleting the active session, clear the active session ID
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  // Rename a session
  const renameSession = useCallback((sessionId: string, name: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, name } : session
    ));
  }, []);

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
  }, []);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    getSession,
    getActiveSession,
    addMessage,
    updateSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    isInitialized
  };
}