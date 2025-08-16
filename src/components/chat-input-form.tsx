"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Loader2 } from "lucide-react";

interface ChatInputFormProps {
  onSubmit: (question: string, userDetailsProvided: boolean) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({
  onSubmit,
  isLoading,
  placeholder = "Ask Med Genie about your health...",
}: ChatInputFormProps) {
  const [question, setQuestion] = useState("");
  const [userDetailsProvided, setUserDetailsProvided] = useState(false);

  // Load user details flag from localStorage
  useEffect(() => {
    const storedFlag = localStorage.getItem("userDetailsProvided");
    if (storedFlag === "true") {
      setUserDetailsProvided(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    // If this question contains medical details, set flag
    if (
      question.toLowerCase().includes("symptom") ||
      question.toLowerCase().includes("history") ||
      question.toLowerCase().includes("allergy")
    ) {
      localStorage.setItem("userDetailsProvided", "true");
      setUserDetailsProvided(true);
    }

    await onSubmit(question, userDetailsProvided);
    setQuestion("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-background border-t border-border/40 shadow-sm backdrop-blur-sm bg-opacity-70 rounded-lg"
      role="form"
      aria-label="Chat with Med Genie"
    >
      <div className="container max-w-3xl mx-auto flex items-center space-x-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2 custom-textarea"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading}
          aria-label="Type your health question here"
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim()}
          size="icon"
          className="shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
          aria-label={
            isLoading
              ? "Sending message, please wait"
              : "Send your health question to Med Genie"
          }
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
}
