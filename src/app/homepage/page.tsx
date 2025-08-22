"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import dynamic from "next/dynamic";
import { ChatMessageItem } from "@/components/chat-message-item";
import { UserProfileModal } from "@/components/user-profile-modal";
import { BackgroundParticles } from "@/components/background-particles";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  personalizedHealthQuestionAnswering,
  type PersonalizedHealthQuestionAnsweringInput,
  type PersonalizedHealthQuestionAnsweringOutput,
} from "@/ai/flows/personalized-health-question-answering";
import type { ChatMessage, UserProfile, AISuggestedKey } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertCircle,
  ArrowUp,
  Info,
  History,
  Plus,
  Camera,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import { ChatHistoryButton } from "@/components/chat-history-button";
import { QuickReplyGrid } from "@/components/QuickReplyGrid";

const VoiceSearch = dynamic(() => import("@/components/VoiceSearch"), {
} from '@/ai/flows/personalized-health-question-answering';
import type { ChatMessage, UserProfile, AISuggestedKey } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from '@/hooks/use-chat-history';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, ArrowUp, Info, History, Plus, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ChatHistorySidebar } from '@/components/chat-history-sidebar';
import { ChatHistoryButton } from '@/components/chat-history-button';
import { QuickReplyGrid } from '@/components/QuickReplyGrid';
import { InputSanitizer } from '@/lib/input-sanitizer';

const VoiceSearch = dynamic(() => import('@/components/VoiceSearch'), {
  ssr: false,
});

const initialWelcomeMessage: ChatMessage = {
  id: "welcome-message",
  text: "Hello! I'm Med Genie, your AI health assistant. How can I help you today? For more personalized answers, you can provide some optional health information.",
  sender: "ai",
  timestamp: Date.now(),
};

const defaultUserProfile: UserProfile = {
  medicalHistory: "",
  lifestyle: "",
  symptoms: "",
};

function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialWelcomeMessage,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentAiFollowUpKey, setCurrentAiFollowUpKey] = useState<
    AISuggestedKey | undefined
  >(undefined);
  const [lastUserQuestionForFollowUp, setLastUserQuestionForFollowUp] =
    useState<string | undefined>(undefined);
  const [input, setInput] = useState("");
  const [currentAiFollowUpKey, setCurrentAiFollowUpKey] = useState<AISuggestedKey | undefined>(undefined);
  const [lastUserQuestionForFollowUp, setLastUserQuestionForFollowUp] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string>('');
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    getSession,
    addMessage,
    updateSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    isInitialized,
  } = useChatHistory();

  const lastLoadedSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isInitialized) {
      if (!activeSessionId) {
        createSession(initialWelcomeMessage);
        return;
      }

      if (activeSessionId !== lastLoadedSessionIdRef.current) {
        const session = getSession(activeSessionId);
        if (session && session.messages.length > 0) {
          setMessages(session.messages);
          lastLoadedSessionIdRef.current = activeSessionId;
        } else {
          setMessages([initialWelcomeMessage]);
          lastLoadedSessionIdRef.current = activeSessionId;
        }
      }
    }
  }, [isInitialized, activeSessionId, createSession, getSession]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleFeedback = useCallback(
    (messageId: string, feedback: "good" | "bad") => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, feedback } : msg
        )
      );

      if (activeSessionId) {
        const session = getSession(activeSessionId);
        if (session) {
          const updatedMessages = session.messages.map((msg) =>
            msg.id === messageId ? { ...msg, feedback } : msg
          );
          updateSession(activeSessionId, updatedMessages);
        }
      }
    },
    [activeSessionId, getSession, updateSession]
  );

  const handleSubmitQuestion = useCallback(
    async (question: string) => {
      if (!activeSessionId) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: question,
        sender: "user",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      addMessage(activeSessionId, userMessage);
      setIsLoading(true);

      const aiLoadingMessage: ChatMessage = {
        id: `ai-loading-${Date.now()}`,
        text: "Thinking...",
        sender: "ai",
        timestamp: Date.now(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, aiLoadingMessage]);

      try {
        if (/hospital|emergency/i.test(question)) {
          const locationMatch = question.match(
            /(?:in|near|nearby|around)\s+([A-Za-z ]+)/i
          );
          const location = locationMatch?.[1]?.trim();
          if (location) {
            try {
              const res = await fetch(
                `/api/nearby-hospitals?state=${encodeURIComponent(location)}`
              );
              const data = await res.json();
              if (Array.isArray(data.hospitals) && data.hospitals.length > 0) {
                const hospitalList = data.hospitals
                  .slice(0, 5)
                  .map(
                    (h: any) =>
                      `🏥 **${h.name}**\n📍 ${h.address}\n📞 ${h.contact}`
                  )
                  .join("\n\n");
                const aiResponseMessage: ChatMessage = {
                  id: `ai-hospital-${Date.now()}`,
                  text: `Here are some nearby hospitals in **${location}**:\n\n${hospitalList}`,
                  sender: "ai",
                  timestamp: Date.now(),
                };
                setMessages((prev) => [
                  ...prev.filter((msg) => msg.id !== aiLoadingMessage.id),
                  aiResponseMessage,
                ]);
                addMessage(activeSessionId, aiResponseMessage);
                setIsLoading(false);
                return;
              } else {
                throw new Error("No hospitals found");
              }
            } catch (err) {
              const aiErrorMessage: ChatMessage = {
                id: `a-hospital-error-${Date.now()}`,
                text: `😔 I couldn't find hospital data for "${location}". Please check the location name.`,
                sender: "ai",
                timestamp: Date.now(),
              };
              setMessages((prev) => [
                ...prev.filter((msg) => msg.id !== aiLoadingMessage.id),
                aiErrorMessage,
              ]);
              addMessage(activeSessionId, aiErrorMessage);
              setIsLoading(false);
              return;
            }
          }
        }

        const formatConversationHistory = (messages: ChatMessage[]): string =>
          messages
            .filter((msg) => !msg.isLoading && msg.id !== userMessage.id)
            .slice(-10)
            .map(
              (msg) =>
                `${msg.sender === "user" ? "User" : "Med Genie"}: ${msg.text}`
            )
            .join("\n");
        const input: PersonalizedHealthQuestionAnsweringInput = {
          question,
          medicalHistory: userProfile.medicalHistory,
          lifestyle: userProfile.lifestyle,
          symptoms: userProfile.symptoms,
          conversationHistory: formatConversationHistory(messages),
        };
        const result: PersonalizedHealthQuestionAnsweringOutput =
          await personalizedHealthQuestionAnswering(input);

        setMessages((prev) =>
          prev.filter((msg) => msg.id !== aiLoadingMessage.id)
        );

        if (result.answer) {
          const aiInfoMessage: ChatMessage = {
            id: `ai-info-${Date.now()}`,
            text: result.answer,
            sender: "ai",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, aiInfoMessage]);
          addMessage(activeSessionId, aiInfoMessage);
        }

        if (result.followUpQuestion) {
          let keyToUpdate: AISuggestedKey | undefined;
          const followUpLower = result.followUpQuestion.toLowerCase();
          if (followUpLower.includes("medical history"))
            keyToUpdate = "medicalHistory";
          else if (followUpLower.includes("lifestyle"))
            keyToUpdate = "lifestyle";
          else if (followUpLower.includes("symptom")) keyToUpdate = "symptoms";
          const aiFollowUpMessage: ChatMessage = {
            id: `ai-followup-${Date.now()}`,
            text: result.followUpQuestion as string,
            sender: "ai",
            timestamp: Date.now(),
            isFollowUpPrompt: true,
          };
          setMessages((prev) => [...prev, aiFollowUpMessage]);
          addMessage(activeSessionId, aiFollowUpMessage);
          setCurrentAiFollowUpKey(keyToUpdate);
          setLastUserQuestionForFollowUp(question);
          setIsProfileModalOpen(true);
        }
      } catch (error) {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== aiLoadingMessage.id)
        );
        const aiErrorMessage: ChatMessage = {
          id: `ai-error-${Date.now()}`,
          text: "😔 Sorry, I encountered an error. Please try again later.",
          sender: "ai",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiErrorMessage]);
        addMessage(activeSessionId, aiErrorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to get response from AI.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, addMessage, userProfile, toast]
  );

  const handleNewChat = useCallback(() => {
    if (isInitialized) {
      createSession(initialWelcomeMessage);
      setMessages([initialWelcomeMessage]);
    }
  }, [isInitialized, createSession]);

  const handleInputChange = (value: string) => {
    // Clear any previous errors
    setInputError("");

    // Validate input in real-time
    const validation = InputSanitizer.validateInput(value, 5000);

    if (!validation.isValid) {
      setInputError(validation.errors[0] || "Invalid input detected");
      // Still allow typing but show warning
    }

    setInput(value);
  };

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim() || isLoading || !isInitialized) return;

      const currentInput = input;
      setInput("");


      // Sanitize input before processing
      const sanitizedInput = InputSanitizer.sanitizeChatMessage(input);

      // Final validation before submission
      const validation = InputSanitizer.validateInput(sanitizedInput, 5000);

      if (!validation.isValid) {
        setInputError(validation.errors[0] || "Input contains potentially dangerous content");
        return;
      }

      // Log security event if original input was different from sanitized
      if (input !== sanitizedInput) {
        InputSanitizer.logSecurityEvent("Homepage chat input sanitized", input, sanitizedInput);
      }

      const currentInput = sanitizedInput;
      setInput('');
      setInputError('');

      if (!activeSessionId) {
        createSession(initialWelcomeMessage);
        requestAnimationFrame(() => handleSubmitQuestion(currentInput));
      } else {
        handleSubmitQuestion(currentInput);
      }
    },
    [
      input,
      isLoading,
      isInitialized,
      activeSessionId,
      createSession,
      handleSubmitQuestion,
    ]
  );

  const handleSaveProfile = useCallback(
    async (newProfileData: UserProfile) => {
      const oldProfile = { ...userProfile };
      setUserProfile(newProfileData);
      setIsProfileModalOpen(false);
      if (!activeSessionId) return;

      if (lastUserQuestionForFollowUp) {
        const updatedInput: PersonalizedHealthQuestionAnsweringInput = {
          question: lastUserQuestionForFollowUp,
          ...newProfileData,
        };
        const profileUpdatedMessage: ChatMessage = {
          id: `system-profile-updated-${Date.now()}`,
          text: "✅ Your information has been updated. I'll use this to refine my answer.",
          sender: "ai",
          timestamp: Date.now(),
          isFollowUpPrompt: true,
        };
        setMessages((prev) => [...prev, profileUpdatedMessage]);
        addMessage(activeSessionId, profileUpdatedMessage);
        const loadingId = `ai-loading-refine-${Date.now()}`;
        const loadingMessage: ChatMessage = {
          id: loadingId,
          text: "Refining answer...",
          sender: "ai",
          timestamp: Date.now(),
          isLoading: true,
        };
        setMessages((prev) => [...prev, loadingMessage]);
        setIsLoading(true);

        try {
          const result = await personalizedHealthQuestionAnswering(
            updatedInput
          );
          setMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
          const refinedResponseMessage: ChatMessage = {
            id: `ai-refined-response-${Date.now()}`,
            text: result.answer || "Thanks! Let me know how else I can help.",
            sender: "ai",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, refinedResponseMessage]);
          addMessage(activeSessionId, refinedResponseMessage);
          if (result.followUpQuestion) {
            const refinedFollowUpMessage: ChatMessage = {
              id: `ai-refined-followup-${Date.now()}`,
              text: result.followUpQuestion as string,
              sender: "ai",
              timestamp: Date.now(),
              isFollowUpPrompt: true,
            };
            setMessages((prev) => [...prev, refinedFollowUpMessage]);
            addMessage(activeSessionId, refinedFollowUpMessage);
            toast({
              title: "Further Info Needed",
              description: "The AI has another follow-up question.",
            });
          }
        } catch (error) {
          setMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
          const errorMessage: ChatMessage = {
            id: `ai-error-refine-${Date.now()}`,
            text: "😔 Error refining the answer. Try again later.",
            sender: "ai",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          addMessage(activeSessionId, errorMessage);
          toast({
            variant: "destructive",
            title: "Refinement Error",
            description: "AI failed to refine the response.",
          });
        } finally {
          setIsLoading(false);
          setLastUserQuestionForFollowUp(undefined);
          setCurrentAiFollowUpKey(undefined);
        }
      } else if (
        JSON.stringify(oldProfile) !== JSON.stringify(newProfileData)
      ) {
        const profileAckMessage: ChatMessage = {
          id: `system-profile-ack-${Date.now()}`,
          text: "Your health information has been updated. How can I assist you now?",
          sender: "ai",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, profileAckMessage]);
        addMessage(activeSessionId, profileAckMessage);
      }
    },
    [
      activeSessionId,
      addMessage,
      userProfile,
      lastUserQuestionForFollowUp,
      toast,
    ]
  );

  const handleCloseProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
    if (!activeSessionId) return;
    if (lastUserQuestionForFollowUp && currentAiFollowUpKey) {
      const relevantField = userProfile[currentAiFollowUpKey];
      if (!relevantField || relevantField.trim() === "") {
        const cancelFollowUpMessage: ChatMessage = {
          id: `ai-cancel-followup-${Date.now()}`,
          text: "Okay, I understand. If you change your mind, you can update your info anytime. How else can I help you today?",
          sender: "ai",
          timestamp: Date.now(),
          isFollowUpPrompt: true,
        };
        setMessages((prev) => [...prev, cancelFollowUpMessage]);
        addMessage(activeSessionId, cancelFollowUpMessage);
      }
    }
    setLastUserQuestionForFollowUp(undefined);
    setCurrentAiFollowUpKey(undefined);
  }, [
    activeSessionId,
    addMessage,
    lastUserQuestionForFollowUp,
    currentAiFollowUpKey,
    userProfile,
  ]);

  const handlePromptClick = (query: string) => {
    handleSubmitQuestion(query);
  };

  return (
    <div className="flex flex-col h-screen bg-med-genie-dark text-foreground">
      <BackgroundParticles />

      <div className="flex flex-1 overflow-hidden content-container">
        {!isMobile && showHistorySidebar && (
          <aside
            className="w-72 border-r border-border bg-card hidden md:block"
            role="complementary"
            aria-label="Chat history"
          >
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

        <main
          className="flex flex-col flex-1 p-4 overflow-hidden"
          role="main"
          aria-label="Chat with Med Genie"
        >
          <header className="flex justify-between mb-4 shrink-0">
            <div className="flex space-x-2">
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
                  aria-label={
                    showHistorySidebar
                      ? "Hide chat history"
                      : "Show chat history"
                  }
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
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="Update your health information"
            >
              <Info className="mr-2 h-4 w-4" />
              Update Health Info
            </Button>
          </header>

          <ScrollArea
            className="flex-grow min-h-0 mb-4 rounded-lg"
            viewportRef={viewportRef}
            role="log"
            aria-label="Chat conversation"
          >
            <div className="space-y-4 max-w-3xl mx-auto pr-4">
              {/* NOTE: The QuickReplyGrid is no longer here */}
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onFeedback={handleFeedback}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="shrink-0">
            <div className="w-full max-w-3xl mx-auto">
              {/* <<< QUICK REPLY GRID IS NOW HERE, PERMANENTLY VISIBLE >>> */}
              <QuickReplyGrid onPromptClick={handlePromptClick} />

              <form onSubmit={handleFormSubmit} className="relative">
                <div className="relative">
                  <Input
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Ask anything about your health..."
                    disabled={isLoading}
                    className={`pr-24 ${inputError ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {inputError && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-xs">
                      ⚠️ {inputError}
                    </div>
                  )}
                </div>
                <VoiceSearch setInput={setInput} />
                <label className="cursor-pointer flex items-center justify-center h-8 w-8 bg-muted rounded absolute right-20 top-1/2 -translate-y-1/2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        const data = await res.json();
                        console.log("Uploaded image:", data);
                      } catch (err) {
                        console.error("Upload failed:", err);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim() || !!inputError}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </div>
          </div>
        </main>

        <aside
          className="md:w-1/3 lg:w-80 xl:w-96 p-4 border-l border-border/40 bg-card overflow-y-auto hidden md:flex md:flex-col"
          role="complementary"
          aria-label="Important medical notice"
        >
          <div className="sticky top-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Med Genie
              </h2>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                Your AI Health Assistant
              </p>
            </div>
            <Alert
              variant="default"
              className="card-enhanced border-2 border-primary/30 shadow-lg pulse-animation"
            >
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                Important Notice
              </AlertTitle>
              <AlertDescription className="leading-relaxed text-gray-800 dark:text-gray-300">
                Med Genie provides general health information and is not a
                substitute for professional medical advice. Always consult a
                doctor for serious concerns.
              </AlertDescription>
            </Alert>
            <div className="mt-6 p-4 rounded-lg card-enhanced border border-primary/20">
              <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
                How to Use Med Genie
              </h3>
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

// Wrap with protected route
export default function ProtectedHomePage() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
