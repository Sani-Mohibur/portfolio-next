"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isBot = role === "assistant";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isBot) {
    // User message
    return (
      <div className="flex justify-end px-4 py-1">
        <div className="max-w-[80%]">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 text-right">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex items-start gap-2.5 px-4 py-1 group">
      {/* Bot Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg
          className="w-3.5 h-3.5 text-white"
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

      <div className="max-w-[85%] min-w-0">
        <div className="relative bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm">
          {/* Markdown Content */}
          <div className="chat-markdown text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            <ReactMarkdown
              components={{
                h2: ({ children, ...props }) => (
                  <h2
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-3 mb-1.5 first:mt-0"
                    {...props}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2.5 mb-1 first:mt-0"
                    {...props}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p className="mb-2 last:mb-0" {...props}>
                    {children}
                  </p>
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/40 dark:decoration-indigo-500/40 underline-offset-2 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 transition-colors duration-200"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children, ...props }) => (
                  <ul
                    className="list-disc ml-4 mb-2 space-y-0.5 marker:text-indigo-400 dark:marker:text-indigo-500"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="list-decimal ml-4 mb-2 space-y-0.5 marker:text-indigo-400 dark:marker:text-indigo-500"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="pl-0.5" {...props}>
                    {children}
                  </li>
                ),
                pre: ({ children, ...props }) => (
                  <pre
                    className="bg-gray-200/60 dark:bg-gray-700/50 rounded-lg p-3 overflow-x-auto mb-2 text-xs"
                    {...props}
                  >
                    {children}
                  </pre>
                ),
                code: ({ children, ...props }) => (
                  <code
                    className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ),
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold" {...props}>
                    {children}
                  </strong>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="absolute -bottom-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
              bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
              rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            title={copied ? "Copied!" : "Copy response"}
          >
            {copied ? (
              <svg
                className="w-3 h-3 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>

        <p className="text-[10px] text-gray-400 mt-1 ml-1">
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
