import { useState, useCallback, useEffect } from 'react';
import type { SpeechRecognitionEvent } from '@/lib/types';

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  onSpeechEnd?: (transcript: string) => void;
}

export function useSpeechToText(onSpeechEnd?: (transcript: string) => void): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check if browser supports speech recognition
  const isSupported = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;

  const recognition = isSupported ? new (window as any).webkitSpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      // Auto-submit if there's a transcript when speech ends
      if (transcript.trim() && onSpeechEnd) {
        onSpeechEnd(transcript);
      }
      // Ensure listening state is reset
      setIsListening(false);
    };

    recognition.onend = () => {
      // Always reset listening state when recognition ends
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const startListening = useCallback(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      setTranscript('');
      setError(null);
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
} 