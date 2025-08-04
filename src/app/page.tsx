
'use client';

import { useState, useEffect, useRef } from 'react';
import { SiteHeader } from '@/components/site-header';
import { ChatMessageItem } from '@/components/chat-message-item';
import { ChatInputForm } from '@/components/chat-input-form';
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
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialWelcomeMessage: ChatMessage = {
  id: 'welcome-message',
  text: "Hello! I'm Med Genie, your AI health assistant. How can I help you today? For more personalized answers, you can provide some optional health information.",
  sender: 'ai',
  timestamp: Date.now(),
};


export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentAiFollowUpKey, setCurrentAiFollowUpKey] = useState<AISuggestedKey | undefined>(undefined);
  const [lastUserQuestionForFollowUp, setLastUserQuestionForFollowUp] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (viewportRef.current) {
      const timerId = setTimeout(() => {
        viewportRef.current!.scrollTo({ top: viewportRef.current!.scrollHeight, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [messages]);

  const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  const handleSubmitQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: question,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    const aiLoadingMessage: ChatMessage = {
      id: `ai-loading-${Date.now()}`,
      text: 'Thinking...',
      sender: 'ai',
      timestamp: Date.now(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, aiLoadingMessage]);

    try {
      const input: PersonalizedHealthQuestionAnsweringInput = {
        question,
        medicalHistory: userProfile.medicalHistory,
        lifestyle: userProfile.lifestyle,
        symptoms: userProfile.symptoms,
      };

      const result: PersonalizedHealthQuestionAnsweringOutput = await personalizedHealthQuestionAnswering(input);
      
      setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessage.id)); 

      if (result.followUpQuestion) {
        let keyToUpdate: AISuggestedKey | undefined;
        if (result.followUpQuestion.toLowerCase().includes('medical history')) keyToUpdate = 'medicalHistory';
        else if (result.followUpQuestion.toLowerCase().includes('lifestyle')) keyToUpdate = 'lifestyle';
        else if (result.followUpQuestion.toLowerCase().includes('symptom')) keyToUpdate = 'symptoms';

        const aiInfoMessageText = result.answer && result.answer !== result.followUpQuestion ? result.answer : "To provide a more accurate response, I need a little more information.";
        const aiInfoMessage: ChatMessage = {
            id: `ai-info-${Date.now()}`,
            text: aiInfoMessageText,
            sender: 'ai',
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiInfoMessage]);
        
        const aiFollowUpMessage: ChatMessage = {
          id: `ai-followup-prompt-${Date.now()}`,
          text: result.followUpQuestion, 
          sender: 'ai',
          timestamp: Date.now(),
          isFollowUpPrompt: true, 
        };
        setMessages((prev) => [...prev, aiFollowUpMessage]);
        setCurrentAiFollowUpKey(keyToUpdate);
        setLastUserQuestionForFollowUp(question); 
        setIsProfileModalOpen(true); 

      } else {
        const aiResponseMessage: ChatMessage = {
          id: `ai-response-${Date.now()}`,
          text: result.answer,
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiResponseMessage]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessage.id));
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        text: '😔 Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (newProfileData: UserProfile) => {
    const oldProfile = {...userProfile}; // Capture old profile state
    setUserProfile(newProfileData);
    setIsProfileModalOpen(false);
  
    if (lastUserQuestionForFollowUp) {
      const updatedInput: PersonalizedHealthQuestionAnsweringInput = {
        question: lastUserQuestionForFollowUp,
        medicalHistory: newProfileData.medicalHistory,
        lifestyle: newProfileData.lifestyle,
        symptoms: newProfileData.symptoms,
      };
  
      const profileUpdateMessage: ChatMessage = {
        id: `system-profile-updated-${Date.now()}`,
        text: "✅ Your information has been updated. I'll use this to refine my answer.",
        sender: 'ai',
        timestamp: Date.now(),
        isFollowUpPrompt: true,
      };
      setMessages(prev => [...prev, profileUpdateMessage]);
  
      setIsLoading(true);
      const aiLoadingMessageId = `ai-loading-refine-${Date.now()}`;
      const aiLoadingMessage: ChatMessage = {
        id: aiLoadingMessageId,
        text: 'Refining answer...',
        sender: 'ai',
        timestamp: Date.now(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, aiLoadingMessage]);
  
      try {
        const result: PersonalizedHealthQuestionAnsweringOutput = await personalizedHealthQuestionAnswering(updatedInput);
        setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessageId));
  
        const aiResponseMessage: ChatMessage = {
          id: `ai-refined-response-${Date.now()}`,
          text: result.answer || "Thank you for the information. How else can I help you?",
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiResponseMessage]);
  
        if (result.followUpQuestion) {
          const aiFollowUpMessage: ChatMessage = {
            id: `ai-refined-followup-${Date.now()}`,
            text: result.followUpQuestion,
            sender: 'ai',
            timestamp: Date.now(),
            isFollowUpPrompt: true,
          };
          setMessages((prev) => [...prev, aiFollowUpMessage]);
          console.warn("AI requested further follow-up after profile update:", result.followUpQuestion);
          toast({
            title: "Further Information Requested",
            description: "The AI has another follow-up question. Please see the chat.",
          });
        }
      } catch (error) {
        console.error('Error re-fetching AI response after profile update:', error);
        setMessages(prev => prev.filter(msg => msg.id !== aiLoadingMessageId));
        const errorMessage: ChatMessage = {
          id: `ai-error-refine-${Date.now()}`,
          text: '😔 Sorry, I encountered an error while refining the answer. Please try again.',
          sender: 'ai',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          variant: 'destructive',
          title: 'Refinement Error',
          description: 'Failed to get refined response from AI.',
        });
      } finally {
        setIsLoading(false);
        setLastUserQuestionForFollowUp(undefined);
        setCurrentAiFollowUpKey(undefined);
      }
    } else {
        // If there was no pending question, just acknowledge the update.
        const acknowledgementMessage: ChatMessage = {
            id: `system-profile-ack-${Date.now()}`,
            text: "Your health information has been updated. How can I assist you now?",
            sender: 'ai',
            timestamp: Date.now(),
        };
        // Only add if profile actually changed to avoid duplicate messages on simple close
        if (JSON.stringify(oldProfile) !== JSON.stringify(newProfileData)) {
            setMessages(prev => [...prev, acknowledgementMessage]);
        }
    }
  };
  
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    if (lastUserQuestionForFollowUp && currentAiFollowUpKey) {
      // Check against the latest userProfile state
      const relevantProfileData = userProfile[currentAiFollowUpKey];
      const relevantProfileFieldFilled = relevantProfileData && relevantProfileData.trim() !== '';
      if (!relevantProfileFieldFilled) {
        const cancelFollowUpMessage: ChatMessage = {
          id: `ai-cancel-followup-${Date.now()}`,
          text: "Okay, I understand. If you change your mind, you can update your info anytime. How else can I help you today?",
          sender: 'ai',
          timestamp: Date.now(),
          isFollowUpPrompt: true,
        };
        setMessages(prev => [...prev, cancelFollowUpMessage]);
      }
    }
    setLastUserQuestionForFollowUp(undefined);
    setCurrentAiFollowUpKey(undefined);
  };


  return (
    <div className="flex flex-col h-screen bg-med-genie-dark text-foreground">
      <BackgroundParticles />
      {/* <SiteHeader /> */}
      <div className="flex flex-1 overflow-hidden content-container"> {/* Main content area */}
        
        {/* Left Column: Chat Interface */}
        <main className="flex flex-col flex-1 p-4 overflow-hidden">
          <div className="flex justify-end mb-4 shrink-0">
            <Button variant="outline" onClick={() => setIsProfileModalOpen(true)} className="backdrop-blur-sm bg-opacity-70 bg-card">
        <main className="flex flex-col flex-1 p-4 overflow-hidden" role="main" aria-label="Chat with Med Genie">
          <header className="flex justify-end mb-4 shrink-0">
            <Button variant="outline" onClick={() => setIsProfileModalOpen(true)} aria-label="Update your health information for personalized responses">
              <Info className="mr-2 h-4 w-4" />
              Update Health Info
            </Button>
          </header>

          <ScrollArea className="flex-grow min-h-0 mb-4 rounded-lg" viewportRef={viewportRef}>
            <div className="space-y-4 max-w-3xl mx-auto pr-4">
          <ScrollArea className="flex-grow min-h-0 mb-4" viewportRef={viewportRef} role="log" aria-label="Chat messages">
            <div className="space-y-4 max-w-3xl mx-auto pr-4" role="list" aria-label="Chat conversation">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} onFeedback={handleFeedback} />
              ))}
              <div ref={messagesEndRef} /> {/* This ref helps with initial scroll to bottom, less effective for subsequent messages */}
            </div>
          </ScrollArea>
          
          <div className="shrink-0">
            <ChatInputForm onSubmit={handleSubmitQuestion} isLoading={isLoading} />
          </div>
        </main>

        {/* Right Column: Important Notice */}
        <aside className="md:w-1/3 lg:w-80 xl:w-96 p-4 border-l border-border/40 overflow-y-auto hidden md:flex md:flex-col backdrop-blur-sm bg-opacity-30 bg-card">
           <div className="sticky top-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-primary-foreground mb-2">Med Genie</h2>
              <p className="text-sm text-primary-foreground/80">Your AI Health Assistant</p>
            </div>
            
            <Alert variant="default" className="card-enhanced border-2 border-primary/30 shadow-lg pulse-animation">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-bold mb-2 text-primary-foreground">Important Notice</AlertTitle>
                <AlertDescription className="text-primary-foreground/90 leading-relaxed">

                  Med Genie provides information for general knowledge only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </AlertDescription>
            </Alert>
            
            <div className="mt-6 p-4 rounded-lg card-enhanced border border-primary/20">
              <h3 className="text-md font-semibold mb-2 text-primary-foreground">How to Use Med Genie</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-primary-foreground/90">
                <li>Ask any health-related questions</li>
                <li>Provide your health information for personalized answers</li>
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

    