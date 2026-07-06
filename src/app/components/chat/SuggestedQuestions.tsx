"use client";

import React from "react";
import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Tell me about Mohibur",
  "What are your skills?",
  "Show me your projects",
  "How can I contact you?",
  "Tell me about HireMe API",
  "What backend technologies do you know?",
];

export default function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider">
        Suggested Questions
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((question, index) => (
          <motion.button
            key={question}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 
              text-indigo-600 dark:text-indigo-400 
              hover:bg-indigo-50 dark:hover:bg-indigo-500/10 
              hover:border-indigo-300 dark:hover:border-indigo-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 cursor-pointer"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
