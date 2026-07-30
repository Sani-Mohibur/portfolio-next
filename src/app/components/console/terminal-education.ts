"use client";

import { TerminalLine, line, separator } from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// education — Display academic background
// ────────────────────────────────────────────────────────────────────────────────

export function cmdEducation(): TerminalLine[] {
  const lines: TerminalLine[] = [];

  lines.push(line(""));
  lines.push(line("  ▸ Education", "header"));
  lines.push(separator());

  for (const edu of portfolioData.education) {
    lines.push(line(""));
    lines.push(line(`  ╭─ ${edu.degree}`, "accent"));
    lines.push(line(`  │  🏫 ${edu.institution}`, "info"));
    lines.push(line(`  │  📊 ${edu.score}`, "success"));
    lines.push(line("  ╰──────────────────────────────────────────", "accent"));
  }

  lines.push(line(""));
  return lines;
}
