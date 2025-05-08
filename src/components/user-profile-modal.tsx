'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UserProfile, AISuggestedKey } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentProfile: UserProfile;
  aiSuggestedKey?: AISuggestedKey;
}

const profileFieldLabels: Record<AISuggestedKey, string> = {
  medicalHistory: "Medical History",
  lifestyle: "Lifestyle (e.g., diet, exercise)",
  symptoms: "Current Symptoms",
};

const profileFieldPlaceholders: Record<AISuggestedKey, string> = {
  medicalHistory: "e.g., Allergic to penicillin, Diagnosed with asthma in 2010",
  lifestyle: "e.g., Vegetarian, exercise 3 times a week, non-smoker",
  symptoms: "e.g., Persistent cough for 2 weeks, occasional headaches",
};


export function UserProfileModal({ isOpen, onClose, onSave, currentProfile, aiSuggestedKey }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<AISuggestedKey | null>(null);

  useEffect(() => {
    setProfile(currentProfile);
  }, [currentProfile]);
  
  useEffect(() => {
    if (isOpen && aiSuggestedKey) {
      setFocusedField(aiSuggestedKey);
      // Focus the textarea corresponding to aiSuggestedKey
      const textareaId = `profile-${aiSuggestedKey}`;
      const textareaElement = document.getElementById(textareaId);
      if (textareaElement) {
        setTimeout(() => textareaElement.focus(), 100); // Timeout for DOM update
      }
    } else {
      setFocusedField(null);
    }
  }, [isOpen, aiSuggestedKey]);


  const handleSave = () => {
    onSave(profile);
    toast({
      title: "Profile Updated",
      description: "Your health information has been saved for this session.",
    });
    onClose();
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const fieldsToDisplay: AISuggestedKey[] = ['medicalHistory', 'lifestyle', 'symptoms'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Personalize Your Experience</DialogTitle>
          <DialogDescription>
            Provide some details to help Med Genie give you more relevant information. This data is only stored for your current session.
            {aiSuggestedKey && (
              <span className="mt-2 block text-primary">
                The AI has requested more information about your {profileFieldLabels[aiSuggestedKey].toLowerCase()}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fieldsToDisplay.map((key) => (
            <div className="grid grid-cols-4 items-center gap-4" key={key}>
              <Label htmlFor={`profile-${key}`} className={`text-right ${focusedField === key ? 'text-accent' : ''}`}>
                {profileFieldLabels[key]}
              </Label>
              <Textarea
                id={`profile-${key}`}
                value={profile[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={profileFieldPlaceholders[key]}
                className="col-span-3"
                rows={3}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
