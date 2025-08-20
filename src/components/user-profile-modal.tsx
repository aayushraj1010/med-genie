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
import { InputSanitizer } from '@/lib/input-sanitizer';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProfile(currentProfile);
    setFieldErrors({});
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
    // Validate all fields before saving
    const errors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(profile).forEach((key) => {
      if (profile[key as keyof UserProfile]) {
        const validation = InputSanitizer.validateInput(profile[key as keyof UserProfile] as string, 2000);
        if (!validation.isValid) {
          errors[key] = validation.errors[0] || 'Invalid input detected';
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setFieldErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the input errors before saving.",
        variant: "destructive"
      });
      return;
    }

    // Sanitize profile data before saving
    const sanitizedProfile = InputSanitizer.sanitizeProfileData(profile) as UserProfile;

    // Log security events if any sanitization occurred
    Object.keys(profile).forEach((key) => {
      const originalValue = profile[key as keyof UserProfile];
      const sanitizedValue = sanitizedProfile[key as keyof UserProfile];
      if (originalValue !== sanitizedValue) {
        InputSanitizer.logSecurityEvent(
          `Profile field ${key} sanitized`,
          originalValue as string,
          sanitizedValue as string
        );
      }
    });

    onSave(sanitizedProfile);
    toast({
      title: "Profile Updated",
      description: "Your health information has been saved for this session.",
    });
    onClose();
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    // Clear field error
    setFieldErrors(prev => ({ ...prev, [field]: '' }));

    // Check if value is purely numeric (reject if so)
    if (value.trim() && /^\d+$/.test(value.trim())) {
      setFieldErrors(prev => ({ ...prev, [field]: 'Please enter descriptive text rather than numbers only.' }));
      return;
    }

    // Validate input for XSS patterns
    const validation = InputSanitizer.validateInput(value, 2000);
    if (!validation.isValid) {
      setFieldErrors(prev => ({ ...prev, [field]: validation.errors[0] || 'Invalid input detected' }));
      // Still allow typing but show warning
    }

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
              <div className="col-span-3">
                <Textarea
                  id={`profile-${key}`}
                  value={profile[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={profileFieldPlaceholders[key]}
                  className={`${fieldErrors[key] ? 'border-red-500 focus:border-red-500' : ''}`}
                  rows={3}
                />
                {fieldErrors[key] && (
                  <div className="text-red-500 text-xs mt-1">
                    ⚠️ {fieldErrors[key]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={Object.keys(fieldErrors).some(key => fieldErrors[key])}
          >
            Save Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
