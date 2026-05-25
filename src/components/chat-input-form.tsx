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
      className="p-5 md:p-6 bg-slate-50/90 border-t border-slate-200/80 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.25)] rounded-[28px] flex items-center gap-4"
    >
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <label htmlFor="image-upload" className="shrink-0">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-2xl border border-slate-200/80 bg-white shadow-sm text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-200"
        >
          <ImageIcon className="h-6 w-6" />
        </Button>
      </label>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-[22px] border border-slate-200/70 bg-white shadow-sm px-4 py-3.5 transition-all duration-200 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-100">
          <Textarea
            value={question}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full resize-none min-h-[56px] max-h-[170px] bg-transparent border-0 px-0 py-0 text-base leading-7 font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 ${
              inputError ? 'placeholder-red-300' : ''
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
        </div>

        {inputError && (
          <div className="text-red-600 text-xs px-3">
            ⚠️ {inputError}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || (!question.trim() && !imageFile) || !!inputError}
        className="h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/15 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-0"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <SendHorizonal className="h-6 w-6" />
        )}
      </Button>
    </form>
  );
}

