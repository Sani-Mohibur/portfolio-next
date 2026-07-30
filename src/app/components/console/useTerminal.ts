"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  TerminalLine,
  getBootSequence,
  CommandContext,
  PORTFOLIO_COMMANDS,
  PORTFOLIO_STREAMING_COMMANDS,
  PORTFOLIO_INTERACTIVE_COMMANDS,
  LINUX_COMMANDS,
  LINUX_STREAMING_COMMANDS,
  LINUX_INTERACTIVE_COMMANDS,
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
  activeShell: "portfolio" | "linux";
  linuxDir: string;
}

const LINE_DELAY = 35; // ms between each animated line

export function useTerminal(shell: "portfolio" | "linux", onClose: () => void): UseTerminalReturn {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [linuxDir, setLinuxDir] = useState("~");

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
    (newLines: TerminalLine[], existingLines?: TerminalLine[], autoUnlock = true) => {
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

          // Mark animation complete on last line if autoUnlock is true
          if (i === newLines.length - 1 && autoUnlock) {
            setIsAnimating(false);
          }
        }, i * LINE_DELAY);
        animationRef.current.push(timer);
      });

      // Edge case: empty array
      if (newLines.length === 0 && autoUnlock) {
        setIsAnimating(false);
      }
    },
    [scrollToBottom],
  );

  // Execute a streaming command
  const executeStreamingCommand = useCallback(
    (commandKey: string, args: string[], baseLines: TerminalLine[]) => {
      const streamCmd = (shell === "portfolio" ? PORTFOLIO_STREAMING_COMMANDS : LINUX_STREAMING_COMMANDS)[commandKey];
      if (!streamCmd) return false;

      // Set base lines (echo line already included)
      setLines(baseLines);

      let lastEmitTime = Date.now();
      
      const cmdCtx: CommandContext = {
        args,
        activeShell: shell,
        onClose,
        linuxDir,
        setLinuxDir,
        history,
      };

      const cleanup = streamCmd(cmdCtx, (newLines: TerminalLine[]) => {
        lastEmitTime = Date.now();
        setLines((prev) => [...prev, ...newLines]);
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
    [shell, onClose, linuxDir, history, scrollToBottom],
  );

  // Initialize boot sequence for portfolio, mock MOTD for linux
  useEffect(() => {
    if (shell === "portfolio") {
      const bootLines = getBootSequence();
      animateLines(bootLines);
    } else {
      const linuxBoot: TerminalLine[] = [
        { text: "Welcome to PortfolioOS v1.0.4 (x86_64)", type: "muted" },
        { text: "Type 'help' for a list of available commands.", type: "muted" },
        { text: "", type: "plain" }
      ];
      setLines(linuxBoot);
    }
    
    return () => {
      animationRef.current.forEach(clearTimeout);
      streamCleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shell]);

    // Focus input after animation completes
    useEffect(() => {
      if (!isAnimating) {
        inputRef.current?.focus();
      }
    }, [isAnimating]);

    // Auto-scroll to bottom whenever lines change or animation ends
    useEffect(() => {
      requestAnimationFrame(() => scrollToBottom());
    }, [lines, isAnimating, scrollToBottom]);
  
    const executeInteractiveCommand = useCallback(
      (commandKey: string, args: string[], baseLines: TerminalLine[]) => {
        const interactiveCmd = (shell === "portfolio" ? PORTFOLIO_INTERACTIVE_COMMANDS : LINUX_INTERACTIVE_COMMANDS)[commandKey];
        if (!interactiveCmd) return false;
  
        // Set base lines (echo line already included)
        setLines(baseLines);

        const cmdCtx: CommandContext = {
          args,
          activeShell: shell,
          onClose,
          linuxDir,
          setLinuxDir,
          history,
        };
  
        const session = interactiveCmd(cmdCtx, {
          emitLines: (newLines: TerminalLine[], animate = true, autoUnlock = true) => {
            if (animate) {
              animateLines(newLines, undefined, autoUnlock);
            } else {
              setLines((prev) => [...prev, ...newLines]);
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
      [shell, onClose, linuxDir, history, scrollToBottom, animateLines]
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
    const promptStr = shell === "portfolio" 
      ? "  ❯ " 
      : `  mohibur@portfolio:${linuxDir}$ `;
    const echoLine: TerminalLine = { text: `${promptStr}${trimmed}`, type: "accent" };
    const currentLines = [...lines, echoLine];
    setLines(currentLines);
    setInput("");
  
    // If an interactive command is active, route input to it.
    if (activeInteractiveCmdRef.current) {
      activeInteractiveCmdRef.current.handleInput(trimmed);
      return;
    }
  
    // Parse input
    const parts = trimmed.split(/\s+/);
    const commandKey = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Special: clear
    if (commandKey === "clear") {
      setLines([]);
      return;
    }

    const interactiveReg = shell === "portfolio" ? PORTFOLIO_INTERACTIVE_COMMANDS : LINUX_INTERACTIVE_COMMANDS;
    const streamingReg = shell === "portfolio" ? PORTFOLIO_STREAMING_COMMANDS : LINUX_STREAMING_COMMANDS;
    const syncReg = shell === "portfolio" ? PORTFOLIO_COMMANDS : LINUX_COMMANDS;
  
    // Check interactive commands first
    if (interactiveReg[commandKey]) {
      executeInteractiveCommand(commandKey, args, currentLines);
      return;
    }
  
    // Check streaming commands
    if (streamingReg[commandKey]) {
      executeStreamingCommand(commandKey, args, currentLines);
      return;
    }
    
    const cmdCtx: CommandContext = {
      args,
      activeShell: shell,
      onClose,
      linuxDir,
      setLinuxDir,
      history,
    };

    // Fall back to sync commands
    const cmd = syncReg[commandKey];
    if (cmd) {
      const output = cmd(cmdCtx);
      animateLines(output, currentLines);
    } else {
      const errorLines: TerminalLine[] = shell === "portfolio" 
        ? [
            { text: "", type: "plain" },
            { text: `  Command not found: ${commandKey}`, type: "error" },
            { text: '  Type "help" for available commands.', type: "muted" },
            { text: "", type: "plain" },
          ]
        : [
            { text: `bash: ${commandKey}: command not found`, type: "plain" }
          ];
      animateLines(errorLines, currentLines);
    }
  }, [input, isAnimating, lines, animateLines, executeStreamingCommand, executeInteractiveCommand, shell, onClose, linuxDir, history]);

  // Handle key events (history navigation, enter, etc.)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // ── Terminal shortcuts (work even during animation) ──
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        animationRef.current.forEach(clearTimeout);
        animationRef.current = [];
        streamCleanupRef.current?.();
        streamCleanupRef.current = null;
        activeInteractiveCmdRef.current?.cleanup?.();
        activeInteractiveCmdRef.current = null;
        setIsAnimating(false);
        setLines((prev) => [...prev, { text: "  ^C", type: "muted" as const }]);
        setInput("");
        return;
      }

      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        animationRef.current.forEach(clearTimeout);
        animationRef.current = [];
        streamCleanupRef.current?.();
        streamCleanupRef.current = null;
        activeInteractiveCmdRef.current?.cleanup?.();
        activeInteractiveCmdRef.current = null;
        setIsAnimating(false);
        setLines([]);
        setInput("");
        return;
      }

      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        setInput("");
        return;
      }

      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        inputRef.current?.setSelectionRange(0, 0);
        return;
      }

      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        const len = inputRef.current?.value.length ?? 0;
        inputRef.current?.setSelectionRange(len, len);
        return;
      }

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
    activeShell: shell,
    linuxDir,
  };
}
