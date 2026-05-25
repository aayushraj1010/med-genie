"use client";
import ChatInterface from '../../components/ChatInterface';

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <ChatInterface />
      </div>
    </main>
  );
}
