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
      size="icon"
      onClick={handleToggleListening}
      variant={listening ? 'destructive' : 'outline'}
      className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      <span className="sr-only">{listening ? 'Stop listening' : 'Start listening'}</span>
    </Button>
  );
};

export default VoiceSearch;