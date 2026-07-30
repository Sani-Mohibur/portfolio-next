"use client";

import { TerminalLine, line, separator } from "./terminal-commands";

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

function randomHex(len: number): string {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function randomPid(): number {
  return Math.floor(Math.random() * 60000) + 1000;
}

function timestamp(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 23);
}

function randomIp(): string {
  return `${Math.floor(Math.random() * 223) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomPort(): number {
  return Math.floor(Math.random() * 50000) + 10000;
}

/** Random delay between min and max ms */
function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// ────────────────────────────────────────────────────────────────────────────────
// Streaming scheduler — drives progressive line emission
// ────────────────────────────────────────────────────────────────────────────────

interface StreamStep {
  lines: TerminalLine[];
  delay: number; // ms to wait BEFORE emitting these lines
}

/**
 * Schedules a sequence of StreamSteps, emitting each batch after its delay.
 * Returns a cancel function that clears all pending timers.
 */
function scheduleStream(
  steps: StreamStep[],
  emit: (lines: TerminalLine[]) => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cumulative = 0;

  for (const step of steps) {
    cumulative += step.delay;
    const timer = setTimeout(() => {
      emit(step.lines);
    }, cumulative);
    timers.push(timer);
  }

  return () => timers.forEach(clearTimeout);
}

// ────────────────────────────────────────────────────────────────────────────────
// sudo — Sync fallback (kept for backward compatibility)
// ────────────────────────────────────────────────────────────────────────────────

let sudoAttempts = 0;

export function cmdSudo(ctx: any): TerminalLine[] {
  sudoAttempts++;
  const lines: TerminalLine[] = [];
  const pid = randomPid();

  if (sudoAttempts === 1) {
    lines.push(line(""));
    lines.push(line("  ⚠ Warning: This command requires elevated privileges.", "warning"));
    lines.push(line(""));
    lines.push(line(`  [${timestamp()}] sudo: session initiated`, "muted"));
    lines.push(line(`  [${timestamp()}] sudo: resolving identity...`, "info"));
    lines.push(line(`  [${timestamp()}] pam_unix(sudo:auth): auth request for uid=1000`, "info"));
    lines.push(line(`  [${timestamp()}] sudo: user "visitor" NOT in sudoers`, "error"));
    lines.push(line(""));
    lines.push(separator());
    lines.push(line("  Access Denied — insufficient privileges.", "error"));
    lines.push(line("  This incident will be reported.", "warning"));
    lines.push(line(""));
    lines.push(line('  Hint: Try "sudo" again to escalate.', "muted"));
    lines.push(line(""));
  } else if (sudoAttempts === 2) {
    lines.push(line(""));
    lines.push(line("  ◉ Privilege Escalation Sequence — Attempt #2", "header"));
    lines.push(separator());
    lines.push(line(""));
    lines.push(line(`  [${timestamp()}] sudo: re-authenticating session...`, "info"));
    lines.push(line(`  [${timestamp()}] pam_unix(sudo:auth): credential verification`, "info"));
    lines.push(line(`  [${timestamp()}] sudo: loading /etc/sudoers.d/portfolio`, "info"));
    lines.push(line(`  [${timestamp()}] PAM: checking group membership...`, "info"));
    lines.push(line(""));
    lines.push(line(`  PID ${pid}  ▐█████████████████████████▌  Authenticating`, "accent"));
    lines.push(line(""));
    lines.push(line(`  [${timestamp()}] kernel: audit(${Date.now()}.${randomHex(3)}:${Math.floor(Math.random() * 900) + 100})`, "muted"));
    lines.push(line(`  [${timestamp()}] kernel: type=1400 avc: denied { execute }`, "muted"));
    lines.push(line(`  [${timestamp()}] kernel:   scontext=visitor:user_r:user_t:s0`, "muted"));
    lines.push(line(`  [${timestamp()}] kernel:   tcontext=system_u:object_r:admin_exec_t:s0`, "muted"));
    lines.push(line(""));
    lines.push(line(`  [${timestamp()}] sudo: probing capability matrix...`, "info"));
    lines.push(line(`  [${timestamp()}] sudo: CAP_SYS_ADMIN ............ ✗ denied`, "error"));
    lines.push(line(`  [${timestamp()}] sudo: CAP_NET_ADMIN ............ ✗ denied`, "error"));
    lines.push(line(`  [${timestamp()}] sudo: CAP_DAC_OVERRIDE ......... ✗ denied`, "error"));
    lines.push(line(`  [${timestamp()}] sudo: CAP_SYS_PTRACE ........... ✗ denied`, "error"));
    lines.push(line(""));
    lines.push(line(`  PID ${pid}  ▐█████████████████████████▌  Complete`, "warning"));
    lines.push(line(""));
    lines.push(separator());
    lines.push(line("  ✗ AUTHORIZATION FAILED", "error"));
    lines.push(separator());
    lines.push(line(""));
    lines.push(line("  This portfolio operates in a read-only sandbox.", "info"));
    lines.push(line("  No filesystem or kernel access is available.", "info"));
    lines.push(line("  The owner has been notified of this attempt.", "warning"));
    lines.push(line(""));
    lines.push(line("  Nice try though. 😉", "success"));
    lines.push(line(""));
  } else {
    lines.push(line(""));
    lines.push(line(`  [${timestamp()}] sudo: session blocked — too many attempts`, "error"));
    lines.push(line(`  [${timestamp()}] sudo: lockout for uid=1000 (attempt #${sudoAttempts})`, "error"));
    lines.push(line(`  [${timestamp()}] audit: ANOM_ABEND pid=${randomPid()} uid=1000 sig=SIGKILL`, "muted"));
    lines.push(line(""));
    lines.push(line("  You've been flagged. Relax, it's just a portfolio. 🙂", "success"));
    lines.push(line(""));
  }

  return lines;
}

// ────────────────────────────────────────────────────────────────────────────────
// matrix — Sync fallback (kept for backward compatibility)
// ────────────────────────────────────────────────────────────────────────────────

export function cmdMatrix(ctx: any): TerminalLine[] {
  const lines: TerminalLine[] = [];

  lines.push(line(""));
  lines.push(line("  ╔══════════════════════════════════════════════╗", "success"));
  lines.push(line("  ║  NEURAL INTERFACE v4.2.1 — SECURE CHANNEL   ║", "success"));
  lines.push(line("  ╚══════════════════════════════════════════════╝", "success"));
  lines.push(line(""));
  lines.push(line(`  [INIT] Establishing encrypted tunnel...`, "accent"));
  lines.push(line(`  [INIT] TLS 1.3 handshake ........ ● complete`, "success"));
  lines.push(line(`  [INIT] Session ID: ${randomHex(32)}`, "muted"));
  lines.push(line(""));
  lines.push(line("  ▸ Memory Scan", "header"));
  lines.push(separator());
  for (let i = 0; i < 4; i++) {
    const addr = `0x${randomHex(12).toUpperCase()}`;
    const size = `${(Math.random() * 512 + 64).toFixed(0)}K`;
    const status = i === 2 ? "FLAGGED" : "OK";
    const statusType: TerminalLine["type"] = i === 2 ? "warning" : "info";
    lines.push(line(`    ${addr}  │  ${size.padStart(5)}  │  rwx${i % 2 === 0 ? "p" : "s"}  │  ${status}`, statusType));
  }
  lines.push(line(""));
  lines.push(line("  ▸ Packet Trace", "header"));
  lines.push(separator());
  for (let i = 0; i < 5; i++) {
    const src = `${randomIp()}:${randomPort()}`;
    const dst = `${randomIp()}:${randomPort()}`;
    const proto = ["TCP", "UDP", "TLS", "QUIC", "WSS"][i];
    const bytes = Math.floor(Math.random() * 4096) + 128;
    lines.push(line(`    ${proto.padEnd(5)} ${src.padEnd(22)} → ${dst.padEnd(22)} ${bytes}B`, "info"));
  }
  lines.push(line(""));
  lines.push(line("  ▸ Encryption Layer", "header"));
  lines.push(separator());
  lines.push(line(`    AES-256-GCM  key: ${randomHex(64)}`, "muted"));
  lines.push(line(`    HMAC-SHA512  sig: ${randomHex(64)}`, "muted"));
  lines.push(line(`    ChaCha20     nce: ${randomHex(24)}`, "muted"));
  lines.push(line(""));
  lines.push(line("  ▸ Active Processes", "header"));
  lines.push(separator());
  const processes = [
    { name: "neural-core", cpu: "12.4%", mem: "284M", status: "RUNNING" },
    { name: "data-pipeline", cpu: "8.7%", mem: "156M", status: "RUNNING" },
    { name: "crypto-daemon", cpu: "3.2%", mem: "64M", status: "IDLE" },
    { name: "render-engine", cpu: "22.1%", mem: "512M", status: "ACTIVE" },
    { name: "threat-monitor", cpu: "1.8%", mem: "32M", status: "WATCHING" },
  ];
  for (const proc of processes) {
    const pidStr = `${randomPid()}`.padStart(5);
    const statusType: TerminalLine["type"] = proc.status === "WATCHING" ? "warning" : proc.status === "ACTIVE" ? "accent" : "info";
    lines.push(line(`    PID ${pidStr}  ${proc.name.padEnd(16)}  CPU ${proc.cpu.padStart(6)}  MEM ${proc.mem.padStart(5)}  ${proc.status}`, statusType));
  }
  lines.push(line(""));
  lines.push(line("  ▸ Integrity Verification", "header"));
  lines.push(separator());
  lines.push(line(`    SHA-256 .... ${randomHex(64)}`, "info"));
  lines.push(line(`    BLAKE3  .... ${randomHex(64)}`, "info"));
  lines.push(line(`    Checksum ... ● VERIFIED`, "success"));
  lines.push(line(""));
  lines.push(line("  ╭─────────────────────────────────────────────╮", "accent"));
  lines.push(line("  │  System integrity: NOMINAL                  │", "success"));
  lines.push(line("  │  Threat level:     NONE DETECTED             │", "success"));
  lines.push(line("  │  Status:           ALL SYSTEMS OPERATIONAL   │", "accent"));
  lines.push(line("  ╰─────────────────────────────────────────────╯", "accent"));
  lines.push(line(""));
  lines.push(line("  Wake up, Neo... The Matrix has you. 🐇", "success"));
  lines.push(line(""));

  return lines;
}

// ════════════════════════════════════════════════════════════════════════════════
//
//  STREAMING VERSIONS — progressive output with realistic delays
//
// ════════════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────────────────
// streamSudo — Cinematic progressive authorization sequence
// ────────────────────────────────────────────────────────────────────────────────

export function streamSudo(
  ctx: any,
  emit: (lines: TerminalLine[]) => void,
): () => void {
  sudoAttempts++;
  const pid = randomPid();

  if (sudoAttempts >= 3) {
    // Third+ attempts: instant lockout (no streaming needed)
    const steps: StreamStep[] = [
      {
        delay: 300,
        lines: [
          line(""),
          line(`  [${timestamp()}] sudo: session blocked — too many attempts`, "error"),
          line(`  [${timestamp()}] sudo: lockout for uid=1000 (attempt #${sudoAttempts})`, "error"),
          line(`  [${timestamp()}] audit: ANOM_ABEND pid=${randomPid()} uid=1000 sig=SIGKILL`, "muted"),
          line(""),
          line("  You've been flagged. Relax, it's just a portfolio. 🙂", "success"),
          line(""),
        ],
      },
    ];
    return scheduleStream(steps, emit);
  }

  if (sudoAttempts === 1) {
    // ── First attempt: warning → probe → denial ──
    const steps: StreamStep[] = [
      {
        delay: 200,
        lines: [
          line(""),
          line("  ⚠ Warning: This command requires elevated privileges.", "warning"),
        ],
      },
      {
        delay: randomDelay(800, 1200),
        lines: [
          line(""),
          line(`  [${timestamp()}] sudo: initializing secure session...`, "muted"),
        ],
      },
      {
        delay: randomDelay(600, 1000),
        lines: [
          line(`  [${timestamp()}] sudo: checking device identity...`, "info"),
        ],
      },
      {
        delay: randomDelay(900, 1400),
        lines: [
          line(`  [${timestamp()}] sudo: resolving public IP...`, "info"),
        ],
      },
      {
        delay: randomDelay(700, 1100),
        lines: [
          line(`  [${timestamp()}] sudo: verifying authorization...`, "info"),
        ],
      },
      {
        delay: randomDelay(1000, 1500),
        lines: [
          line(`  [${timestamp()}] pam_unix(sudo:auth): auth request for uid=1000`, "info"),
        ],
      },
      {
        delay: randomDelay(800, 1200),
        lines: [
          line(`  [${timestamp()}] sudo: querying /etc/sudoers...`, "info"),
        ],
      },
      {
        delay: randomDelay(1200, 1800),
        lines: [
          line(`  [${timestamp()}] sudo: user "visitor" NOT in sudoers`, "error"),
          line(""),
        ],
      },
      {
        delay: randomDelay(600, 900),
        lines: [
          separator(),
          line("  Access Denied — insufficient privileges.", "error"),
          line("  This incident will be reported.", "warning"),
          line(""),
        ],
      },
    ];
    return scheduleStream(steps, emit);
  }

  // ── Second attempt: full cinematic escalation ──
  const steps: StreamStep[] = [
    {
      delay: 200,
      lines: [
        line(""),
        line("  ◉ Privilege Escalation Sequence — Attempt #2", "header"),
        separator(),
      ],
    },
    {
      delay: randomDelay(600, 1000),
      lines: [
        line(""),
        line(`  [${timestamp()}] sudo: re-authenticating session...`, "info"),
      ],
    },
    {
      delay: randomDelay(700, 1100),
      lines: [
        line(`  [${timestamp()}] sudo: establishing encrypted channel...`, "info"),
      ],
    },
    {
      delay: randomDelay(900, 1300),
      lines: [
        line(`  [${timestamp()}] pam_unix(sudo:auth): credential verification`, "info"),
      ],
    },
    {
      delay: randomDelay(600, 1000),
      lines: [
        line(`  [${timestamp()}] sudo: loading /etc/sudoers.d/portfolio`, "info"),
      ],
    },
    {
      delay: randomDelay(800, 1200),
      lines: [
        line(`  [${timestamp()}] PAM: checking group membership...`, "info"),
      ],
    },
    {
      delay: randomDelay(1000, 1600),
      lines: [
        line(""),
        line(`  PID ${pid}  ▐█████████████████████████▌  Authenticating`, "accent"),
        line(""),
      ],
    },
    {
      delay: randomDelay(800, 1200),
      lines: [
        line(`  [${timestamp()}] kernel: audit(${Date.now()}.${randomHex(3)}:${Math.floor(Math.random() * 900) + 100})`, "muted"),
      ],
    },
    {
      delay: randomDelay(400, 700),
      lines: [
        line(`  [${timestamp()}] kernel: type=1400 avc: denied { execute }`, "muted"),
      ],
    },
    {
      delay: randomDelay(300, 500),
      lines: [
        line(`  [${timestamp()}] kernel:   scontext=visitor:user_r:user_t:s0`, "muted"),
      ],
    },
    {
      delay: randomDelay(300, 500),
      lines: [
        line(`  [${timestamp()}] kernel:   tcontext=system_u:object_r:admin_exec_t:s0`, "muted"),
        line(""),
      ],
    },
    {
      delay: randomDelay(900, 1400),
      lines: [
        line(`  [${timestamp()}] sudo: probing capability matrix...`, "info"),
      ],
    },
    {
      delay: randomDelay(500, 800),
      lines: [
        line(`  [${timestamp()}] sudo: CAP_SYS_ADMIN ............ ✗ denied`, "error"),
      ],
    },
    {
      delay: randomDelay(400, 700),
      lines: [
        line(`  [${timestamp()}] sudo: CAP_NET_ADMIN ............ ✗ denied`, "error"),
      ],
    },
    {
      delay: randomDelay(400, 700),
      lines: [
        line(`  [${timestamp()}] sudo: CAP_DAC_OVERRIDE ......... ✗ denied`, "error"),
      ],
    },
    {
      delay: randomDelay(400, 700),
      lines: [
        line(`  [${timestamp()}] sudo: CAP_SYS_PTRACE ........... ✗ denied`, "error"),
        line(""),
      ],
    },
    {
      delay: randomDelay(800, 1200),
      lines: [
        line(`  PID ${pid}  ▐█████████████████████████▌  Complete`, "warning"),
        line(""),
        separator(),
        line("  ✗ AUTHORIZATION FAILED", "error"),
        separator(),
      ],
    },
    {
      delay: randomDelay(1000, 1500),
      lines: [
        line(""),
        line("  This portfolio operates in a read-only sandbox.", "info"),
        line("  No filesystem or kernel access is available.", "info"),
        line("  The owner has been notified of this attempt.", "warning"),
        line(""),
        line("  Nice try though. 😉", "success"),
        line(""),
      ],
    },
  ];

  return scheduleStream(steps, emit);
}

// ────────────────────────────────────────────────────────────────────────────────
// streamMatrix — Progressive cyber terminal sequence
// ────────────────────────────────────────────────────────────────────────────────

export function streamMatrix(
  ctx: any,
  emit: (lines: TerminalLine[]) => void,
): () => void {
  const steps: StreamStep[] = [];

  // ── Phase 1: Initialization ──
  steps.push({
    delay: 200,
    lines: [
      line(""),
      line("  ╔══════════════════════════════════════════════╗", "success"),
      line("  ║  NEURAL INTERFACE v4.2.1 — SECURE CHANNEL   ║", "success"),
      line("  ╚══════════════════════════════════════════════╝", "success"),
      line(""),
    ],
  });

  steps.push({
    delay: randomDelay(700, 1000),
    lines: [
      line(`  [INIT] Establishing encrypted tunnel...`, "accent"),
    ],
  });

  steps.push({
    delay: randomDelay(900, 1400),
    lines: [
      line(`  [INIT] Resolving DNS via DoH...`, "info"),
    ],
  });

  steps.push({
    delay: randomDelay(600, 1000),
    lines: [
      line(`  [INIT] Negotiating cipher suite...`, "info"),
    ],
  });

  steps.push({
    delay: randomDelay(800, 1200),
    lines: [
      line(`  [INIT] TLS 1.3 handshake ........ ● complete`, "success"),
      line(`  [INIT] Session ID: ${randomHex(32)}`, "muted"),
      line(""),
    ],
  });

  // ── Phase 2: Memory Scan ──
  steps.push({
    delay: randomDelay(600, 1000),
    lines: [
      line("  ▸ Memory Scan", "header"),
      separator(),
    ],
  });

  for (let i = 0; i < 4; i++) {
    const addr = `0x${randomHex(12).toUpperCase()}`;
    const size = `${(Math.random() * 512 + 64).toFixed(0)}K`;
    const status = i === 2 ? "FLAGGED" : "OK";
    const statusType: TerminalLine["type"] = i === 2 ? "warning" : "info";
    steps.push({
      delay: randomDelay(300, 600),
      lines: [
        line(`    ${addr}  │  ${size.padStart(5)}  │  rwx${i % 2 === 0 ? "p" : "s"}  │  ${status}`, statusType),
      ],
    });
  }

  steps.push({
    delay: randomDelay(400, 700),
    lines: [line("")],
  });

  // ── Phase 3: Packet Trace ──
  steps.push({
    delay: randomDelay(600, 1000),
    lines: [
      line("  ▸ Packet Trace", "header"),
      separator(),
    ],
  });

  const protocols = ["TCP", "UDP", "TLS", "QUIC", "WSS"];
  for (let i = 0; i < 5; i++) {
    const src = `${randomIp()}:${randomPort()}`;
    const dst = `${randomIp()}:${randomPort()}`;
    const bytes = Math.floor(Math.random() * 4096) + 128;
    steps.push({
      delay: randomDelay(250, 500),
      lines: [
        line(`    ${protocols[i].padEnd(5)} ${src.padEnd(22)} → ${dst.padEnd(22)} ${bytes}B`, "info"),
      ],
    });
  }

  steps.push({
    delay: randomDelay(400, 700),
    lines: [line("")],
  });

  // ── Phase 4: Encryption Layer ──
  steps.push({
    delay: randomDelay(700, 1100),
    lines: [
      line("  ▸ Encryption Layer", "header"),
      separator(),
    ],
  });

  steps.push({
    delay: randomDelay(400, 700),
    lines: [
      line(`    AES-256-GCM  key: ${randomHex(64)}`, "muted"),
    ],
  });

  steps.push({
    delay: randomDelay(300, 600),
    lines: [
      line(`    HMAC-SHA512  sig: ${randomHex(64)}`, "muted"),
    ],
  });

  steps.push({
    delay: randomDelay(300, 600),
    lines: [
      line(`    ChaCha20     nce: ${randomHex(24)}`, "muted"),
      line(""),
    ],
  });

  // ── Phase 5: Process Monitor ──
  steps.push({
    delay: randomDelay(700, 1100),
    lines: [
      line("  ▸ Active Processes", "header"),
      separator(),
    ],
  });

  const processes = [
    { name: "neural-core", cpu: "12.4%", mem: "284M", status: "RUNNING" },
    { name: "data-pipeline", cpu: "8.7%", mem: "156M", status: "RUNNING" },
    { name: "crypto-daemon", cpu: "3.2%", mem: "64M", status: "IDLE" },
    { name: "render-engine", cpu: "22.1%", mem: "512M", status: "ACTIVE" },
    { name: "threat-monitor", cpu: "1.8%", mem: "32M", status: "WATCHING" },
  ];

  for (const proc of processes) {
    const pidStr = `${randomPid()}`.padStart(5);
    const statusType: TerminalLine["type"] = proc.status === "WATCHING" ? "warning" : proc.status === "ACTIVE" ? "accent" : "info";
    steps.push({
      delay: randomDelay(300, 600),
      lines: [
        line(`    PID ${pidStr}  ${proc.name.padEnd(16)}  CPU ${proc.cpu.padStart(6)}  MEM ${proc.mem.padStart(5)}  ${proc.status}`, statusType),
      ],
    });
  }

  steps.push({
    delay: randomDelay(400, 700),
    lines: [line("")],
  });

  // ── Phase 6: Integrity Verification ──
  steps.push({
    delay: randomDelay(800, 1200),
    lines: [
      line("  ▸ Integrity Verification", "header"),
      separator(),
    ],
  });

  steps.push({
    delay: randomDelay(500, 800),
    lines: [
      line(`    SHA-256 .... ${randomHex(64)}`, "info"),
    ],
  });

  steps.push({
    delay: randomDelay(400, 700),
    lines: [
      line(`    BLAKE3  .... ${randomHex(64)}`, "info"),
    ],
  });

  steps.push({
    delay: randomDelay(600, 1000),
    lines: [
      line(`    Checksum ... ● VERIFIED`, "success"),
      line(""),
    ],
  });

  // ── Phase 7: Final Status ──
  steps.push({
    delay: randomDelay(800, 1200),
    lines: [
      line("  ╭─────────────────────────────────────────────╮", "accent"),
      line("  │  System integrity: NOMINAL                  │", "success"),
      line("  │  Threat level:     NONE DETECTED             │", "success"),
      line("  │  Status:           ALL SYSTEMS OPERATIONAL   │", "accent"),
      line("  ╰─────────────────────────────────────────────╯", "accent"),
      line(""),
      line("  Wake up, Neo... The Matrix has you. 🐇", "success"),
      line(""),
    ],
  });

  return scheduleStream(steps, emit);
}
