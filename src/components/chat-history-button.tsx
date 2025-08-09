import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { History } from 'lucide-react';
import { ChatHistorySidebar } from '@/components/chat-history-sidebar';
import type { ChatSession } from '@/hooks/use-chat-history';

interface ChatHistoryButtonProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, name: string) => void;
  onClearAllSessions: () => void;
}

export function ChatHistoryButton({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions
}: ChatHistoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        aria-label="View chat history"
        className="relative"
      >
        <History className="h-5 w-5" />
        {sessions.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-full max-w-xs sm:max-w-sm">
          {/* Hidden title for accessibility */}
          <SheetTitle className="sr-only">Chat History</SheetTitle>
          <ChatHistorySidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={onDeleteSession}
            onRenameSession={onRenameSession}
            onClearAllSessions={onClearAllSessions}
            onClose={() => setIsOpen(false)}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}