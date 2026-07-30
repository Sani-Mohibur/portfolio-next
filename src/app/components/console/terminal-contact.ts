"use client";

import { TerminalLine, line } from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// contact — Display contact information with clickable links
// ────────────────────────────────────────────────────────────────────────────────

export function cmdContact(): TerminalLine[] {
  const { contact } = portfolioData;

  return [
    line(""),
    line("  ╭─ Contact Information", "accent"),
    line("  │", "muted"),
    line(`  │  📧 Email ............. ${contact.email}`, "info"),
    line(`  │  🐙 GitHub ............ ${contact.github}`, "info"),
    line(`  │  💼 LinkedIn .......... ${contact.linkedin}`, "info"),
    line(`  │  📱 Phone ............. ${contact.phone}`, "info"),
    line(`  │  🌐 Website ........... ${contact.website}`, "info"),
    line(`  │  📸 Instagram ......... ${contact.instagram}`, "info"),
    line(`  │  🐦 Twitter/X ......... ${contact.twitter}`, "info"),
    line("  │", "muted"),
    line("  ╰──────────────────────────────────────────", "accent"),
    line(""),
  ];
}
