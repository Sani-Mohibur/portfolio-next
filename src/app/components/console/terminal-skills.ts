"use client";

import {
  TerminalLine,
  line,
  separator,
  InteractiveCommandContext,
  InteractiveCommandSession,
} from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// skills — Interactive skill category browser
// ────────────────────────────────────────────────────────────────────────────────

type SkillsState = "CATEGORIES" | "DETAIL" | "EXITED";

export function cmdSkills(
  ctx: InteractiveCommandContext,
): InteractiveCommandSession {
  let state: SkillsState = "CATEGORIES";

  // Extract unique categories preserving insertion order
  const categories = [
    ...new Set(portfolioData.skills.map((s) => s.category)),
  ];

  const renderCategories = () => {
    const lines: TerminalLine[] = [
      line(""),
      line("  ▸ Skill Categories", "header"),
      separator(),
      line(""),
    ];

    categories.forEach((cat, i) => {
      const count = portfolioData.skills.filter(
        (s) => s.category === cat,
      ).length;
      lines.push(line(`  [${i + 1}]  ${cat}  (${count})`, "info"));
    });

    lines.push(line(""));
    lines.push(separator());
    lines.push(
      line(
        `  Select a category (1-${categories.length}) or type "exit"`,
        "muted",
      ),
    );

    ctx.emitLines(lines);
  };

  const renderCategory = (index: number) => {
    const category = categories[index];
    const skills = portfolioData.skills.filter(
      (s) => s.category === category,
    );

    const lines: TerminalLine[] = [
      line(""),
      line(`  ▸ ${category}`, "header"),
      separator(),
      line(""),
    ];

    skills.forEach((skill) => {
      lines.push(line(`    ◦ ${skill.name}`, "success"));
    });

    lines.push(line(""));
    lines.push(separator());
    lines.push(
      line('  Type "back" for categories or "exit" to quit', "muted"),
    );

    ctx.emitLines(lines);
  };

  // Show initial categories
  renderCategories();

  return {
    handleInput: (input: string) => {
      const lower = input.toLowerCase().trim();

      if (lower === "exit" || lower === "quit") {
        ctx.emitLines([
          line(""),
          line("  Exiting skills.", "muted"),
          line(""),
        ]);
        state = "EXITED";
        ctx.exit();
        return;
      }

      if (state === "CATEGORIES") {
        const num = parseInt(lower, 10);
        if (num >= 1 && num <= categories.length) {
          state = "DETAIL";
          renderCategory(num - 1);
        } else {
          ctx.emitLines([
            line(
              `  Invalid selection. Enter 1-${categories.length}.`,
              "error",
            ),
          ]);
        }
        return;
      }

      if (state === "DETAIL") {
        if (lower === "back") {
          state = "CATEGORIES";
          renderCategories();
        } else {
          ctx.emitLines([line('  Type "back" or "exit".', "error")]);
        }
        return;
      }
    },
    cleanup: () => {},
  };
}
