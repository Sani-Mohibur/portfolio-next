"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load the terminal window — only downloaded when opened
const TerminalWindow = dynamic(() => import("./TerminalWindow"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-64 h-32 rounded-2xl border border-white/[0.08]"
      style={{ background: "rgba(10, 14, 26, 0.92)" }}
    >
      <span className="text-gray-600 text-sm font-[family-name:var(--font-geist-mono)]">
        Loading...
      </span>
    </div>
  ),
});

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

export default function DevConsole() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for the custom event dispatched by the Navbar button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-dev-console", handleOpen);
    return () => window.removeEventListener("open-dev-console", handleOpen);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="console-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Terminal */}
          <motion.div
            key="console-terminal"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <TerminalWindow onClose={handleClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
