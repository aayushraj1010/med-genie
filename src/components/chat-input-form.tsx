
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({ onSubmit, isLoading, placeholder = "Ask Med Genie about your health..." }: ChatInputFormProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    await onSubmit(question);
    setQuestion('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 backdrop-blur-sm bg-opacity-70 bg-card border-t border-border/40 shadow-md rounded-lg">
      <div className="container max-w-3xl mx-auto flex items-center space-x-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2 custom-textarea"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading}
          aria-label="Your health question"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !question.trim()} 
          size="icon" 
          className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}

