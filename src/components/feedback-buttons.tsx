'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/lib/types';

interface FeedbackButtonsProps {
  messageId: string;
  onFeedback: (feedback: 'good' | 'bad') => void;
  currentFeedback?: 'good' | 'bad';
}

export function FeedbackButtons({ messageId, onFeedback, currentFeedback }: FeedbackButtonsProps) {
  const { toast } = useToast();

  const handleFeedback = (feedbackType: 'good' | 'bad') => {
    onFeedback(feedbackType);
    toast({
      title: "Feedback Submitted",
      description: `Thank you for your ${feedbackType === 'good' ? 'positive' : 'constructive'} feedback!`,
      duration: 3000,
    });
  };

  return (
    <div className="flex space-x-2 mt-2">
      <Button
        variant={currentFeedback === 'good' ? 'default' : 'outline'}
        size="icon"
        onClick={() => handleFeedback('good')}
        aria-label="Good response"
        className="h-8 w-8"
      >
        <ThumbsUp className={`h-4 w-4 ${currentFeedback === 'good' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      </Button>
      <Button
        variant={currentFeedback === 'bad' ? 'destructive' : 'outline'}
        size="icon"
        onClick={() => handleFeedback('bad')}
        aria-label="Bad response"
        className="h-8 w-8"
      >
        <ThumbsDown className={`h-4 w-4 ${currentFeedback === 'bad' ? 'text-destructive-foreground' : 'text-muted-foreground'}`} />
      </Button>
    </div>
  );
}
