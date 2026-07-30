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
// projects — Interactive project browser
// ────────────────────────────────────────────────────────────────────────────────

type ProjectsState = "LIST" | "DETAIL" | "EXITED";

export function cmdProjects(
  cmdCtx: any,
  ctx: InteractiveCommandContext,
): InteractiveCommandSession {
  let state: ProjectsState = "LIST";
  const projects = portfolioData.projects;

  const renderList = () => {
    const lines: TerminalLine[] = [
      line(""),
      line("  ▸ Portfolio Projects", "header"),
      separator(),
      line(""),
    ];

    projects.forEach((project, i) => {
      lines.push(line(`  [${i + 1}]  ${project.title}`, "info"));
      lines.push(line(`       ${project.description}`, "muted"));
      lines.push(line(""));
    });

    lines.push(separator());
    lines.push(
      line(
        `  Select a project (1-${projects.length}) or type "exit"`,
        "muted",
      ),
    );

    ctx.emitLines(lines);
  };

  const renderDetail = (index: number) => {
    const project = projects[index];
    const lines: TerminalLine[] = [];

    // Title card
    lines.push(line(""));
    lines.push(line(`  ╭─ ${project.title}`, "accent"));
    lines.push(
      line("  ╰──────────────────────────────────────────", "accent"),
    );
    lines.push(line(""));

    // Brief description
    lines.push(line(`  ${project.brief}`, "info"));
    lines.push(line(""));

    // Tech Stack
    lines.push(line("  ▸ Tech Stack", "header"));
    lines.push(line(`    ${project.technologies.join(" · ")}`, "success"));
    lines.push(line(""));

    // Key Features
    if (project.features && project.features.length > 0) {
      lines.push(line("  ▸ Key Features", "header"));
      for (const feature of project.features) {
        lines.push(line(`    • ${feature}`, "info"));
      }
      lines.push(line(""));
    }

    // Links
    lines.push(line("  ▸ Links", "header"));
    if ("githubFrontend" in project && project.githubFrontend) {
      lines.push(
        line(`    GitHub (Frontend) ... ${project.githubFrontend}`, "info"),
      );
    }
    if ("githubBackend" in project && project.githubBackend) {
      lines.push(
        line(`    GitHub (Backend)  ... ${project.githubBackend}`, "info"),
      );
    }
    if (project.live) {
      lines.push(line(`    Live Demo ........... ${project.live}`, "info"));
    } else {
      lines.push(line("    Live Demo ........... Not deployed", "muted"));
    }
    lines.push(line(""));

    lines.push(separator());
    lines.push(
      line('  Type "back" for project list or "exit" to quit', "muted"),
    );

    ctx.emitLines(lines);
  };

  // Show initial list
  renderList();

  return {
    handleInput: (input: string) => {
      const lower = input.toLowerCase().trim();

      if (lower === "exit" || lower === "quit") {
        ctx.emitLines([
          line(""),
          line("  Exiting projects.", "muted"),
          line(""),
        ]);
        state = "EXITED";
        ctx.exit();
        return;
      }

      if (state === "LIST") {
        const num = parseInt(lower, 10);
        if (num >= 1 && num <= projects.length) {
          state = "DETAIL";
          renderDetail(num - 1);
        } else {
          ctx.emitLines([
            line(`  Invalid selection. Enter 1-${projects.length}.`, "error"),
          ]);
        }
        return;
      }

      if (state === "DETAIL") {
        if (lower === "back") {
          state = "LIST";
          renderList();
        } else {
          ctx.emitLines([line('  Type "back" or "exit".', "error")]);
        }
        return;
      }
    },
    cleanup: () => {},
  };
}
