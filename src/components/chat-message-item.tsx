'use client';

import { User, Bot, Brain, UserCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { FeedbackButtons } from './feedback-buttons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface ChatMessageItemProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: 'good' | 'bad') => void;
}

export function ChatMessageItem({ message, onFeedback }: ChatMessageItemProps) {
  const isUser = message.sender === 'user';
  const Icon = isUser ? UserCircle2 : Brain;

  const handleFeedback = (feedback: 'good' | 'bad') => {
    onFeedback(message.id, feedback);
  };
  
  // A simple way to add emojis based on sender, or if AI includes them, this can be removed/modified.
  const messagePrefix = isUser ? '🧑‍💻 You: ' : '🧠 AI: ';

  return (
    <div 
      className={cn('flex items-end space-x-3', isUser ? 'justify-end' : 'justify-start')}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'Med Genie response'}: ${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 self-start" aria-hidden="true">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Icon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card 
        className={cn('max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl shadow-md', 
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
        )}
        role="region"
        aria-label={isUser ? 'Your message' : 'Med Genie response'}
      >
        <CardContent className="p-3">
          {message.isLoading ? (
            <div 
              className="flex items-center space-x-2"
              role="status"
              aria-label="Med Genie is thinking"
            >
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-300"></div>
              <span className="sr-only">Med Genie is processing your question</span>
            </div>
          ) : (
             <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm dark:prose-invert max-w-none"
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" role="list" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" role="list" {...props} />,
                li: ({node, ...props}) => <li role="listitem" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                // Add more custom renderers as needed
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </CardContent>
        {!isUser && !message.isLoading && !message.isFollowUpPrompt && (
          <CardFooter className="p-3 pt-0">
            <FeedbackButtons messageId={message.id} onFeedback={handleFeedback} currentFeedback={message.feedback} />
          </CardFooter>
        )}
      </Card>
      {isUser && (
         <Avatar className="h-8 w-8 self-start" aria-hidden="true">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
             <UserCircle2 className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
