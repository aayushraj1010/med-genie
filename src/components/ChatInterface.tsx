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
      const res = await fetch('/api/agent', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: "abhinav-capstone-2025",
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      if (!res.body) throw new Error('Streaming response is unavailable');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantMessageId = `assistant-${Date.now()}`;
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant' as const, content: '' }]);

      const updateAssistant = (content: string) => {
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant' as const, content };
          return next;
        });
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let separatorIndex = buffer.indexOf('\n\n');
        while (separatorIndex !== -1) {
          const block = buffer.slice(0, separatorIndex);
          buffer = buffer.slice(separatorIndex + 2);

          if (block.trim()) {
            const lines = block.split('\n');
            let eventName = 'message';
            const dataLines: string[] = [];

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5).trim());
              }
            }

            const payloadText = dataLines.join('\n');
            if (payloadText) {
              const payload = JSON.parse(payloadText) as { text?: string };
              if (eventName === 'chunk' && payload.text) {
                assistantText += payload.text;
                updateAssistant(assistantText);
              }
            }
          }

          separatorIndex = buffer.indexOf('\n\n');
        }
      }
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