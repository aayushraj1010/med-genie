'use client';

import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';

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

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setInput(transcript);
  }, [transcript, setInput]);

  // Browser support check
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-sm text-red-500">
        Voice input is not supported in this browser.
      </div>
    );
  }

  const handleToggleListening = async () => {
    try {
      setError(null);

      if (listening) {
        SpeechRecognition.stopListening();
        return;
      }

      resetTranscript();

      const options = {
        continuous: true,
        language: lang,
      };

      SpeechRecognition.startListening(options);
    } catch (err: any) {
      setError('Voice input failed. Please check microphone permissions.');
      console.error('VoiceSearch Error:', err);
    }
  };

  // Handle runtime speech errors
  React.useEffect(() => {
    SpeechRecognition.onError = (event: any) => {
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError('Microphone permission denied. Please allow access.');
          break;

        case 'no-speech':
          setError('No speech detected. Try speaking again.');
          break;

        case 'audio-capture':
          setError('No microphone detected.');
          break;

        default:
          setError('Speech recognition error occurred.');
      }
    };
  }, []);

  return (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        onClick={handleToggleListening}
        variant={listening ? 'destructive' : 'outline'}
        className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
      >
        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="sr-only">
          {listening ? 'Stop listening' : 'Start listening'}
        </span>
      </Button>

      {/* Error UI */}
      {error && (
        <p className="absolute top-full mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceSearch;