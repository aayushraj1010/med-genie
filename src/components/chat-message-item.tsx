'use client';

import { User, Bot, Brain, UserCircle2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { FeedbackButtons } from './feedback-buttons';
import { SpeakerButton } from './speaker-button';
import { useTextToSpeechContext } from '@/contexts/text-to-speech-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface ChatMessageItemProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: 'good' | 'bad') => void;
}

export function ChatMessageItem({ message, onFeedback }: ChatMessageItemProps) {
  const isUser = message.sender === 'user';
  const Icon = isUser ? UserCircle2 : Brain;
  const { stop, isSpeaking } = useTextToSpeechContext();

  const handleFeedback = (feedback: 'good' | 'bad') => {
    onFeedback(message.id, feedback);
  };

  const handleStopAudio = () => {
    stop();
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
        className={cn('max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl shadow-md transition-all duration-300', 
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none',
          !isUser && isSpeaking(message.id) && 'ring-2 ring-primary/20 bg-primary/5'
        )}
        role="region"
        aria-label={isUser ? 'Your message' : 'Med Genie response'}
      >
        <CardContent className="p-3 relative">
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
            <>
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
              
              {/* Stop button that appears when this message is being spoken */}
              {!isUser && !message.isLoading && isSpeaking(message.id) && (
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  {/* Audio wave animation */}
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-5 bg-primary rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-4 bg-primary rounded-full animate-pulse delay-150"></div>
                    <div className="w-1 h-6 bg-primary rounded-full animate-pulse delay-200"></div>
                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse delay-300"></div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleStopAudio}
                    className="h-8 w-8 p-0 rounded-full shadow-lg animate-in zoom-in-95"
                    aria-label="Stop listening to this response"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
        {!isUser && !message.isLoading && !message.isFollowUpPrompt && (
          <CardFooter className="p-3 pt-0 flex items-center justify-between">
            <FeedbackButtons messageId={message.id} onFeedback={handleFeedback} currentFeedback={message.feedback} />
            <SpeakerButton text={message.text} messageId={message.id} />
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
