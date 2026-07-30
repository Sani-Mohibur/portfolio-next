"use client";

import {
  TerminalLine,
  line,
  separator,
  InteractiveCommandContext,
  InteractiveCommandSession,
} from "./terminal-commands";

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

function randomHex(len: number): string {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function timestamp(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 23);
}

function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// ────────────────────────────────────────────────────────────────────────────────
// Streaming Scheduler
// ────────────────────────────────────────────────────────────────────────────────

interface StreamStep {
  lines: TerminalLine[];
  delay: number; // ms to wait BEFORE emitting these lines
}

function scheduleStream(
  steps: StreamStep[],
  emit: (lines: TerminalLine[], animate?: boolean, autoUnlock?: boolean) => void,
  onComplete?: () => void
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cumulative = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    cumulative += step.delay;
    const isLast = i === steps.length - 1;

    const timer = setTimeout(() => {
      emit(step.lines, true, isLast);
      if (isLast && onComplete) {
        onComplete();
      }
    }, cumulative);
    timers.push(timer);
  }

  return () => timers.forEach(clearTimeout);
}

// ────────────────────────────────────────────────────────────────────────────────
// Menus & Data
// ────────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "1",
    name: "ARCHIVES",
    files: [
      "project_titan.json",
      "legacy_protocol.log",
      "hidden_projects.db",
      "classified_records.dat",
    ],
  },
  {
    id: "2",
    name: "NEURAL_CORE",
    files: [
      "cognition_engine.bin",
      "ai_reasoning.module",
      "memory_cluster.dat",
      "neural_sync.log",
    ],
  },
  {
    id: "3",
    name: "OVERRIDE",
    files: [
      "root_access.cfg",
      "firewall_rules.sys",
      "kernel_patch.exe",
      "privilege_matrix.key",
    ],
  },
  {
    id: "4",
    name: "BLACK_BOX",
    files: [
      "unknown_signal.trace",
      "encrypted_payload.bin",
      "classified_event.log",
      "anomaly_report.dat",
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────────
// State Machine
// ────────────────────────────────────────────────────────────────────────────────

type OmegaState =
  | "CONSENT"
  | "MAIN_MENU"
  | "SUB_MENU"
  | "DECRYPTING"
  | "AUTH_TRAP"
  | "EXITED";

export function cmdOmega(ctx: InteractiveCommandContext): InteractiveCommandSession {
  let state: OmegaState = "CONSENT";
  let selectedCategory: typeof CATEGORIES[number] | null = null;
  let cancelStream: (() => void) | null = null;

  // 1. Initial Sequence
  const initSteps: StreamStep[] = [
    {
      delay: 200,
      lines: [
        line(""),
        line("[OMEGA PROTOCOL INITIATED]", "header"),
        line(""),
      ],
    },
    { delay: 600, lines: [line("Initializing secure interface...", "muted")] },
    { delay: 800, lines: [line("Establishing encrypted handshake...", "info")] },
    { delay: 700, lines: [line("Verifying terminal environment...", "info")] },
    { delay: 900, lines: [line("Connection secured.", "success"), line("")] },
    {
      delay: 600,
      lines: [
        line("[SECURITY NOTICE]: Unauthorized access is monitored. Do you wish to proceed with clearance verification? (y/n)", "warning"),
      ],
    },
  ];

  ctx.setAnimating(true);
  cancelStream = scheduleStream(initSteps, ctx.emitLines);

  const renderMainMenu = () => {
    ctx.emitLines([
      line(""),
      line("╔════════════════════════════╗", "accent"),
      line("║   OMEGA CLEARANCE MENU     ║", "accent"),
      line("╠════════════════════════════╣", "accent"),
      line("║ [1] ARCHIVES               ║", "info"),
      line("║ [2] NEURAL_CORE            ║", "info"),
      line("║ [3] OVERRIDE               ║", "info"),
      line("║ [4] BLACK_BOX              ║", "info"),
      line("╚════════════════════════════╝", "accent"),
      line(""),
      line("Select clearance pathway:", "muted"),
    ]);
  };

  const renderSubMenu = (category: typeof CATEGORIES[number]) => {
    const lines = [
      line(""),
      line(`[ ${category.name} ]`, "header"),
      separator(),
    ];
    category.files.forEach((file, index) => {
      lines.push(line(`[${index + 1}] ${file}`, "info"));
    });
    lines.push(line(""));
    lines.push(line("Select target file for decryption:", "muted"));
    ctx.emitLines(lines);
  };

  const startDecryption = () => {
    state = "DECRYPTING";
    ctx.setAnimating(true);

    const steps: StreamStep[] = [
      { delay: 400, lines: [line(""), line("Initializing decryption module...", "info"), line("")] },
      { delay: 800, lines: [line("Decrypting sector...", "muted")] },
      { delay: randomDelay(600, 1000), lines: [line("Bypassing firewall...", "warning")] },
      { delay: randomDelay(700, 1200), lines: [line("Validating encryption signature...", "info")] },
      { delay: randomDelay(800, 1300), lines: [line("Analyzing security layer...", "muted")] },
      { delay: randomDelay(900, 1400), lines: [line("Preparing authentication gateway...", "accent"), line("")] },
      {
        delay: 500,
        lines: [line("[AUTH REQUIRED]: Enter Level-5 Security Passcode ->", "error")],
      },
    ];

    cancelStream = scheduleStream(steps, ctx.emitLines, () => {
      state = "AUTH_TRAP";
    });
  };

  const startAuthTrap = () => {
    state = "DECRYPTING"; // reuse flag to lock input
    ctx.setAnimating(true);

    const steps: StreamStep[] = [
      { delay: 400, lines: [line("")] },
      { delay: 600, lines: [line("Analyzing credentials...", "info")] },
      { delay: 800, lines: [line("Cross-checking authorization level...", "muted")] },
      { delay: randomDelay(800, 1200), lines: [line("Verifying security clearance...", "warning"), line("")] },
      {
        delay: 600,
        lines: [
          line("[ACCESS DENIED]: Incorrect passcode.", "error"),
          line(""),
          line("[SECURITY ALERT]:", "error"),
          line("Unauthorized clearance attempt detected.", "warning"),
          line(""),
          line("[INCIDENT LOGGED]:", "error"),
          line("This attempt has been recorded.", "warning"),
          line(""),
          line("Do not attempt further access without proper authorization.", "muted"),
          line("Unauthorized interaction may trigger additional security protocols.", "muted"),
          line(""),
          line("Connection terminated.", "error"),
          line(""),
        ],
      },
    ];

    cancelStream = scheduleStream(steps, ctx.emitLines, () => {
      state = "EXITED";
      ctx.exit();
    });
  };

  return {
    handleInput: (input: string) => {
      const lower = input.toLowerCase().trim();

      if (state === "CONSENT") {
        if (lower === "y" || lower === "yes") {
          state = "MAIN_MENU";
          renderMainMenu();
        } else if (lower === "n" || lower === "no") {
          ctx.emitLines([
            line(""),
            line("[OMEGA PROTOCOL]: Clearance verification cancelled.", "muted"),
            line(""),
            line("Session closed.", "info"),
            line(""),
          ]);
          state = "EXITED";
          ctx.exit();
        } else {
          ctx.emitLines([line("Invalid response. Please enter 'y' or 'n'.", "error")]);
        }
        return;
      }

      if (state === "MAIN_MENU") {
        const cat = CATEGORIES.find((c) => c.id === lower);
        if (cat) {
          selectedCategory = cat;
          state = "SUB_MENU";
          renderSubMenu(cat);
        } else {
          ctx.emitLines([line("Invalid selection. Enter 1-4.", "error")]);
        }
        return;
      }

      if (state === "SUB_MENU") {
        const num = parseInt(lower, 10);
        if (num >= 1 && num <= 4) {
          startDecryption();
        } else {
          ctx.emitLines([line("Invalid selection. Enter 1-4.", "error")]);
        }
        return;
      }

      if (state === "AUTH_TRAP") {
        // Any input triggers the trap sequence
        startAuthTrap();
        return;
      }
    },
    cleanup: () => {
      if (cancelStream) {
        cancelStream();
      }
    },
  };
}
