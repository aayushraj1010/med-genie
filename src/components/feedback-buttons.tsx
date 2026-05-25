'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
    <div className="flex items-center space-x-2 mt-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFeedback('good')}
        aria-label="Good response"
        className={cn(
          "h-8 w-8 rounded-xl border border-slate-200/70 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:border-slate-600/70 dark:hover:bg-slate-900 dark:hover:text-slate-50",
          currentFeedback === 'good' &&
            'border-sky-300 bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200'
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFeedback('bad')}
        aria-label="Bad response"
        className={cn(
          "h-8 w-8 rounded-xl border border-slate-200/70 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:border-slate-600/70 dark:hover:bg-slate-900 dark:hover:text-slate-50",
          currentFeedback === 'bad' &&
            'border-rose-300 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
        )}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
