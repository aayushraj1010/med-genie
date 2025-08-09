import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Clock, MessageSquare, MoreVertical, Pencil, Trash, X } from 'lucide-react';
import type { ChatSession } from '@/hooks/use-chat-history';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, name: string) => void;
  onClearAllSessions: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ChatHistorySidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  onClose,
  isMobile = false
}: ChatHistorySidebarProps) {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState('');

  const handleRenameSession = (sessionId: string) => {
    if (!newSessionName.trim()) return;
    onRenameSession(sessionId, newSessionName.trim());
    setSessionToRename(null);
    setNewSessionName('');
  };

  const handleOpenRenameDialog = (sessionId: string, currentName: string) => {
    setSessionToRename(sessionId);
    setNewSessionName(currentName);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Chat History</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="p-3">
        <Button 
          variant="default" 
          className="w-full justify-start" 
          onClick={onNewChat}
          aria-label="Start a new chat"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No chat history yet</p>
            <p className="text-sm">Your conversations will appear here</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  flex items-center justify-between p-2 rounded-md cursor-pointer
                  hover:bg-accent hover:text-accent-foreground
                  ${activeSessionId === session.id ? 'bg-accent text-accent-foreground' : ''}
                `}
                onClick={() => {
                  onSelectSession(session.id);
                  if (onClose) onClose(); // Close sidebar on mobile after selection
                }}
                role="button"
                aria-label={`Select chat: ${session.name}`}
                aria-selected={activeSessionId === session.id}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{session.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {session.preview}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-70 hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Chat options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRenameDialog(session.id, session.name);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full text-muted-foreground" 
          onClick={() => setIsDeleteAllDialogOpen(true)}
          disabled={sessions.length === 0}
          aria-label="Clear all chat history"
        >
          <Trash className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </div>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat History</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to clear all chat history? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onClearAllSessions();
                setIsDeleteAllDialogOpen(false);
              }}
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Session Dialog */}
      <Dialog open={sessionToRename !== null} onOpenChange={(open) => !open && setSessionToRename(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <Input
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            placeholder="Enter a new name"
            className="mt-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && sessionToRename) {
                handleRenameSession(sessionToRename);
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionToRename(null)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={() => sessionToRename && handleRenameSession(sessionToRename)}
              disabled={!newSessionName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}