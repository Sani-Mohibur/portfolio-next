"use client";

import {
  TerminalLine,
  line,
  InteractiveCommandContext,
  InteractiveCommandSession,
} from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// resume — Interactive resume download prompt
// ────────────────────────────────────────────────────────────────────────────────

type ResumeState = "PROMPT" | "EXITED";

export function cmdResume(
  cmdCtx: any,
  ctx: InteractiveCommandContext,
): InteractiveCommandSession {
  let state: ResumeState = "PROMPT";

  // Show download prompt
  ctx.emitLines([
    line(""),
    line("  ╭─ Resume", "accent"),
    line("  │", "muted"),
    line("  │  Would you like to download my resume?", "info"),
    line('  │  Type "yes" or "no"', "muted"),
    line("  │", "muted"),
    line("  ╰──────────────────────────────────────────", "accent"),
    line(""),
  ]);

  return {
    handleInput: (input: string) => {
      const lower = input.toLowerCase().trim();

      if (state !== "PROMPT") return;

      if (lower === "yes" || lower === "y") {
        // Trigger browser download
        const anchor = document.createElement("a");
        anchor.href = portfolioData.resume.downloadUrl;
        anchor.download = portfolioData.resume.downloadName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        ctx.emitLines([
          line(""),
          line("  ✓ Resume download started!", "success"),
          line(`    ${portfolioData.resume.downloadName}`, "muted"),
          line(""),
        ]);
        state = "EXITED";
        ctx.exit();
      } else if (lower === "no" || lower === "n") {
        ctx.emitLines([
          line(""),
          line("  Resume download cancelled.", "muted"),
          line(""),
        ]);
        state = "EXITED";
        ctx.exit();
      } else {
        ctx.emitLines([line('  Please type "yes" or "no".', "error")]);
      }
    },
    cleanup: () => {},
  };
}
