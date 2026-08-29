"use client";
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAssistantIndex, setPendingAssistantIndex] = useState<number | null>(null);
  const [failedAssistantIndex, setFailedAssistantIndex] = useState<number | null>(null);
  const [lastUserMessageForRetry, setLastUserMessageForRetry] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    // mark loading state
    setIsLoading(true);
    setLastUserMessageForRetry(userMessage);
    setFailedAssistantIndex(null);

    // append user message and a temporary assistant loading message
    const assistantIndexLocal = messages.length + 1; // user appended at messages.length, assistant will be +1
    setMessages(prev => {
      const next = [...prev, { role: 'user' as const, content: userMessage }, { role: 'assistant' as const, content: 'Generating response...' }];
      // reflect pending assistant in state for rendering (not relied on for immediate updates)
      setPendingAssistantIndex(assistantIndexLocal);
      return next;
    });

    setInput('');

    try {
      const res = await fetch("/api/chat/agent/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: "abhinav-capstone-2025",
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      // replace the temporary assistant message with real response using the local index
      setMessages(prev => prev.map((m, i) => i === assistantIndexLocal ? { role: 'assistant', content: data.response } : m));
      setPendingAssistantIndex(null);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      // show friendly failure message and enable retry on that assistant message
      setMessages(prev => prev.map((m, i) => i === assistantIndexLocal ? { role: 'assistant', content: "Sorry — I couldn't generate a response. Tap Retry to try again." } : m));
      setFailedAssistantIndex(assistantIndexLocal);
      setPendingAssistantIndex(null);
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (isLoading) return; // guard
    if (lastUserMessageForRetry == null || failedAssistantIndex == null) return;
    // capture the failed assistant index locally to avoid relying on async state updates
    const assistantIndexLocal = failedAssistantIndex;
    setIsLoading(true);
    setFailedAssistantIndex(null);
    // set the failed assistant message back to loading text
    setMessages(prev => prev.map((m, i) => i === assistantIndexLocal ? { role: 'assistant', content: 'Generating response...' } : m));
    setPendingAssistantIndex(assistantIndexLocal);

    try {
      const res = await fetch("/api/chat/agent/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lastUserMessageForRetry,
          sessionId: "abhinav-capstone-2025",
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      setMessages(prev => prev.map((m, i) => i === assistantIndexLocal ? { role: 'assistant', content: data.response } : m));
      setPendingAssistantIndex(null);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map((m, i) => i === assistantIndexLocal ? { role: 'assistant', content: "Sorry — I couldn't generate a response. Tap Retry to try again." } : m));
      setFailedAssistantIndex(assistantIndexLocal);
      setPendingAssistantIndex(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong>
            <span style={{ marginLeft: 6 }}>{msg.content}</span>
            {idx === pendingAssistantIndex && (
              <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#666' }}>Generating response...</span>
            )}
            {idx === failedAssistantIndex && (
              <button onClick={handleRetry} style={{ marginLeft: 8 }} disabled={isLoading}>Retry</button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about symptoms, dosage, etc..."
        />
        <button type="submit" disabled={isLoading || !input.trim()}>{isLoading ? 'Generating...' : 'Send'}</button>
      </form>
    </div>
  );
}