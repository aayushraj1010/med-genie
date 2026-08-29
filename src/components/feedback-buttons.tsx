'use client';

import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/lib/types';

interface FeedbackButtonsProps {
  messageId: string;
  messageText: string;
  onFeedback: (feedback: 'good' | 'bad') => void;
  currentFeedback?: 'good' | 'bad';
}

export function FeedbackButtons({ 
  messageId, 
  messageText,
  onFeedback, 
  currentFeedback 
}: FeedbackButtonsProps) {
  const { toast } = useToast();

  const handleFeedback = (feedbackType: 'good' | 'bad') => {
    onFeedback(feedbackType);
    toast({
      title: "Feedback Submitted",
      description: `Thank you for your ${feedbackType === 'good' ? 'positive' : 'constructive'} feedback!`,
      duration: 3000,
    });
  };

  // copy
  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(messageText);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
      duration: 2000,
    });
  } catch (err) {
    console.error(err);
  }
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
      {/* <Button
  variant="outline"
  size="icon"
  onClick={handleCopy}
  aria-label="Copy message"
  className="h-8 w-8"
>
  <Copy className="h-4 w-4 text-muted-foreground" />
</Button> */}
<Button
  variant="outline"
  size="icon"
  onClick={handleCopy}
  aria-label="Copy message"
  className="h-8 w-8"
>
  <Copy className="h-4 w-4 text-muted-foreground" />
</Button>
    </div>
  );
}
