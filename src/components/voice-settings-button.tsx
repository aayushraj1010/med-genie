'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Volume2, VolumeX, Square } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/settings-context';
import { useTextToSpeechContext } from '@/contexts/text-to-speech-context';
import { useToast } from '@/hooks/use-toast';

export function VoiceSettingsButton() {
  const { settings, toggleAutoSpeak, toggleVoiceEnabled } = useSettings();
  const { speak, stop, isSpeaking } = useTextToSpeechContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleTestVoice = () => {
    speak("This is a test of the voice feature. You can now listen to AI responses.");
    toast({
      title: "Voice Test",
      description: "Playing test audio...",
    });
  };

  const handleToggleVoiceEnabled = () => {
    if (settings.voiceEnabled) {
      stop(); // Stop any current speech
    }
    toggleVoiceEnabled();
  };

  const handleStopAllSpeech = () => {
    stop();
    toast({
      title: "Speech Stopped",
      description: "All speech has been stopped.",
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Voice settings"
          >
            {settings.voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        {isSpeaking() && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive"
            onClick={handleStopAllSpeech}
            aria-label="Stop all speech"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Voice Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure voice features for Med Genie
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-enabled">Voice Features</Label>
                <p className="text-sm text-muted-foreground">
                  Enable text-to-speech functionality
                </p>
              </div>
              <Switch
                id="voice-enabled"
                checked={settings.voiceEnabled}
                onCheckedChange={handleToggleVoiceEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-speak">Auto-Speak Responses</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically speak AI responses
                </p>
              </div>
              <Switch
                id="auto-speak"
                checked={settings.autoSpeak}
                onCheckedChange={toggleAutoSpeak}
                disabled={!settings.voiceEnabled}
              />
            </div>

            {settings.voiceEnabled && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestVoice}
                  className="w-full"
                >
                  Test Voice
                </Button>
                {isSpeaking() && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopAllSpeech}
                    className="w-full"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop All Speech
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 