"use client";
import { useState } from 'react';
import { TypingIndicator } from './typing-indicator';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user' as const, content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: "abhinav-capstone-2025",
          language: localStorage.getItem('i18nextLng') || 'en'
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'error' as const, content: "Error: Failed to connect to AI. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role} ${msg.role === 'error' ? 'text-red-500' : ''}`}>
            <strong>{msg.role === 'error' ? 'System' : msg.role}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <strong>assistant:</strong>
            <TypingIndicator className="mt-1" />
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about symptoms, dosage, etc..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}