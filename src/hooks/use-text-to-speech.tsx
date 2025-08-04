import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  error: string | null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if browser supports speech synthesis
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in this browser');
      return;
    }

    try {
      // Stop any current speech
      window.speechSynthesis.cancel();

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure speech settings
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to use a female voice if available (sounds more natural for AI responses)
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        utteranceRef.current = null;
        
        switch (event.error) {
          case 'interrupted':
            setError('Speech was interrupted');
            break;
          case 'network':
            setError('Network error occurred');
            break;
          case 'not-allowed':
            setError('Speech synthesis not allowed');
            break;
          case 'synthesis-failed':
            setError('Speech synthesis failed');
            break;
          default:
            setError('Speech synthesis error occurred');
        }
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      console.error('Error starting speech synthesis:', err);
      setError('Failed to start speech synthesis');
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      setError(null);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    isSpeaking,
    speak,
    stop,
    pause,
    resume,
    error,
  };
} 