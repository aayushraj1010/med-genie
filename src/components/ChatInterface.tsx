"use client";
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user' as const, content: userMessage }]);
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

      setMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant' as const, content: "Error: Try again!" }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about symptoms, dosage, etc..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}