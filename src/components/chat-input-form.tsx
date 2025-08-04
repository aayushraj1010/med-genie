'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';

interface ChatInputFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({
  onSubmit,
  isLoading,
  placeholder = "Ask Med Genie about your health...",
}: ChatInputFormProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    await onSubmit(question);
    setQuestion('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-background border-t border-border/40 shadow-sm backdrop-blur-sm bg-opacity-70 rounded-lg"
      role="form"
      aria-label="Chat with Med Genie"
    >
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
          aria-label="Type your health question here"
          aria-describedby="chat-input-description"
          aria-required="true"
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim()}
          size="icon"
          className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
          aria-label={isLoading ? "Sending message, please wait" : "Send your health question to Med Genie"}
          aria-describedby={isLoading ? "loading-description" : undefined}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="sr-only">
            {isLoading ? "Sending message, please wait" : "Send message"}
          </span>
        </Button>
      </div>

      <div id="chat-input-description" className="sr-only">
        Type your health question and press Enter or click Send to get advice from Med Genie
      </div>

      {isLoading && (
        <div id="loading-description" className="sr-only">
          Med Genie is processing your question, please wait
        </div>
      )}
    </form>
  );
}
