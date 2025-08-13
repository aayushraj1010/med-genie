'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { ChatMessageItem } from '@/components/chat-message-item';
import { UserProfileModal } from '@/components/user-profile-modal';
import { BackgroundParticles } from '@/components/background-particles';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  personalizedHealthQuestionAnswering,
  type PersonalizedHealthQuestionAnsweringInput,
  type PersonalizedHealthQuestionAnsweringOutput
} from '@/ai/flows/personalized-health-question-answering';
import type { ChatMessage, UserProfile, AISuggestedKey } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from '@/hooks/use-chat-history';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, ArrowUp, Info, History, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ChatHistorySidebar } from '@/components/chat-history-sidebar';
import { ChatHistoryButton } from '@/components/chat-history-button';

const VoiceSearch = dynamic(() => import('@/components/VoiceSearch'), {
  ssr: false,
});

const initialWelcomeMessage: ChatMessage = {
  id: 'welcome-message',
  text: "Hello! I'm Med Genie, your AI health assistant. How can I help you today? For more personalized answers, you can provide some optional health information.",
  sender: 'ai',
  timestamp: Date.now(),
};

const defaultUserProfile: UserProfile = {
  medicalHistory: '',
  lifestyle: '',
  symptoms: '',
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentAiFollowUpKey, setCurrentAiFollowUpKey] = useState<AISuggestedKey | undefined>(undefined);
  const [lastUserQuestionForFollowUp, setLastUserQuestionForFollowUp] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initialize chat history
  const {
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
  } = useChatHistory();

  // Track the last loaded session ID to detect changes
  const lastLoadedSessionIdRef = useRef<string | null>(null);

  // Initialize a new session or load existing session
  useEffect(() => {
    if (isInitialized) {
      // Case 1: No active session ID - create a new session
      if (!activeSessionId) {
        createSession(initialWelcomeMessage);
        return;
      }

      // Case 2: Session ID changed - load the session messages
      if (activeSessionId !== lastLoadedSessionIdRef.current) {
        console.log(`Loading session: ${activeSessionId}`);
        const session = getSession(activeSessionId);

        if (session && session.messages.length > 0) {
          console.log(`Found session with ${session.messages.length} messages`);
          // Always set messages when switching to a different session
          setMessages(session.messages);
          lastLoadedSessionIdRef.current = activeSessionId;
        } else {
          console.log(`Session not found or empty`);
          // If the session is empty, set the welcome message
          setMessages([initialWelcomeMessage]);
          lastLoadedSessionIdRef.current = activeSessionId;
        }
      }
    }
  }, [isInitialized, activeSessionId, createSession, getSession, initialWelcomeMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Define all handlers without circular dependencies

  const handleFeedback = useCallback((messageId: string, feedback: 'good' | 'bad') => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );

    // Also update the message in the active session
    if (activeSessionId) {
      const session = getSession(activeSessionId);
      if (session) {
        const updatedMessages = session.messages.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        );
        updateSession(activeSessionId, updatedMessages);
      }
    }

    console.log(`Feedback for message ${messageId}: ${feedback}`);
  }, [activeSessionId, getSession, updateSession]);

  const handleSubmitQuestion = useCallback(async (question: string) => {
    if (!activeSessionId) {
      console.error("No active session to add message to");
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: question,
      sender: 'user',
      timestamp: Date.now(),
    };

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);

    // Add user message to session
    addMessage(activeSessionId, userMessage);

    setIsLoading(true);

    const aiLoadingMessage: ChatMessage = {
      id: `ai-loading-${Date.now()}`,
      text: 'Thinking...',
      sender: 'ai',
      timestamp: Date.now(),
      isLoading: true,
    };

    // Add loading message to UI
    setMessages((prev) => [...prev, aiLoadingMessage]);

    try {
      if (/hospital|emergency/i.test(question)) {
        const locationMatch = question.match(/(?:in|near|nearby|around)\s+([A-Za-z ]+)/i);
        const location = locationMatch?.[1]?.trim();

        if (location) {
          try {
            const res = await fetch(`/api/nearby-hospitals?state=${encodeURIComponent(location)}`);
            const data = await res.json();

            if (Array.isArray(data.hospitals) && data.hospitals.length > 0) {
              const hospitalList = data.hospitals.slice(0, 5).map((h: any) =>
                `🏥 **${h.name}**\n📍 ${h.address}\n📞 ${h.contact}`
              ).join('\n\n');

              const aiResponseMessage: ChatMessage = {
                id: `ai-hospital-${Date.now()}`,
                text: `Here are some nearby hospitals in **${location}**:\n\n${hospitalList}`,
                sender: 'ai',
                timestamp: Date.now(),
              };

              // Update UI by removing loading message and adding response
              setMessages(prev => [...prev.filter(msg => msg.id !== aiLoadingMessage.id), aiResponseMessage]);

              // Update session
              addMessage(activeSessionId, aiResponseMessage);

              setIsLoading(false);
              return;
            } else {
              throw new Error("No hospitals found");
            }
          } catch (err) {
            console.error("Error fetching hospital data", err);
            const aiErrorMessage: ChatMessage = {
              id: `a-hospital-error-${Date.now()}`,
              text: `😔 I couldn't find hospital data for "${location}". Please check the location name.`,
              sender: 'ai',
              timestamp: Date.now(),
            };

            // Update UI by removing loading message and adding error
            setMessages(prev => [...prev.filter(msg => msg.id !== aiLoadingMessage.id), aiErrorMessage]);

            // Update session
            addMessage(activeSessionId, aiErrorMessage);

            setIsLoading(false);
            return;
          }
        }
      }

      // Format conversation history for context (excluding loading messages and current question)
      const formatConversationHistory = (messages: ChatMessage[]): string => {
        return messages
          .filter(msg => !msg.isLoading && msg.id !== userMessage.id)
          .slice(-10) // Only include last 10 messages for context
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Med Genie'}: ${msg.text}`)
          .join('\n');
      };

      const input: PersonalizedHealthQuestionAnsweringInput = {
        question,
        medicalHistory: userProfile.medicalHistory,
        lifestyle: userProfile.lifestyle,
        symptoms: userProfile.symptoms,
        conversationHistory: formatConversationHistory(messages),
      };

      const result: PersonalizedHealthQuestionAnsweringOutput = await personalizedHealthQuestionAnswering(input);

      // Remove loading message from UI
      setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessage.id));

      if (result.answer) {
        const aiInfoMessage: ChatMessage = {
          id: `ai-info-${Date.now()}`,
          text: result.answer,
          sender: 'ai',
          timestamp: Date.now(),
        };

        // Add info message to UI
        setMessages(prev => [...prev, aiInfoMessage]);

        // Add info message to session
        addMessage(activeSessionId, aiInfoMessage);
      }

      if (result.followUpQuestion) {
        let keyToUpdate: AISuggestedKey | undefined;
        const followUpLower = result.followUpQuestion.toLowerCase();

        if (followUpLower.includes('medical history')) keyToUpdate = 'medicalHistory';
        else if (followUpLower.includes('lifestyle')) keyToUpdate = 'lifestyle';
        else if (followUpLower.includes('symptom')) keyToUpdate = 'symptoms';

        const aiFollowUpMessage: ChatMessage = {
          id: `ai-followup-${Date.now()}`,
          text: result.followUpQuestion as string,
          sender: 'ai',
          timestamp: Date.now(),
          isFollowUpPrompt: true,
        };

        // Add follow-up message to UI
        setMessages(prev => [...prev, aiFollowUpMessage]);

        // Add follow-up message to session
        addMessage(activeSessionId, aiFollowUpMessage);

        setCurrentAiFollowUpKey(keyToUpdate);
        setLastUserQuestionForFollowUp(question);
        setIsProfileModalOpen(true);
      }

    } catch (error) {
      console.error('AI response error:', error);

      // Remove loading message from UI
      setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessage.id));

      const aiErrorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        text: '😔 Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: Date.now(),
      };

      // Add error message to UI
      setMessages(prev => [...prev, aiErrorMessage]);

      // Add error message to session
      addMessage(activeSessionId, aiErrorMessage);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    activeSessionId,
    addMessage,
    userProfile,
    toast,
    setCurrentAiFollowUpKey,
    setLastUserQuestionForFollowUp,
    setIsProfileModalOpen
  ]);

  const handleNewChat = useCallback(() => {
    if (isInitialized) {
      // Create a new session with the welcome message
      const newSessionId = createSession(initialWelcomeMessage);

      // Set messages to just the welcome message
      setMessages([initialWelcomeMessage]);

      console.log(`Created new chat session: ${newSessionId}`);
    }
  }, [isInitialized, createSession, initialWelcomeMessage]);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading || !isInitialized) return;

    // Save the input value to a local variable to avoid closure issues
    const currentInput = input;

    // Clear the input field immediately
    setInput('');

    // If there's no active session, create one first
    if (!activeSessionId) {
      // Create a new session first
      createSession(initialWelcomeMessage);

      // Wait for the next render cycle before submitting the question
      requestAnimationFrame(() => {
        handleSubmitQuestion(currentInput);
      });
    } else {
      // We have an active session, just submit the question
      handleSubmitQuestion(currentInput);
    }
  }, [input, isLoading, isInitialized, activeSessionId, createSession, handleSubmitQuestion, initialWelcomeMessage]);

  const handleSaveProfile = useCallback(async (newProfileData: UserProfile) => {
    const oldProfile = { ...userProfile };
    setUserProfile(newProfileData);
    setIsProfileModalOpen(false);

    if (!activeSessionId) {
      console.error("No active session to add message to");
      return;
    }

    if (lastUserQuestionForFollowUp) {
      const updatedInput: PersonalizedHealthQuestionAnsweringInput = {
        question: lastUserQuestionForFollowUp,
        ...newProfileData,
      };

      const profileUpdatedMessage: ChatMessage = {
        id: `system-profile-updated-${Date.now()}`,
        text: "✅ Your information has been updated. I'll use this to refine my answer.",
        sender: 'ai',
        timestamp: Date.now(),
        isFollowUpPrompt: true,
      };

      // Add profile updated message to UI
      setMessages(prev => [...prev, profileUpdatedMessage]);

      // Add profile updated message to session
      addMessage(activeSessionId, profileUpdatedMessage);

      const loadingId = `ai-loading-refine-${Date.now()}`;
      const loadingMessage: ChatMessage = {
        id: loadingId,
        text: 'Refining answer...',
        sender: 'ai',
        timestamp: Date.now(),
        isLoading: true,
      };

      // Add loading message to UI
      setMessages(prev => [...prev, loadingMessage]);

      setIsLoading(true);

      try {
        const result = await personalizedHealthQuestionAnswering(updatedInput);

        // Remove loading message from UI
        setMessages(prev => prev.filter(msg => msg.id !== loadingId));

        const refinedResponseMessage: ChatMessage = {
          id: `ai-refined-response-${Date.now()}`,
          text: result.answer || "Thanks! Let me know how else I can help.",
          sender: 'ai',
          timestamp: Date.now(),
        };

        // Add refined response message to UI
        setMessages(prev => [...prev, refinedResponseMessage]);

        // Add refined response message to session
        addMessage(activeSessionId, refinedResponseMessage);

        if (result.followUpQuestion) {
          const refinedFollowUpMessage: ChatMessage = {
            id: `ai-refined-followup-${Date.now()}`,
            text: result.followUpQuestion as string,
            sender: 'ai',
            timestamp: Date.now(),
            isFollowUpPrompt: true,
          };

          // Add refined follow-up message to UI
          setMessages(prev => [...prev, refinedFollowUpMessage]);

          // Add refined follow-up message to session
          addMessage(activeSessionId, refinedFollowUpMessage);

          toast({
            title: "Further Info Needed",
            description: "The AI has another follow-up question.",
          });
        }

      } catch (error) {
        console.error('Refinement error:', error);

        // Remove loading message from UI
        setMessages(prev => prev.filter(msg => msg.id !== loadingId));

        const errorMessage: ChatMessage = {
          id: `ai-error-refine-${Date.now()}`,
          text: '😔 Error refining the answer. Try again later.',
          sender: 'ai',
          timestamp: Date.now(),
        };

        // Add error message to UI
        setMessages(prev => [...prev, errorMessage]);

        // Add error message to session
        addMessage(activeSessionId, errorMessage);

        toast({
          variant: 'destructive',
          title: 'Refinement Error',
          description: 'AI failed to refine the response.',
        });
      } finally {
        setIsLoading(false);
        setLastUserQuestionForFollowUp(undefined);
        setCurrentAiFollowUpKey(undefined);
      }
    } else if (JSON.stringify(oldProfile) !== JSON.stringify(newProfileData)) {
      const profileAckMessage: ChatMessage = {
        id: `system-profile-ack-${Date.now()}`,
        text: "Your health information has been updated. How can I assist you now?",
        sender: 'ai',
        timestamp: Date.now(),
      };

      // Add profile acknowledgment message to UI
      setMessages(prev => [...prev, profileAckMessage]);

      // Add profile acknowledgment message to session
      addMessage(activeSessionId, profileAckMessage);
    }
  }, [
    activeSessionId,
    addMessage,
    userProfile,
    setUserProfile,
    setIsProfileModalOpen,
    lastUserQuestionForFollowUp,
    toast,
    setLastUserQuestionForFollowUp,
    setCurrentAiFollowUpKey
  ]);

  const handleCloseProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);

    if (!activeSessionId) {
      console.error("No active session to add message to");
      return;
    }

    if (lastUserQuestionForFollowUp && currentAiFollowUpKey) {
      const relevantField = userProfile[currentAiFollowUpKey];
      if (!relevantField || relevantField.trim() === '') {
        const cancelFollowUpMessage: ChatMessage = {
          id: `ai-cancel-followup-${Date.now()}`,
          text: "Okay, I understand. If you change your mind, you can update your info anytime. How else can I help you today?",
          sender: 'ai',
          timestamp: Date.now(),
          isFollowUpPrompt: true,
        };

        // Add cancel follow-up message to UI
        setMessages(prev => [...prev, cancelFollowUpMessage]);

        // Add cancel follow-up message to session
        addMessage(activeSessionId, cancelFollowUpMessage);
      }
    }
    setLastUserQuestionForFollowUp(undefined);
    setCurrentAiFollowUpKey(undefined);
  }, [
    activeSessionId,
    addMessage,
    setIsProfileModalOpen,
    lastUserQuestionForFollowUp,
    currentAiFollowUpKey,
    userProfile,
    setLastUserQuestionForFollowUp,
    setCurrentAiFollowUpKey
  ]);

  return (
    <div className="flex flex-col h-screen bg-med-genie-dark text-foreground">
      <BackgroundParticles />

      <div className="flex flex-1 overflow-hidden content-container">
        {/* Chat History Sidebar (desktop) */}
        {!isMobile && showHistorySidebar && (
          <aside className="w-72 border-r border-border bg-card hidden md:block" role="complementary" aria-label="Chat history">
            <ChatHistorySidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onNewChat={handleNewChat}
              onSelectSession={setActiveSessionId}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              onClearAllSessions={clearAllSessions}
            />
          </aside>
        )}

        <main className="flex flex-col flex-1 p-4 overflow-hidden" role="main" aria-label="Chat with Med Genie">
          <header className="flex justify-between mb-4 shrink-0">
            <div className="flex space-x-2">
              {/* Mobile Chat History Button */}
              {isMobile ? (
                <ChatHistoryButton
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onNewChat={handleNewChat}
                  onSelectSession={setActiveSessionId}
                  onDeleteSession={deleteSession}
                  onRenameSession={renameSession}
                  onClearAllSessions={clearAllSessions}
                />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                  aria-label={showHistorySidebar ? "Hide chat history" : "Show chat history"}
                >
                  <History className="mr-2 h-4 w-4" />
                  {showHistorySidebar ? "Hide History" : "Show History"}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleNewChat}
                aria-label="Start a new chat"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>

            <Button variant="outline" onClick={() => setIsProfileModalOpen(true)} aria-label="Update your health information">
              <Info className="mr-2 h-4 w-4" />
              Update Health Info
            </Button>
          </header>

          <ScrollArea className="flex-grow min-h-0 mb-4 rounded-lg" viewportRef={viewportRef} role="log" aria-label="Chat conversation">
            <div className="space-y-4 max-w-3xl mx-auto pr-4">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} onFeedback={handleFeedback} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="shrink-0">
            <form onSubmit={handleFormSubmit} className="relative w-full max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your health..."
                disabled={isLoading}
                className="pr-24"
              />
              <VoiceSearch setInput={setInput} />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </main>

        <aside className="md:w-1/3 lg:w-80 xl:w-96 p-4 border-l border-border/40 bg-card overflow-y-auto hidden md:flex md:flex-col" role="complementary" aria-label="Important medical notice">
          <div className="sticky top-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Med Genie</h2>
              <p className="text-sm text-gray-800 dark:text-gray-300">Your AI Health Assistant</p>
            </div>

            <Alert variant="default" className="card-enhanced border-2 border-primary/30 shadow-lg pulse-animation">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Important Notice</AlertTitle>
              <AlertDescription className="leading-relaxed text-gray-800 dark:text-gray-300">
                Med Genie provides general health information and is not a substitute for professional medical advice. Always consult a doctor for serious concerns.
              </AlertDescription>
            </Alert>

            <div className="mt-6 p-4 rounded-lg card-enhanced border border-primary/20">
              <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">How to Use Med Genie</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-gray-800 dark:text-gray-300">
                <li>Ask any health-related questions</li>
                <li>Update your health profile for better answers</li>
                <li>Get AI-powered health insights</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        onSave={handleSaveProfile}
        currentProfile={userProfile}
        aiSuggestedKey={currentAiFollowUpKey}
      />
    </div>
  );
}