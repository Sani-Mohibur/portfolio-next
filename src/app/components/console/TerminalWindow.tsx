"use client";

import React from "react";
import { useTerminal } from "./useTerminal";
import type { TerminalLine } from "./terminal-commands";

// ────────────────────────────────────────────────────────────────────────────────
// Line Colors
// ────────────────────────────────────────────────────────────────────────────────

const lineColorMap: Record<TerminalLine["type"], string> = {
  plain: "text-gray-300",
  info: "text-gray-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
  accent: "text-cyan-400",
  muted: "text-gray-600",
  header: "text-indigo-400 font-semibold",
};

// ────────────────────────────────────────────────────────────────────────────────
// Keyframes (injected once)
// ────────────────────────────────────────────────────────────────────────────────

const TERMINAL_KEYFRAMES = `
@keyframes terminal-cursor-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
`;

// ────────────────────────────────────────────────────────────────────────────────
// URL auto-detection — makes https links clickable in terminal output
// ────────────────────────────────────────────────────────────────────────────────

function renderLineContent(text: string): React.ReactNode {
  if (!text) return "\u00A0";

  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-1 underline-offset-2 hover:text-cyan-300 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

interface TerminalWindowProps {
  onClose: () => void;
}

export default function TerminalWindow({ onClose }: TerminalWindowProps) {
  const {
    lines,
    input,
    setInput,
    handleKeyDown,
    outputRef,
    inputRef,
    isAnimating,
  } = useTerminal();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TERMINAL_KEYFRAMES }} />

      <div
        className="w-[calc(100vw-2rem)] sm:w-[620px] md:w-[720px]
          h-[min(520px,calc(100vh-6rem))]
          rounded-2xl overflow-hidden flex flex-col
          border border-white/[0.08]
          shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{
          background: "rgba(10, 14, 26, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* ── Title Bar ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] select-none flex-shrink-0">
          {/* Traffic Lights (decorative) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all cursor-pointer"
              aria-label="Close terminal"
            />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-80" />
          </div>

          {/* Title */}
          <span className="text-[11px] font-medium text-gray-500 tracking-wide font-[family-name:var(--font-geist-mono)]">
            Developer Console
          </span>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close terminal"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Output Area ── */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto px-4 py-3 chat-scrollbar"
          onClick={() => inputRef.current?.focus()}
        >
          <pre className="font-[family-name:var(--font-geist-mono)] text-[12px] sm:text-[13px] leading-[1.7] whitespace-pre-wrap break-words">
            {lines.map((l, i) => (
              <div key={i} className={lineColorMap[l.type]}>
                {renderLineContent(l.text)}
              </div>
            ))}
          </pre>

          {/* ── Input Line ── */}
          <div className="flex items-center gap-2 mt-1 font-[family-name:var(--font-geist-mono)] text-[12px] sm:text-[13px]">
            <span className="text-cyan-400 font-semibold select-none">❯</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  if (!isAnimating) setInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent outline-none caret-transparent placeholder:text-gray-700 ${
                  isAnimating ? "text-gray-500" : "text-gray-200"
                }`}
                placeholder={isAnimating ? "" : "Type a command..."}
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
              {/* Custom blinking cursor */}
              <span
                className="absolute top-0 h-full flex items-center pointer-events-none"
                style={{ left: `${input.length * 0.59}em` }}
              >
                <span
                  className="inline-block w-[7px] h-[15px] bg-cyan-400/80"
                  style={{
                    animation: "terminal-cursor-blink 1.1s step-end infinite",
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
