
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2, Mic, MicOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useToast } from '@/hooks/use-toast';

interface ChatInputFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({ onSubmit, isLoading, placeholder = "Ask Med Genie about your health..." }: ChatInputFormProps) {
  const [question, setQuestion] = useState('');
  const { toast } = useToast();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useSpeechToText((finalTranscript) => {
    // Auto-submit when speech ends and there's a transcript
    if (finalTranscript.trim() && !isLoading) {
      onSubmit(finalTranscript);
      resetTranscript();
      setQuestion(''); // Clear the input field
    }
  });

  // Update question when transcript changes
  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  // Show error toast when speech recognition fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
      // Stop listening on error
      stopListening();
    }
  }, [error, toast, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
      // Force reset the listening state
      setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 100);
    }
    
    await onSubmit(question);
    setQuestion('');
    resetTranscript();
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border/40 shadow-sm" role="form" aria-label="Chat with Med Genie">
      <div className="container max-w-3xl mx-auto flex items-center space-x-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading || isListening}
          aria-label="Type your health question here"
          aria-describedby="chat-input-description"
          aria-required="true"
        />
        <Button
          type="button"
          onClick={handleMicToggle}
          disabled={isLoading}
          size="icon"
          variant={isListening ? "destructive" : "outline"}
          className={`shrink-0 transition-all duration-200 ${
            isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''
          }`}
          aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">
            {isListening ? "Stop voice recording" : "Start voice recording"}
          </span>
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !question.trim()} 
          size="icon" 
          className="shrink-0"
          aria-label={isLoading ? "Sending message, please wait" : "Send your health question to Med Genie"}
          aria-describedby={isLoading ? "loading-description" : undefined}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
          <span className="sr-only">
            {isLoading ? "Sending message, please wait" : "Send message"}
          </span>
        </Button>
      </div>
      <div id="chat-input-description" className="sr-only">
        Type your health question and press Enter or click Send to get advice from Med Genie. You can also use the microphone button for voice input.
      </div>
      {isLoading && (
        <div id="loading-description" className="sr-only">
          Med Genie is processing your question, please wait
        </div>
      )}
      {isListening && (
        <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Listening... Speak now</span>
        </div>
      )}
    </form>
  );
}

