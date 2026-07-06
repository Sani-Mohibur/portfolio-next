"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  onClose: () => void;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "👋 Hi there! I'm Mohibur's portfolio assistant. Ask me anything about his **skills**, **projects**, **experience**, or **contact information**!",
  timestamp: new Date(),
};

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Build the messages payload (exclude welcome message and only send role + content)
    const apiMessages = updatedMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string }).error || "Failed to get response"
        );
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const botMessageId = generateId();
      let accumulatedText = "";

      // Add placeholder bot message
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);

      // Stream chunks into the message
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });
        const currentText = accumulatedText;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId ? { ...m, content: currentText } : m
          )
        );
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionSelect = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setInput("");
  };

  const showSuggestions = messages.length <= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-20 right-4 sm:right-6 z-[60]
        w-[calc(100vw-2rem)] sm:w-[400px] 
        h-[min(600px,calc(100vh-7rem))]
        bg-white dark:bg-[#1a1f2e] 
        rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50
        border border-gray-200/50 dark:border-gray-700/50
        flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Portfolio Assistant
            </h3>
            <p className="text-white/70 text-[10px]">
              Ask me about Mohibur&apos;s portfolio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear Chat Button */}
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
            title="Clear chat"
          >
            <svg
              className="w-4 h-4 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
            title="Close chat"
          >
            <svg
              className="w-4 h-4 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 chat-scrollbar">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {showSuggestions && !isLoading && (
          <SuggestedQuestions
            onSelect={handleSuggestionSelect}
            disabled={isLoading}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="px-3 py-2.5 border-t border-gray-200 dark:border-gray-700/50 flex-shrink-0"
      >
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none py-1.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:from-indigo-600 hover:to-purple-700
              transition-all duration-200 flex-shrink-0 cursor-pointer"
            title="Send message"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19V5m0 0l-7 7m7-7l7 7"
              />
            </svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
