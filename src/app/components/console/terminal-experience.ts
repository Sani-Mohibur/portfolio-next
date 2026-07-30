"use client";

import { TerminalLine, line, separator } from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// experience — Display professional work experience
// ────────────────────────────────────────────────────────────────────────────────

export function cmdExperience(): TerminalLine[] {
  const lines: TerminalLine[] = [];

  lines.push(line(""));
  lines.push(line("  ▸ Professional Experience", "header"));
  lines.push(separator());

  for (const exp of portfolioData.experience) {
    lines.push(line(""));
    lines.push(line(`  ╭─ ${exp.role}`, "accent"));
    lines.push(line(`  │  🏢 ${exp.company} · ${exp.location}`, "info"));
    lines.push(line(`  │  📅 ${exp.duration}`, "muted"));
    lines.push(line("  │", "muted"));
    for (const resp of exp.responsibilities) {
      lines.push(line(`  │  • ${resp}`, "info"));
    }
    lines.push(line("  │", "muted"));
    lines.push(line("  ╰──────────────────────────────────────────", "accent"));
  }

  lines.push(line(""));
  return lines;
}
