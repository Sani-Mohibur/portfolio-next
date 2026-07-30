"use client";

import { portfolioData } from "../../lib/portfolio-data";
import { cmdSudo, cmdMatrix, streamSudo, streamMatrix } from "./terminal-easter-eggs";
import { cmdOmega } from "./terminal-easter-eggs-omega";
import { cmdContact } from "./terminal-contact";
import { cmdExperience } from "./terminal-experience";
import { cmdEducation } from "./terminal-education";
import { cmdProjects } from "./terminal-projects";
import { cmdSkills } from "./terminal-skills";
import { cmdResume } from "./terminal-resume";
import {
  cmdPwd,
  cmdCd,
  cmdLs,
  cmdCat,
  cmdWhoami as cmdLinuxWhoami,
  cmdDate,
  cmdUname,
  cmdEcho,
  cmdHistory,
  cmdExit,
  cmdUptime,
  cmdFree,
  cmdDf,
  cmdTop,
  cmdLinuxHelp,
} from "./terminal-linux";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

export interface TerminalLine {
  text: string;
  type: "info" | "success" | "warning" | "error" | "accent" | "muted" | "header" | "plain";
}

export interface CommandContext {
  args: string[];
  activeShell: "portfolio" | "linux";
  onClose: () => void;
  linuxDir: string;
  setLinuxDir: (dir: string) => void;
  history: string[];
}

/**
 * A streaming command pushes lines progressively via the `emit` callback.
 * It returns a cleanup/cancel function to abort in-flight timers.
 */
export type StreamingCommand = (
  ctx: CommandContext,
  emit: (lines: TerminalLine[]) => void,
) => () => void;

/**
 * An interactive command maintains state and handles user input sequentially.
 */
export interface InteractiveCommandContext {
  emitLines: (lines: TerminalLine[], animate?: boolean, autoUnlock?: boolean) => void;
  setAnimating: (isAnimating: boolean) => void;
  exit: () => void;
}

export interface InteractiveCommandSession {
  handleInput: (input: string) => void;
  cleanup?: () => void;
}

export type InteractiveCommand = (ctx: CommandContext, sessionCtx: InteractiveCommandContext) => InteractiveCommandSession;

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

export function line(text: string, type: TerminalLine["type"] = "plain"): TerminalLine {
  return { text, type };
}

export function separator(): TerminalLine {
  return line("─".repeat(52), "muted");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Boot Sequence — collects real browser data
// ────────────────────────────────────────────────────────────────────────────────

export function getBootSequence(): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const now = new Date();

  // lines.push(line("╔══════════════════════════════════════════════════╗", "accent"));
  // lines.push(line("║         PORTFOLIO DEVELOPER CONSOLE              ║", "accent"));
  // lines.push(line("║         Mohibur Rahman Sani — v1.0.0             ║", "accent"));
  // lines.push(line("╚══════════════════════════════════════════════════╝", "accent"));
  // lines.push(line(""));

  // Portfolio Status
  // lines.push(line("  ▸ Status", "header"));
  // lines.push(line(`    Status .............. ● Online`, "success"));
  // lines.push(line(`    Framework ........... Next.js + React`, "info"));
  // lines.push(line(`    Styling ............. Tailwind CSS v4`, "info"));
  // lines.push(line(`    Timestamp ........... ${now.toLocaleString()}`, "info"));
  // lines.push(line(""));
  // lines.push(line("  Developer Console", "accent"));
  lines.push(line(`  Session Started ..... ${now.toLocaleString()}`, "muted"));
  lines.push(line(""));

  // Hydration & Rendering
  lines.push(line("  ▸ Hydration & Rendering", "header"));
  // lines.push(line(`    Hydration ........... ● Complete`, "success"));
  lines.push(line(`    Render Mode ......... Client-Side (CSR)`, "info"));

  if (typeof performance !== "undefined") {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming;
      lines.push(line(`    DOM Interactive ..... ${Math.round(nav.domInteractive)}ms`, "info"));
      lines.push(line(`    DOM Complete ........ ${Math.round(nav.domComplete)}ms`, "info"));
      lines.push(line(`    Load Event .......... ${Math.round(nav.loadEventEnd)}ms`, "info"));
    }
  }
  lines.push(line(""));

  // Theme & Route
  lines.push(line("  ▸ Environment", "header"));
  const isDark = document.documentElement.classList.contains("dark");
  lines.push(line(`    Theme ............... ${isDark ? "◐ Dark" : "◑ Light"}`, "info"));
  lines.push(line(`    Route ............... ${window.location.pathname}`, "info"));
  lines.push(line(`    Locale .............. ${navigator.language}`, "info"));
  lines.push(line(`    Timezone ............ ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, "info"));
  lines.push(line(""));

  // Browser & Device
  lines.push(line("  ▸ Browser & Device", "header"));
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  lines.push(line(`    Browser ............. ${browser}`, "info"));
  lines.push(line(`    Platform ............ ${os}`, "info"));
  lines.push(line(`    Cores ............... ${navigator.hardwareConcurrency || "N/A"}`, "info"));
  lines.push(line(`    Touch ............... ${navigator.maxTouchPoints > 0 ? "Yes" : "No"}`, "info"));
  lines.push(line(""));

  // Screen
  lines.push(line("  ▸ Display", "header"));
  lines.push(line(`    Viewport ............ ${window.innerWidth} × ${window.innerHeight}`, "info"));
  lines.push(line(`    Screen .............. ${screen.width} × ${screen.height}`, "info"));
  lines.push(line(`    Pixel Ratio ......... ${window.devicePixelRatio}x`, "info"));
  lines.push(line(`    Color Depth ......... ${screen.colorDepth}-bit`, "info"));
  lines.push(line(""));

  // Memory (Chrome-only)
  const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (perfMemory) {
    lines.push(line("  ▸ Memory", "header"));
    lines.push(line(`    JS Heap Used ........ ${formatBytes(perfMemory.usedJSHeapSize)}`, "info"));
    lines.push(line(`    JS Heap Limit ....... ${formatBytes(perfMemory.jsHeapSizeLimit)}`, "info"));
    lines.push(line(""));
  }

  // Network
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
  if (conn) {
    lines.push(line("  ▸ Network", "header"));
    lines.push(line(`    Connection .......... ${conn.effectiveType || "N/A"}`, "info"));
    if (conn.downlink) lines.push(line(`    Downlink ............ ${conn.downlink} Mbps`, "info"));
    if (conn.rtt) lines.push(line(`    RTT ................. ${conn.rtt}ms`, "info"));
    lines.push(line(""));
  }

  lines.push(separator());
  lines.push(line('  Type "help" for available commands.', "muted"));
  lines.push(line(""));

  return lines;
}

// ────────────────────────────────────────────────────────────────────────────────
// Commands
// ────────────────────────────────────────────────────────────────────────────────

export function cmdHelp(): TerminalLine[] {
  return [
    line(""),
    line("  Available Commands", "header"),
    separator(),
    line(""),
    line("  ▸ Portfolio", "header"),
    line("    projects .......... Browse portfolio projects", "info"),
    line("    skills ............ Explore technical skills", "info"),
    line("    experience ........ Professional work experience", "info"),
    line("    education ......... Academic background", "info"),
    line("    contact ........... Contact information", "info"),
    line("    resume ............ Download resume", "info"),
    line(""),
    line("  ▸ System", "header"),
    line("    about ............. Portfolio owner information", "info"),
    line("    whoami ............ Quick identity", "info"),
    line("    performance ....... Web Vitals & performance metrics", "info"),
    line("    system ............ Browser & device information", "info"),
    line(""),
    line("  ▸ Utilities", "header"),
    line("    shell ............. Switch to Linux Shell", "info"),
    line("    help .............. Show this help message", "info"),
    line("    clear ............. Clear terminal output", "info"),
    line(""),
    line("  Shortcuts: Ctrl+C cancel · Ctrl+L clear · Ctrl+U clear line", "muted"),
    line(""),
  ];
}

export function cmdWhoami(): TerminalLine[] {
  const { personal } = portfolioData;
  return [
    line(""),
    line(`  ${personal.name} — ${personal.title}`, "accent"),
    line(`  ${personal.tagline}`, "muted"),
    line(""),
  ];
}

export function cmdAbout(): TerminalLine[] {
  const { personal, contact, skills } = portfolioData;
  const featuredSkills = skills.filter((s) => s.featured).map((s) => s.name);

  return [
    line(""),
    line(`  ╭─ ${personal.name}`, "accent"),
    line(`  │  ${personal.title}`, "header"),
    line(`  │`, "muted"),
    line(`  │  📍 ${personal.location}`, "info"),
    line(`  │  🎓 ${personal.education}`, "info"),
    line(`  │  📧 ${contact.email}`, "info"),
    line(`  │  🔗 ${contact.github}`, "info"),
    line(`  │`, "muted"),
    // line(`  │  Featured Skills`, "header"),
    // line(`  │  ${featuredSkills.join(" · ")}`, "success"),
    // line(`  │`, "muted"),
    // line(`  │  "${personal.tagline}"`, "muted"),
    line(`  ╰──────────────────────────────────────────`, "accent"),
    line(""),
  ];
}

export function cmdPerformance(): TerminalLine[] {
  const lines: TerminalLine[] = [];
  lines.push(line(""));
  lines.push(line("  ▸ Performance Metrics", "header"));
  lines.push(separator());

  // Navigation Timing
  if (typeof performance !== "undefined") {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming;

      lines.push(line(`    DNS Lookup .......... ${Math.round(nav.domainLookupEnd - nav.domainLookupStart)}ms`, "info"));
      lines.push(line(`    TCP Connect ......... ${Math.round(nav.connectEnd - nav.connectStart)}ms`, "info"));
      lines.push(line(`    Request ............. ${Math.round(nav.responseStart - nav.requestStart)}ms`, "info"));
      lines.push(line(`    Response ............ ${Math.round(nav.responseEnd - nav.responseStart)}ms`, "info"));
      lines.push(line(`    DOM Interactive ..... ${Math.round(nav.domInteractive)}ms`, "info"));
      lines.push(line(`    DOM Complete ........ ${Math.round(nav.domComplete)}ms`, "info"));
      lines.push(line(`    Load Event .......... ${Math.round(nav.loadEventEnd)}ms`, nav.loadEventEnd < 2000 ? "success" : "warning"));
      lines.push(line(`    Transfer Size ....... ${formatBytes(nav.transferSize)}`, "info"));
    }
  }

  // Paint Timing
  if (typeof performance !== "undefined") {
    const paintEntries = performance.getEntriesByType("paint");
    lines.push(line(""));
    lines.push(line("  ▸ Paint Timing", "header"));
    lines.push(separator());

    const fcp = paintEntries.find((e) => e.name === "first-contentful-paint");
    const fp = paintEntries.find((e) => e.name === "first-paint");

    lines.push(line(`    First Paint ......... ${fp ? Math.round(fp.startTime) + "ms" : "N/A"}`, fp && fp.startTime < 1000 ? "success" : "info"));
    lines.push(line(`    First Contentful .... ${fcp ? Math.round(fcp.startTime) + "ms" : "N/A"}`, fcp && fcp.startTime < 1800 ? "success" : "info"));
  }

  // Memory
  const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (perfMemory) {
    lines.push(line(""));
    lines.push(line("  ▸ Memory", "header"));
    lines.push(separator());
    lines.push(line(`    Used Heap ........... ${formatBytes(perfMemory.usedJSHeapSize)}`, "info"));
    lines.push(line(`    Total Heap .......... ${formatBytes(perfMemory.totalJSHeapSize)}`, "info"));
    lines.push(line(`    Heap Limit .......... ${formatBytes(perfMemory.jsHeapSizeLimit)}`, "info"));
    const usage = ((perfMemory.usedJSHeapSize / perfMemory.jsHeapSizeLimit) * 100).toFixed(1);
    lines.push(line(`    Usage ............... ${usage}%`, Number(usage) < 50 ? "success" : "warning"));
  }

  // Resource count
  if (typeof performance !== "undefined") {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    lines.push(line(""));
    lines.push(line("  ▸ Resources", "header"));
    lines.push(separator());
    lines.push(line(`    Total Resources ..... ${resources.length}`, "info"));

    const scripts = resources.filter((r) => r.name.endsWith(".js") || r.initiatorType === "script");
    const styles = resources.filter((r) => r.name.endsWith(".css") || r.initiatorType === "css");
    const images = resources.filter((r) => r.initiatorType === "img");

    lines.push(line(`    Scripts ............. ${scripts.length}`, "info"));
    lines.push(line(`    Stylesheets ......... ${styles.length}`, "info"));
    lines.push(line(`    Images .............. ${images.length}`, "info"));
  }

  lines.push(line(""));
  return lines;
}

export function cmdSystem(): TerminalLine[] {
  const lines: TerminalLine[] = [];
  lines.push(line(""));
  lines.push(line("  ▸ System Information", "header"));
  lines.push(separator());

  // Browser
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let browserVersion = "";
  if (ua.includes("Firefox")) {
    browser = "Firefox";
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Edg")) {
    browser = "Microsoft Edge";
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Chrome")) {
    browser = "Chrome";
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Safari")) {
    browser = "Safari";
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || "";
  }

  let os = "Unknown";
  if (ua.includes("Windows NT 10")) os = "Windows 10/11";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) {
    const ver = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".");
    os = ver ? `macOS ${ver}` : "macOS";
  } else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone")) os = "iOS (iPhone)";
  else if (ua.includes("iPad")) os = "iOS (iPad)";

  lines.push(line(`    Browser ............. ${browser} ${browserVersion}`, "info"));
  lines.push(line(`    OS .................. ${os}`, "info"));
  lines.push(line(`    Language ............ ${navigator.language}`, "info"));
  lines.push(line(`    Cores ............... ${navigator.hardwareConcurrency || "N/A"}`, "info"));
  lines.push(line(`    Touch Points ........ ${navigator.maxTouchPoints}`, "info"));
  lines.push(line(`    Cookies Enabled ..... ${navigator.cookieEnabled ? "Yes" : "No"}`, "info"));
  lines.push(line(`    Online .............. ${navigator.onLine ? "Yes" : "No"}`, navigator.onLine ? "success" : "error"));

  // Display
  lines.push(line(""));
  lines.push(line("  ▸ Display", "header"));
  lines.push(separator());
  lines.push(line(`    Viewport ............ ${window.innerWidth} × ${window.innerHeight}`, "info"));
  lines.push(line(`    Screen .............. ${screen.width} × ${screen.height}`, "info"));
  lines.push(line(`    Available ........... ${screen.availWidth} × ${screen.availHeight}`, "info"));
  lines.push(line(`    Pixel Ratio ......... ${window.devicePixelRatio}x`, "info"));
  lines.push(line(`    Color Depth ......... ${screen.colorDepth}-bit`, "info"));
  lines.push(line(`    Orientation ......... ${screen.orientation?.type || "N/A"}`, "info"));

  // Theme
  lines.push(line(""));
  lines.push(line("  ▸ Theme & Preferences", "header"));
  lines.push(separator());
  const isDark = document.documentElement.classList.contains("dark");
  lines.push(line(`    Active Theme ........ ${isDark ? "◐ Dark" : "◑ Light"}`, "info"));
  lines.push(line(`    Prefers Dark ........ ${window.matchMedia("(prefers-color-scheme: dark)").matches ? "Yes" : "No"}`, "info"));
  lines.push(line(`    Prefers Reduced ..... ${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "Yes" : "No"}`, "info"));

  // Network
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection;
  if (conn) {
    lines.push(line(""));
    lines.push(line("  ▸ Network", "header"));
    lines.push(separator());
    lines.push(line(`    Type ................ ${conn.effectiveType || "N/A"}`, "info"));
    if (conn.downlink !== undefined) lines.push(line(`    Downlink ............ ${conn.downlink} Mbps`, "info"));
    if (conn.rtt !== undefined) lines.push(line(`    RTT ................. ${conn.rtt}ms`, "info"));
    lines.push(line(`    Save Data ........... ${conn.saveData ? "Yes" : "No"}`, "info"));
  }

  lines.push(line(""));
  return lines;
}

// ────────────────────────────────────────────────────────────────────────────────
// Command Registry
// ────────────────────────────────────────────────────────────────────────────────

export const PORTFOLIO_COMMANDS: Record<string, (ctx: CommandContext) => TerminalLine[]> = {
  help: cmdHelp,
  about: cmdAbout,
  whoami: cmdWhoami,
  contact: cmdContact,
  experience: cmdExperience,
  education: cmdEducation,
  performance: cmdPerformance,
  system: cmdSystem,
};

export const PORTFOLIO_STREAMING_COMMANDS: Record<string, StreamingCommand> = {};

export const PORTFOLIO_INTERACTIVE_COMMANDS: Record<string, InteractiveCommand> = {
  projects: cmdProjects,
  skills: cmdSkills,
  resume: cmdResume,
};

// These will be populated from terminal-linux.ts in a subsequent step, 
// but for now we initialize them with the easter eggs.
export const LINUX_COMMANDS: Record<string, (ctx: CommandContext) => TerminalLine[]> = {
  pwd: cmdPwd,
  cd: cmdCd,
  ls: cmdLs,
  cat: cmdCat,
  whoami: cmdLinuxWhoami,
  date: cmdDate,
  uname: cmdUname,
  echo: cmdEcho,
  history: cmdHistory,
  uptime: cmdUptime,
  free: cmdFree,
  df: cmdDf,
  top: cmdTop,
  exit: cmdExit,
  help: cmdLinuxHelp,
  sudo: cmdSudo,
  matrix: cmdMatrix,
};

export const LINUX_STREAMING_COMMANDS: Record<string, StreamingCommand> = {
  sudo: streamSudo,
  matrix: streamMatrix,
};

export const LINUX_INTERACTIVE_COMMANDS: Record<string, InteractiveCommand> = {
  omega: cmdOmega,
};
