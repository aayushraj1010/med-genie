import React from 'react';
import { initialPrompts } from '@/lib/prompts';
import { Button } from '@/components/ui/button';

interface QuickReplyGridProps {
  onPromptClick: (query: string) => void;
}

export const QuickReplyGrid: React.FC<QuickReplyGridProps> = ({ onPromptClick }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-3">Try Quick Prompts:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {initialPrompts.map((prompt) => (
          <Button
            key={prompt.title}
            variant="outline"
            className="h-auto p-3 text-left justify-start"
            onClick={() => onPromptClick(prompt.query)}
          >
            <span className="font-semibold">{prompt.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};