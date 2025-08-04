'use client';


import { useState, useRef, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2, Mic, MicOff, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { VoiceWaveform } from '@/components/voice-waveform';
import { ScreenReaderAnnouncement } from '@/components/accessibility/screen-reader-announcement';


interface ChatInputFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({
  onSubmit,
  isLoading,
  placeholder = "Ask Med Genie about your health...",
}: ChatInputFormProps) {
  const [question, setQuestion] = useState('');
  const [showSpeechAlert, setShowSpeechAlert] = useState(false);
  const [voiceAnnouncement, setVoiceAnnouncement] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    transcript, 
    isListening, 
    isSupported: speechSupported, 
    error: speechError,
    startListening,
    stopListening
  } = useSpeechRecognition();
  
  // Update question when transcript changes
  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
      
      // Focus the textarea to show the transcribed text
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [transcript]);
  
  // Show alert when there's a speech error
  useEffect(() => {
    if (speechError) {
      setShowSpeechAlert(true);
      setVoiceAnnouncement(`Voice recognition error: ${speechError}. Please try again or use text input.`);
      const timer = setTimeout(() => setShowSpeechAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);
  
  // Announce voice recognition status changes for screen readers
  useEffect(() => {
    if (isListening) {
      setVoiceAnnouncement('Voice recognition started. You can speak now.');
    } else if (voiceAnnouncement.includes('started')) {
      setVoiceAnnouncement('Voice recognition stopped.');
    }
  }, [isListening, voiceAnnouncement]);

  const toggleListening = () => {
    if (!speechSupported) {
      setShowSpeechAlert(true);
      setTimeout(() => setShowSpeechAlert(false), 5000);
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    await onSubmit(question);
    setQuestion('');
  };

  return (
    <>
      <ScreenReaderAnnouncement 
        message={voiceAnnouncement} 
        assertive={voiceAnnouncement.includes('error')}
      />
      
      {showSpeechAlert && (
        <Alert variant="destructive" className="mb-2 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {speechSupported 
              ? "There was an error with the speech recognition. Please try again or use text input."
              : "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."}
          </AlertDescription>
        </Alert>
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-background border-t border-border/40 shadow-sm backdrop-blur-sm bg-opacity-70 rounded-lg"
      role="form"
      aria-label="Chat with Med Genie"
    >
      <div className="container max-w-3xl mx-auto flex items-center space-x-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2 custom-textarea"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading}
          aria-label="Type your health question here"
          aria-describedby="chat-input-description"
          aria-required="true"
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim()}
          size="icon"
          className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
          aria-label={isLoading ? "Sending message, please wait" : "Send your health question to Med Genie"}
          aria-describedby={isLoading ? "loading-description" : undefined}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="sr-only">
            {isLoading ? "Sending message, please wait" : "Send message"}
          </span>
        </Button>
      </div>

      <div id="chat-input-description" className="sr-only">
        Type your health question and press Enter or click Send to get advice from Med Genie
      </div>

      {isLoading && (
        <div id="loading-description" className="sr-only">
          Med Genie is processing your question, please wait
        </div>

      )}
      
      <form 
        onSubmit={handleSubmit} 
        className="p-4 backdrop-blur-sm bg-opacity-70 bg-card border-t border-border/40 shadow-md rounded-lg"
        role="form" 
        aria-label="Chat with Med Genie"
      >
        <div className="container max-w-3xl mx-auto flex items-center space-x-3">
          <div className="relative flex-grow">
            <Textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2 custom-textarea pr-12"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }
              }}
              disabled={isLoading}
              aria-label="Type your health question here"
              aria-describedby="chat-input-description"
              aria-required="true"
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 ${isListening ? 'bg-primary text-white voice-active' : 'bg-transparent'}`}
                    onClick={toggleListening}
                    disabled={isLoading}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    style={{
                      boxShadow: isListening ? '0 0 0 2px rgba(0, 51, 102, 0.3)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isListening ? (
                      <Mic className="h-4 w-4 text-white" />
                    ) : (
                      <MicOff className="h-4 w-4 text-black" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {speechSupported 
                    ? (isListening ? "Click to stop voice input" : "Click to start voice input") 
                    : "Voice input not supported in your browser"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !question.trim()} 
            size="icon" 
            className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
            aria-label={isLoading ? "Sending message, please wait" : "Send your health question to Med Genie"}
            aria-describedby={isLoading ? "loading-description" : undefined}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
            <span className="sr-only">
              {isLoading ? "Sending message, please wait" : "Send message"}
            </span>
          </Button>
        </div>
        
        {isListening && (
          <div className="text-center mt-2 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-primary text-white px-3 py-1 rounded-full shadow-md">
              <span className="text-xs font-medium">Listening</span>
              <VoiceWaveform isActive={isListening} className="mx-1" />
              <span className="text-xs font-medium">Speak now</span>
            </div>
          </div>
        )}
        
        <div id="chat-input-description" className="sr-only">
          Type your health question or use the microphone button for voice input, then press Enter or click Send
        </div>
        
        {isLoading && (
          <div id="loading-description" className="sr-only">
            Med Genie is processing your question, please wait
          </div>
        )}
      </form>
    </>
  );
}
