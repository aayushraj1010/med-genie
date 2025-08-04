'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useTextToSpeechContext } from '@/contexts/text-to-speech-context';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SpeakerButtonProps {
  text: string;
  messageId?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function SpeakerButton({ text, messageId, className, size = 'sm' }: SpeakerButtonProps) {
  const { toast } = useToast();
  const { speak, stop, pause, resume, isSpeaking, currentSpeakerId } = useTextToSpeechContext();
  const { settings } = useSettings();
  const [isPaused, setIsPaused] = useState(false);
  
  const isThisSpeaking = isSpeaking(messageId);
  const isAnySpeaking = isSpeaking();

  // Don't render if voice is disabled
  if (!settings.voiceEnabled) {
    return null;
  }

  const handleToggleSpeech = () => {
    console.log('Speaker button clicked:', { isThisSpeaking, isPaused, text: text.substring(0, 50) });
    
    // Test if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log('Speech synthesis is supported');
      console.log('Current speaking state:', window.speechSynthesis.speaking);
      console.log('Available voices:', window.speechSynthesis.getVoices().length);
    } else {
      console.error('Speech synthesis not supported');
      toast({
        title: "Speech Not Supported",
        description: "Text-to-speech is not supported in this browser",
        variant: "destructive",
      });
      return;
    }
    
    if (isThisSpeaking) {
      if (isPaused) {
        console.log('Resuming speech');
        resume();
        setIsPaused(false);
      } else {
        console.log('Pausing speech');
        pause();
        setIsPaused(true);
      }
    } else {
      console.log('Starting speech');
      speak(text, messageId);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    stop();
    setIsPaused(false);
  };

  const testSpeech = () => {
    console.log('Testing speech synthesis...');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const testUtterance = new SpeechSynthesisUtterance('Hello, this is a test of speech synthesis.');
      testUtterance.onstart = () => console.log('Test speech started');
      testUtterance.onend = () => console.log('Test speech ended');
      testUtterance.onerror = (e) => console.error('Test speech error:', e);
      window.speechSynthesis.speak(testUtterance);
    }
  };

  const getIcon = () => {
    if (!isThisSpeaking) return <Volume2 className="h-4 w-4" />;
    if (isPaused) return <Play className="h-4 w-4" />;
    return <Pause className="h-4 w-4" />;
  };

  const getAriaLabel = () => {
    if (!isThisSpeaking) return "Listen to this response";
    if (isPaused) return "Resume listening";
    return "Pause listening";
  };

  const getButtonVariant = () => {
    if (isThisSpeaking && !isPaused) return "default";
    return "ghost";
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center space-x-1", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={getButtonVariant()}
              size={size}
              onClick={handleToggleSpeech}
              className={cn(
                "h-8 w-8 p-0 transition-all duration-200 relative",
                isThisSpeaking && !isPaused && "animate-pulse"
              )}
              aria-label={getAriaLabel()}
            >
              {getIcon()}
              {isThisSpeaking && !isPaused && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              )}
              <span className="sr-only">
                {getAriaLabel()}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getAriaLabel()}</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Temporary test button for debugging */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size={size}
              onClick={testSpeech}
              className="h-8 w-8 p-0 transition-all duration-200"
              aria-label="Test speech"
            >
              <span className="text-xs">T</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Test speech synthesis</p>
          </TooltipContent>
        </Tooltip>
        
        {isThisSpeaking && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size={size}
                onClick={handleStop}
                className="h-8 w-8 p-0 transition-all duration-200 animate-in slide-in-from-left-1"
                aria-label="Stop listening"
              >
                <VolumeX className="h-4 w-4" />
                <span className="sr-only">Stop listening</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop listening</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
} 