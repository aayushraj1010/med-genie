"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Loader2, ImageIcon } from "lucide-react";
import { InputSanitizer } from "@/lib/input-sanitizer";

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
  const [inputError, setInputError] = useState<string>("");

  // Load user details flag from localStorage
  useEffect(() => {
    const storedFlag = localStorage.getItem("userDetailsProvided");
    if (storedFlag === "true") {
      setUserDetailsProvided(true);
    }
  }, []);

  const handleInputChange = (value: string) => {
    // Clear any previous errors
    setInputError("");

    // Validate input in real-time
    const validation = InputSanitizer.validateInput(value, 5000);

    if (!validation.isValid) {
      setInputError(validation.errors[0] || "Invalid input detected");
      // Still allow typing but show warning
    }

    setQuestion(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((!question.trim() && !imageFile) || isLoading) return;

    // Sanitize input before processing
    const sanitizedQuestion = InputSanitizer.sanitizeChatMessage(question);

    // Final validation before submission
    const validation = InputSanitizer.validateInput(sanitizedQuestion, 5000);

    if (!validation.isValid) {
      setInputError(validation.errors[0] || "Input contains potentially dangerous content");
      return;
    }

    // Log security event if original input was different from sanitized
    if (question !== sanitizedQuestion) {
      InputSanitizer.logSecurityEvent("Chat message sanitized", question, sanitizedQuestion);
    }

    // If this question contains medical details, set flag
    if (
      sanitizedQuestion.toLowerCase().includes("symptom") ||
      sanitizedQuestion.toLowerCase().includes("history") ||
      sanitizedQuestion.toLowerCase().includes("allergy")
    ) {
      localStorage.setItem("userDetailsProvided", "true");
      setUserDetailsProvided(true);
    }

    await onSubmit({
      text: sanitizedQuestion || undefined,
      image: imageFile || undefined,
      userDetailsProvided,
    });

    setQuestion("");
    setImageFile(null);
    setInputError("");
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

      <div className="flex-grow flex flex-col">
        <Textarea
          value={question}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-grow resize-none min-h-[40px] max-h-[150px] py-2 ${inputError ? 'border-red-500 focus:border-red-500' : ''
            }`}
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
        {inputError && (
          <div className="text-red-500 text-xs mt-1 px-2">
            ⚠️ {inputError}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || (!question.trim() && !imageFile) || !!inputError}
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

