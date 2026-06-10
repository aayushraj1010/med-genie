'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface SessionDetails {
  id: number;
  sessionId: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

function HistoryDetailsPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/history/${params.id}/messages`, { headers });
        const data = await res.json();
        
        if (data.success) {
          setSession(data.session);
        } else {
          throw new Error(data.message || 'Failed to fetch session details');
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load conversation history. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetails();
  }, [params.id, toast]);

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? 'Loading...' : session?.title || 'Conversation'}
              </h1>
              {session && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Started on {new Date(session.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : session && session.messages.length > 0 ? (
            <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              {session.messages.map((msg, idx) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                    }`}
                  >
                    <div className="text-sm sm:text-base whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              This conversation is empty.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

export default function ProtectedHistoryDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <HistoryDetailsPage params={params} />
    </ProtectedRoute>
  );
}
