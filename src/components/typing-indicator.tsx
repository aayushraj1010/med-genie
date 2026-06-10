import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-1.5 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm w-16 h-10 shadow-sm",
        className
      )}
      role="status"
      aria-label="AI is typing"
    >
      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
      <span className="sr-only">AI is typing...</span>
    </div>
  );
}
