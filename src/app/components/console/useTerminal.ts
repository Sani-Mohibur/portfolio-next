"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  TerminalLine,
  getBootSequence,
  COMMANDS,
  STREAMING_COMMANDS,
  INTERACTIVE_COMMANDS,
  InteractiveCommandSession,
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
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const activeInteractiveCmdRef = useRef<InteractiveCommandSession | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  // Animate lines one-by-one (used for sync commands + boot sequence)
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

  // Execute a streaming command
  const executeStreamingCommand = useCallback(
    (commandKey: string, baseLines: TerminalLine[]) => {
      const streamCmd = STREAMING_COMMANDS[commandKey];
      if (!streamCmd) return false;

      setIsAnimating(true);

      // Set the base lines (echo line already included)
      setLines(baseLines);

      // Track whether the streaming command has emitted at least one batch
      let lastEmitTime = Date.now();

      const cleanup = streamCmd((newLines: TerminalLine[]) => {
        lastEmitTime = Date.now();

        setLines((prev) => [...prev, ...newLines]);

        // Schedule scroll for next frame to ensure DOM has updated
        requestAnimationFrame(() => scrollToBottom());
      });

      streamCleanupRef.current = cleanup;

      // Monitor for stream completion:
      // Check periodically if no new emissions have occurred for 2 seconds
      // after the last emission. This gracefully detects when all timers have fired.
      const checkInterval = setInterval(() => {
        if (Date.now() - lastEmitTime > 2000) {
          clearInterval(checkInterval);
          setIsAnimating(false);
          streamCleanupRef.current = null;
        }
      }, 500);

      // Also store the interval for cleanup
      const originalCleanup = cleanup;
      streamCleanupRef.current = () => {
        originalCleanup();
        clearInterval(checkInterval);
      };

      return true;
    },
    [scrollToBottom],
  );

  // Boot sequence on mount
  useEffect(() => {
    const bootLines = getBootSequence();
    animateLines(bootLines, []);
    return () => {
      animationRef.current.forEach(clearTimeout);
      streamCleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // Focus input after animation completes
    useEffect(() => {
      if (!isAnimating) {
        inputRef.current?.focus();
      }
    }, [isAnimating]);
  
    // Execute an interactive command
    const executeInteractiveCommand = useCallback(
      (commandKey: string, baseLines: TerminalLine[]) => {
        const interactiveCmd = INTERACTIVE_COMMANDS[commandKey];
        if (!interactiveCmd) return false;
  
        // Set base lines (echo line already included)
        setLines(baseLines);
  
        const session = interactiveCmd({
          emitLines: (newLines: TerminalLine[], animate = false) => {
            if (animate) {
              // We use a simplified animation here just appending lines over time
              // but we need to ensure we append to the current state properly.
              // To avoid state capturing issues, we can just call animateLines.
              // However animateLines replaces the current animation.
              // For simplicity, we just append them.
              setLines((prev) => [...prev, ...newLines]);
              requestAnimationFrame(() => scrollToBottom());
            } else {
              setLines((prev) => [...prev, ...newLines]);
              requestAnimationFrame(() => scrollToBottom());
            }
          },
          setAnimating: (animating: boolean) => {
            setIsAnimating(animating);
          },
          exit: () => {
            activeInteractiveCmdRef.current?.cleanup?.();
            activeInteractiveCmdRef.current = null;
          }
        });
  
        activeInteractiveCmdRef.current = session;
        return true;
      },
      [scrollToBottom]
    );
  
    // Handle command submission
  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isAnimating) return;

    // Cancel any in-flight streaming command
    streamCleanupRef.current?.();
    streamCleanupRef.current = null;

    // Push command to history (only if it's not during an interactive session)
    if (!activeInteractiveCmdRef.current) {
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    }
  
    // Echo the command
    const echoLine: TerminalLine = { text: `  ❯ ${trimmed}`, type: "accent" };
    const currentLines = [...lines, echoLine];
    setLines(currentLines);
    setInput("");
  
    // If an interactive command is active, route input to it.
    if (activeInteractiveCmdRef.current) {
      activeInteractiveCmdRef.current.handleInput(trimmed);
      return;
    }
  
    // Special: clear
    if (trimmed.toLowerCase() === "clear") {
      setLines([]);
      return;
    }
  
    const commandKey = trimmed.toLowerCase();
  
    // Check interactive commands first
    if (INTERACTIVE_COMMANDS[commandKey]) {
      executeInteractiveCommand(commandKey, currentLines);
      return;
    }
  
    // Check streaming commands
    if (STREAMING_COMMANDS[commandKey]) {
      executeStreamingCommand(commandKey, currentLines);
      return;
    }

    // Fall back to sync commands
    const cmd = COMMANDS[commandKey];
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
  }, [input, isAnimating, lines, animateLines, executeStreamingCommand]);

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
