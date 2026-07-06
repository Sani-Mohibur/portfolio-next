"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-4 sm:right-6 z-[60]
          w-14 h-14 rounded-full 
          bg-gradient-to-br from-indigo-500 to-purple-600 
          text-white shadow-lg shadow-indigo-500/30 
          hover:shadow-xl hover:shadow-indigo-500/40
          hover:from-indigo-600 hover:to-purple-700
          flex items-center justify-center
          transition-shadow duration-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        title={isOpen ? "Close chat" : "Ask AI about my portfolio"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6"
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
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6"
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
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse Ring (only when closed) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-[59] pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-indigo-500/30 animate-ping" />
        </div>
      )}
    </>
  );
}
