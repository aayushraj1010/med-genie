'use client';

import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';

interface TextToSpeechContextType {
  speak: (text: string, id?: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: (id?: string) => boolean;
  currentSpeakerId: string | null;
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined);

export function TextToSpeechProvider({ children }: { children: React.ReactNode }) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSpeakerIdRef = useRef<string | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Initialize speech synthesis on first user interaction
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Force voice loading on first interaction
      const handleFirstInteraction = () => {
        console.log('First user interaction detected, loading voices...');
        window.speechSynthesis.getVoices();
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
      
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);
      
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, []);

  const speak = useCallback((text: string, id?: string) => {
    console.log('Speak function called with text:', text.substring(0, 50), 'id:', id);
    
    if (!isSupported) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    currentSpeakerIdRef.current = null;

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    currentSpeakerIdRef.current = id || null;

    // Configure speech settings
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Function to set voice and start speaking
    const startSpeaking = () => {
      try {
        // Try to use a female voice if available
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log('Using voice:', preferredVoice.name);
        } else {
          console.log('No preferred voice found, using default');
        }

        // Event handlers
        utterance.onend = () => {
          console.log('Speech ended');
          utteranceRef.current = null;
          currentSpeakerIdRef.current = null;
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          utteranceRef.current = null;
          currentSpeakerIdRef.current = null;
        };

        utterance.onstart = () => {
          console.log('Speech started');
        };

        // Start speaking
        console.log('Attempting to speak...');
        window.speechSynthesis.speak(utterance);
        
        // Check if it actually started
        setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            console.error('Speech synthesis failed to start');
          }
        }, 100);
        
      } catch (error) {
        console.error('Error in startSpeaking:', error);
      }
    };

    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    console.log('Initial voices count:', voices.length);
    
    if (voices.length > 0) {
      startSpeaking();
    } else {
      console.log('No voices available, waiting for voices to load...');
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        startSpeaking();
      };
      
      // Fallback: try to start anyway after a short delay
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          console.log('Fallback: trying to start without waiting for voices');
          startSpeaking();
        }
      }, 1000);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      currentSpeakerIdRef.current = null;
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

  const isSpeaking = useCallback((id?: string) => {
    if (!isSupported) return false;
    const speaking = window.speechSynthesis.speaking;
    if (id) {
      return speaking && currentSpeakerIdRef.current === id;
    }
    return speaking;
  }, [isSupported]);

  const value: TextToSpeechContextType = {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    get currentSpeakerId() {
      return currentSpeakerIdRef.current;
    },
  };

  return (
    <TextToSpeechContext.Provider value={value}>
      {children}
    </TextToSpeechContext.Provider>
  );
}

export function useTextToSpeechContext() {
  const context = useContext(TextToSpeechContext);
  if (context === undefined) {
    throw new Error('useTextToSpeechContext must be used within a TextToSpeechProvider');
  }
  return context;
} 