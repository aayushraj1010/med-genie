'use client';

import { useEffect, useState } from 'react';

interface ScreenReaderAnnouncementProps {
  message: string;
  assertive?: boolean;
  clearAfter?: number;
}

export function ScreenReaderAnnouncement({ 
  message, 
  assertive = false, 
  clearAfter = 5000 
}: ScreenReaderAnnouncementProps) {
  const [currentMessage, setCurrentMessage] = useState(message);
  
  useEffect(() => {
    setCurrentMessage(message);
    
    if (message && clearAfter > 0) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);
  
  if (!currentMessage) return null;
  
  return (
    <div 
      aria-live={assertive ? 'assertive' : 'polite'} 
      className="sr-only"
      role="status"
    >
      {currentMessage}
    </div>
  );
}