"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

const AIFaceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Head */}
    <rect x="19" y="8" width="26" height="20" rx="5" />

    {/* Ears */}
    <path d="M19 14H15C12.5 14 12 17 12 19C12 21 13.5 23 16 23H19" />
    <path d="M45 14H49C51.5 14 52 17 52 19C52 21 50.5 23 48 23H45" />

    {/* Eyes */}
    <path d="M26 15V18" />
    <path d="M38 15V18" />

    {/* Mouth */}
    <path d="M30 22H34" />

    {/* Neck */}
    <path d="M28 28V32" />
    <path d="M36 28V32" />

    {/* Body */}
    <rect x="20" y="32" width="24" height="18" rx="2" />

    {/* Left Arm */}
    <path d="M20 35H14C12.5 35 12 36.5 12 38V48" />
    <path d="M14 38V45" />

    {/* Left Hand */}
    <path d="M12 48C9.5 48 9 50 9 52C9 54 10.5 55 12 55C13.5 55 15 54 15 52V48" />

    {/* Right Arm */}
    <path d="M44 35H50C51.5 35 52 36.5 52 38V48" />
    <path d="M50 38V45" />

    {/* Right Hand */}
    <path d="M52 48C54.5 48 55 50 55 52C55 54 53.5 55 52 55C50.5 55 49 54 49 52V48" />

    {/* Legs */}
    <path d="M28 50V60" />
    <path d="M36 50V60" />

    {/* Feet */}
    <path d="M23 60H33V63H23Z" />
    <path d="M31 60H41V63H31Z" />
  </svg>
);

/** Close X icon — clean geometric style */
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// ────────────────────────────────────────────────────────────────────────────────
// Keyframes injected once via <style>
// ────────────────────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes ai-orb-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
@keyframes ai-orb-border-spin {
  to { --ai-border-angle: 360deg; }
}
@keyframes ai-orb-breathe {
  0%, 100% { box-shadow: 0 0 15px 2px rgba(34,211,238,0.15), 0 0 30px 4px rgba(139,92,246,0.08); }
  50%      { box-shadow: 0 0 22px 4px rgba(34,211,238,0.25), 0 0 40px 8px rgba(139,92,246,0.15); }
}
@keyframes ai-orb-ring {
  to { transform: rotate(360deg); }
}
@keyframes ai-orb-pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.6); opacity: 0; }
}
@keyframes ai-tooltip-in {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ai-tooltip-out {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(8px); }
}
`;

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ── Existing: open-ai-chat custom event listener ──
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  // ── Auto-dismiss tooltip after 5s ──
  useEffect(() => {
    if (!showTooltip || tooltipDismissed) return;
    const timer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showTooltip, tooltipDismissed]);

  // ── Show tooltip on hover (after initial dismiss) ──
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!isOpen) setShowTooltip(true);
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowTooltip(false);
  }, []);

  const tooltipVisible = showTooltip && !isOpen;

  return (
    <>
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* ── Tooltip ── */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-7 right-[5rem] sm:right-[5.5rem] z-[60]
              pointer-events-none select-none"
          >
            <div
              className="relative px-3.5 py-2 rounded-xl text-xs font-medium
                text-cyan-100 whitespace-nowrap
                border border-white/[0.08]"
              style={{
                background: "rgba(10, 14, 39, 0.75)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 4px 20px rgba(34,211,238,0.1), 0 0 0 1px rgba(139,92,246,0.1)",
              }}
            >
              <span className="mr-1.5 inline-block" style={{ fontSize: "10px" }}>✦</span>
              Ask AI about my portfolio
              {/* Arrow pointing right toward button */}
              <div
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5
                  rotate-45 border-r border-b border-white/[0.08]"
                style={{
                  background: "rgba(10, 14, 39, 0.75)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Orb Container (handles floating animation) ── */}
      <div
        className="fixed bottom-5 right-4 sm:right-6 z-[60]"
        style={{
          animation: isOpen ? "none" : "ai-orb-float 4s ease-in-out infinite",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Orbiting Ring (visible when closed) ── */}
        {!isOpen && (
          <div
            className="absolute inset-[-6px] rounded-full pointer-events-none"
            style={{
              animation: "ai-orb-ring 8s linear infinite",
            }}
          >
            {/* Orbiting dot 1 */}
            {/* <div
              className="absolute w-1 h-1 rounded-full"
              style={{
                top: "-1px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#22d3ee",
                boxShadow: "0 0 6px 2px rgba(34,211,238,0.5)",
              }}
            /> */}
            {/* Orbiting dot 2 (opposite side) */}
            {/* <div
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                bottom: "-1px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#8b5cf6",
                boxShadow: "0 0 4px 1px rgba(139,92,246,0.5)",
              }}
            /> */}
          </div>
        )}

        {/* ── Breathing Glow Ring (behind button) ── */}
        {!isOpen && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: "ai-orb-breathe 3s ease-in-out infinite",
            }}
          />
        )}

        {/* ── Gradient Border Ring ── */}
        <div
          className="absolute inset-[-1.5px] rounded-full pointer-events-none"
          style={{
            background: isOpen
              ? "rgba(139,92,246,0.3)"
              : "conic-gradient(from 0deg, #22d3ee, #3b82f6, #8b5cf6, #6366f1, #22d3ee)",
            animation: isOpen ? "none" : "ai-orb-ring 4s linear infinite",
            opacity: 0.6,
          }}
        />

        {/* ── Main Button ── */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full
            flex items-center justify-center cursor-pointer
            border border-white/[0.08]"
          style={{
            background: "rgba(10, 14, 39, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: isOpen
              ? "0 4px 15px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 30px rgba(34,211,238,0.12), 0 4px 15px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        >
          {/* Inner glass highlight */}
          <div
            className="absolute inset-[2px] rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
            }}
          />

          {/* Icon swap animation */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <CloseIcon className="w-5 h-5 text-gray-300" />
              </motion.div>
            ) : (
              <motion.div
                key="ai-face"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <AIFaceIcon className="w-7 h-7 text-cyan-200/80" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
