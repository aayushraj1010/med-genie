"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhoneCall, AlertTriangle, MapPin, MessageCircle, Users } from 'lucide-react';

interface SOSButtonProps {
  emergencyContact?: string;
  onAlertTriggered?: (reason: string) => void;
  location?: string;
}

export function SOSButton({ emergencyContact, onAlertTriggered, location }: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertType, setAlertType] = useState<'emergency' | 'message' | 'call' | '911'>('emergency');
  const [customMessage, setCustomMessage] = useState('');
  const [locationInfo, setLocationInfo] = useState(location || '');
  const [alertSent, setAlertSent] = useState(false);

  const handleAlert = () => {
    if (!emergencyContact && alertType !== '911') {
      // Show warning but still allow
    }
    
    const message = buildAlertMessage();
    
    // In a real app, this would trigger actual emergency services or notifications
    if (onAlertTriggered) {
      onAlertTriggered(message);
    }
    
    setAlertSent(true);
    
    // Reset after showing confirmation
    setTimeout(() => {
      setAlertSent(false);
      setIsOpen(false);
    }, 3000);
  };

  const buildAlertMessage = () => {
    const timestamp = new Date().toLocaleString();
    let message = `🚨 EMERGENCY ALERT from Med Genie User\n\n`;
    message += `Time: ${timestamp}\n`;
    
    if (locationInfo) {
      message += `Location: ${locationInfo}\n`;
    }
    
    if (customMessage) {
      message += `Message: ${customMessage}\n`;
    }
    
    if (emergencyContact) {
      message += `Emergency Contact: ${emergencyContact}`;
    }
    
    return message;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg hover:shadow-xl animate-pulse md:bottom-8 md:right-8"
          title="Emergency SOS"
        >
          <span className="text-2xl">🆘</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency SOS
          </DialogTitle>
          <DialogDescription>
            Choose how you want to get help. Select the most appropriate option.
          </DialogDescription>
        </DialogHeader>

        {alertSent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="font-medium text-green-600">Alert Sent!</p>
            <p className="text-sm text-gray-500">Help is on the way.</p>
          </div>
        ) : (
          <>
            {/* Alert Type Selection */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <Button
                variant={alertType === 'emergency' ? 'destructive' : 'outline'}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setAlertType('emergency')}
              >
                <Users className="h-5 w-5" />
                <span>Contact Emergency Person</span>
              </Button>
              
              <Button
                variant={alertType === 'message' ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setAlertType('message')}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Send Message</span>
              </Button>
              
              <Button
                variant={alertType === 'call' ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setAlertType('call')}
              >
                <PhoneCall className="h-5 w-5" />
                <span>Call Specialist</span>
              </Button>
              
              <Button
                variant={alertType === '911' ? 'destructive' : 'outline'}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setAlertType('911')}
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Call 911</span>
              </Button>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Your Location
              </Label>
              <Textarea 
                placeholder="Enter your current location for emergency services..."
                value={locationInfo}
                onChange={(e) => setLocationInfo(e.target.value)}
                className="resize-none"
              />
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label>Custom Message (optional)</Label>
              <Textarea 
                placeholder="Add any additional information..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="resize-none"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant={alertType === '911' ? 'destructive' : 'default'}
                onClick={handleAlert}
              >
                {alertType === '911' ? '🚨 Call 911 Now' : 
                 alertType === 'call' ? '📞 Call Specialist' :
                 alertType === 'message' ? '📤 Send Message' : 
                 '🚨 Alert Contact'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}