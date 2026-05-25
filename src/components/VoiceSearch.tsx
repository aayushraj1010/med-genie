'use client';

import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';

// MODIFICATION: Removed SpeechRecognitionOptions from the import as we won't use it directly
// This is an optional cleanup, the main fix is below

interface VoiceSearchProps {
  setInput: (text: string) => void;
  lang?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ setInput, lang = 'en-US' }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  React.useEffect(() => {
    setInput(transcript);
  }, [transcript, setInput]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleToggleListening = () => {
    if (listening) {
      // @ts-ignore - Bypassing a type definition issue in the library
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      
      // THE FIX: Remove the faulty ': SpeechRecognitionOptions' type annotation
      const options = { continuous: true, language: lang };
      
      // @ts-ignore - Bypassing a type definition issue in the library
      SpeechRecognition.startListening(options);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleToggleListening}
      className={`relative h-11 w-11 rounded-[26px] border transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center justify-center ${
        listening
          ? 'bg-red-600/15 border-red-400/50 hover:border-red-300/60 hover:bg-red-600/20 text-red-200'
          : 'bg-white/90 dark:bg-[#111827]/90 border-[#C7DFFF]/30 dark:border-[#2563EB]/20 text-[#5B657A] dark:text-[#E5E7EB] hover:bg-[#EEF5FF]/90 dark:hover:bg-[#111827]/95 hover:border-[#B7D7FF]/50 dark:hover:border-[#3B82F6]/40'
      }`}
    >
      {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      <span className="sr-only">{listening ? 'Stop listening' : 'Start listening'}</span>
    </Button>
  );
};

export default VoiceSearch;