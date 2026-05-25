"use client";

import { UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { FeedbackButtons } from "./feedback-buttons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RobotDoctorIcon } from "./icons/robot-doctor-icon";

interface ChatMessageItemProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: "good" | "bad") => void;
}

export function ChatMessageItem({ message, onFeedback }: ChatMessageItemProps) {
  const isUser = message.sender === "user";
  const Icon = isUser ? UserCircle2 : RobotDoctorIcon;

  const handleFeedback = (feedback: "good" | "bad") => {
    onFeedback(message.id, feedback);
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3",
        isUser ? "justify-end" : "justify-start"
      )}
      role="article"
      aria-label={`${isUser ? "Your message" : "Med Genie response"}: ${message.text.substring(
        0,
        50
      )}${message.text.length > 50 ? "..." : ""}`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <Avatar className="h-10 w-10 self-start ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage src="/images/robot-doctor.svg" alt="Med Genie" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Icon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Card */}
      <Card
        className={cn(
          "relative overflow-hidden max-w-[65%] rounded-[20px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5",
          isUser
            ? "bg-slate-900/95 text-slate-100 border border-slate-700/50"
            : "bot-response-card text-slate-950 border border-slate-200/60"
        )}
        role="region"
        aria-label={isUser ? "Your message" : "Med Genie response"}
      >
        <CardContent className="p-3">
          {message.isLoading ? (
            <div
              className="flex items-center space-x-2"
              role="status"
              aria-label="Med Genie is thinking"
            >
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-300"></div>
              <span className="sr-only">
                Med Genie is processing your question
              </span>
            </div>
          ) : (
            <>
              {/* Render message text */}
              {message.text && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(
                    "prose prose-sm max-w-none",
                    isUser ? "text-slate-100" : "text-slate-950"
                  )}
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        className={cn(
                          "mb-2 last:mb-0 text-sm font-normal leading-7 tracking-normal",
                          isUser ? "text-slate-100" : "text-slate-950"
                        )}
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-2"
                        role="list"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-2"
                        role="list"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => <li role="listitem" {...props} />,
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-lg font-semibold mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-base font-medium mb-2" {...props} />
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}

              {/* Render uploaded image if present */}
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  className="mt-2 max-w-xs rounded-lg border"
                />
              )}
            </>
          )}
        </CardContent>

        {/* Feedback (only for bot messages) */}
        {!isUser && !message.isLoading && !message.isFollowUpPrompt && (
          <CardFooter className="px-3 pb-2 pt-1">
            <FeedbackButtons
              messageId={message.id}
              onFeedback={handleFeedback}
              currentFeedback={message.feedback}
            />
          </CardFooter>
        )}
      </Card>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="h-10 w-10 self-start">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <UserCircle2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
