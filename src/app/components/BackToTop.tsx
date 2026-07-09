"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KEYFRAMES = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}`;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 400);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <AnimatePresence>
        {isVisible && (
          <div className="fixed bottom-5 left-4 sm:left-6 z-[60] flex items-center">
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bottom-3 left-[3.9rem] z-[50] pointer-events-none"
                >
                  <div
                    className="relative px-3.5 py-2 rounded-xl text-xs font-medium text-cyan-100 whitespace-nowrap border border-white/[0.08]"
                    style={{
                      background: "rgba(10, 14, 39, 0.75)",
                      backdropFilter: "blur(12px)",
                      boxShadow:
                        "0 4px 20px rgba(34,211,238,0.1), 0 0 0 1px rgba(139,92,246,0.1)",
                    }}
                  >
                    Back to top
                    <div
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-l border-b border-white/[0.08]"
                      style={{ background: "rgba(10, 14, 39, 0.75)" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              className="relative w-14 h-14 rounded-full flex items-center justify-center border border-white/[0.08] cursor-pointer"
              style={{
                background: "rgba(10, 14, 39, 0.65)",
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 8px 30px rgba(34,211,238,0.12), 0 4px 15px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/10 to-transparent" />
              <svg
                className="w-6 h-6 text-cyan-200/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
