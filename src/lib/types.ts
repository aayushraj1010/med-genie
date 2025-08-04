export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isLoading?: boolean;
  feedback?: 'good' | 'bad';
  isFollowUpPrompt?: boolean;
  originalQuestion?: string; // Store original question for context with AI's follow-up
}

export interface UserProfile {
  medicalHistory?: string;
  lifestyle?: string;
  symptoms?: string;
}

export type AISuggestedKey = keyof UserProfile;
