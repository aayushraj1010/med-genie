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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">MedGenie Chat</h2>
              <p className="text-slate-400">Ask about symptoms, dosage, health concerns...</p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-slate-800 text-white rounded-br-none shadow-lg border border-slate-700"
                  : "bg-slate-700 text-slate-100 rounded-bl-none shadow-md"
              }`}
            >
              <p className="text-sm font-medium">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-700 bg-slate-900 p-6">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 rounded-[24px] border border-slate-700/80 bg-slate-900/95 px-4 py-3.5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.7)] transition-all duration-200 hover:border-slate-600">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms, dosage, health concerns..."
              className="flex-1 min-h-[56px] bg-transparent border-0 px-0 py-0 text-base leading-7 text-white placeholder-slate-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-700/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center border-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}