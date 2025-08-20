"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Loader2, ImageIcon } from "lucide-react";

interface ChatInputFormProps {
  onSubmit: (message: { text?: string; image?: File; userDetailsProvided?: boolean }) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInputForm({
  onSubmit,
  isLoading,
  placeholder = "Type your message...",
}: ChatInputFormProps) {
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    if ((!question.trim() && !imageFile) || isLoading) return;

    // If this question contains medical details, set flag
    if (
      question.toLowerCase().includes("symptom") ||
      question.toLowerCase().includes("history") ||
      question.toLowerCase().includes("allergy")
    ) {
      localStorage.setItem("userDetailsProvided", "true");
      setUserDetailsProvided(true);
    }

    await onSubmit({
      text: question || undefined,
      image: imageFile || undefined,
      userDetailsProvided,
    });

    setQuestion("");
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-background border-t border-border/40 shadow-sm rounded-lg flex items-center space-x-2"
    >
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="image-upload">
        <Button type="button" size="icon" variant="outline">
          <ImageIcon className="h-5 w-5" />
        </Button>
      </label>

      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
        className="flex-grow resize-none min-h-[40px] max-h-[150px] py-2"
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
        disabled={isLoading || (!question.trim() && !imageFile)}
        size="icon"
        className="bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizonal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}

