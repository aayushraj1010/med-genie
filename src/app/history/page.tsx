'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Search, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Session {
  id: number;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}

function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredSessions(
        sessions.filter(
          (s) =>
            s.title.toLowerCase().includes(lowerQuery) ||
            s.preview.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, sessions]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/history', { headers });
      const data = await res.json();
      
      if (data.success) {
        setSessions(data.sessions);
      } else {
        throw new Error(data.message || 'Failed to fetch history');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();

      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        toast({ title: 'Success', description: 'Session deleted successfully.' });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Group by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.updatedAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat History</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Review your past health queries and AI recommendations.
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-dashed">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You haven't started any health conversations yet. Once you chat with Med Genie, your history will appear here.
                </p>
                <Button asChild>
                  <Link href="/homepage">Start a Conversation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : Object.keys(groupedSessions).length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No sessions found matching your search.
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedSessions).map((date) => (
                <div key={date} className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                    {date}
                  </h3>
                  <div className="grid gap-4">
                    {groupedSessions[date].map((session) => (
                      <Card key={session.id} className="group hover:shadow-md transition-shadow">
                        <CardHeader className="p-4 sm:p-6 pb-0 sm:pb-0 flex flex-row items-start justify-between space-y-0">
                          <div>
                            <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                              {session.title}
                            </CardTitle>
                            <CardDescription className="mt-1 line-clamp-1">
                              {session.preview}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(session.id)}
                            aria-label="Delete session"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-4 flex items-center justify-between">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {session.messageCount} message{session.messageCount !== 1 ? 's' : ''}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/history/${session.sessionId}`}>
                              View Conversation
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

export default function ProtectedHistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  );
}
