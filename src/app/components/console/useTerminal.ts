"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  TerminalLine,
  getBootSequence,
  COMMANDS,
} from "./terminal-commands";

// ────────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────────

interface UseTerminalReturn {
  lines: TerminalLine[];
  input: string;
  setInput: (v: string) => void;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  outputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isAnimating: boolean;
}

const LINE_DELAY = 35; // ms between each animated line

export function useTerminal(): UseTerminalReturn {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  // Animate lines one-by-one
  const animateLines = useCallback(
    (newLines: TerminalLine[], existingLines?: TerminalLine[]) => {
      setIsAnimating(true);
      const base = existingLines ?? [];

      // Cancel any in-flight animations
      animationRef.current.forEach(clearTimeout);
      animationRef.current = [];

      newLines.forEach((line, i) => {
        const timer = setTimeout(() => {
          setLines((prev) => {
            // On the first line, set the base if provided
            const current = i === 0 && existingLines !== undefined ? base : prev;
            return [...current, line];
          });
          scrollToBottom();

          // Mark animation complete on last line
          if (i === newLines.length - 1) {
            setIsAnimating(false);
          }
        }, i * LINE_DELAY);
        animationRef.current.push(timer);
      });

      // Edge case: empty array
      if (newLines.length === 0) {
        setIsAnimating(false);
      }
    },
    [scrollToBottom],
  );

  // Boot sequence on mount
  useEffect(() => {
    const bootLines = getBootSequence();
    animateLines(bootLines, []);
    return () => {
      animationRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus input after animation completes
  useEffect(() => {
    if (!isAnimating) {
      inputRef.current?.focus();
    }
  }, [isAnimating]);

  // Handle command submission
  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isAnimating) return;

    // Push command to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Echo the command
    const echoLine: TerminalLine = { text: `  ❯ ${trimmed}`, type: "accent" };
    const currentLines = [...lines, echoLine];
    setLines(currentLines);
    setInput("");

    // Special: clear
    if (trimmed.toLowerCase() === "clear") {
      setLines([]);
      return;
    }

    // Look up command
    const cmd = COMMANDS[trimmed.toLowerCase()];
    if (cmd) {
      const output = cmd();
      animateLines(output, currentLines);
    } else {
      const errorLines: TerminalLine[] = [
        { text: "", type: "plain" },
        { text: `  Command not found: ${trimmed}`, type: "error" },
        { text: '  Type "help" for available commands.', type: "muted" },
        { text: "", type: "plain" },
      ];
      animateLines(errorLines, currentLines);
    }
  }, [input, isAnimating, lines, animateLines]);

  // Handle key events (history navigation, enter, etc.)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        if (historyIndex >= history.length - 1) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
        return;
      }
    },
    [handleSubmit, history, historyIndex],
  );

  return {
    lines,
    input,
    setInput,
    handleSubmit,
    handleKeyDown,
    outputRef,
    inputRef,
    isAnimating,
  };
}
