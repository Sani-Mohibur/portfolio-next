import { TerminalLine, line, CommandContext } from "./terminal-commands";
import { portfolioData } from "../../lib/portfolio-data";

// ────────────────────────────────────────────────────────────────────────────────
// Mock Filesystem
// ────────────────────────────────────────────────────────────────────────────────

interface FileEntry {
  type: "file";
  content: string;
  permissions: string;
  owner: string;
  size: number;
  date: string;
}

interface DirEntry {
  type: "dir";
  children: Record<string, FileEntry | DirEntry>;
  permissions: string;
  owner: string;
  size: number;
  date: string;
}

const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function createFile(content: string, permissions = "-rw-r--r--"): FileEntry {
  return {
    type: "file",
    content,
    permissions,
    owner: "mohibur",
    size: content.length,
    date: currentDate,
  };
}

function createDir(children: Record<string, FileEntry | DirEntry>, permissions = "drwxr-xr-x", owner = "mohibur"): DirEntry {
  return {
    type: "dir",
    children,
    permissions,
    owner,
    size: 4096,
    date: currentDate,
  };
}

// Generate dynamic projects directory
const projectsDirChildren: Record<string, DirEntry> = {};
portfolioData.projects.forEach(p => {
  const folderName = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  projectsDirChildren[folderName] = createDir({
    "README.md": createFile(`# ${p.title}\n\n${p.description}\n\nTech Stack: ${p.technologies.join(', ')}\n\nLive: ${p.live || 'N/A'}`)
  });
});

const FS: DirEntry = createDir({
  home: createDir({
    mohibur: createDir({
      ".bashrc": createFile("# ~/.bashrc\nexport PATH=$PATH:~/bin\nalias ll='ls -la'\n"),
      ".profile": createFile("# ~/.profile\n"),
      ".ssh": createDir({
        "id_ed25519.pub": createFile("ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH/9yA4mXb... mohibur@portfolio")
      }, "drwx------"),
      ".secret": createDir({
        "sudo": createFile("#!/bin/bash\necho 'Nice try...'", "-rwxr-xr-x"),
        "matrix": createFile("#!/bin/bash\necho 'Follow the white rabbit...'", "-rwxr-xr-x"),
        "omega": createFile("#!/bin/bash\necho 'I am the Alpha and the Omega.'", "-rwxr-xr-x"),
      }),
      "about": createDir({
        "about.txt": createFile(`Name: ${portfolioData.personal.name}\nTitle: ${portfolioData.personal.title}\n\n${portfolioData.personal.intro}\n\n${portfolioData.personal.z.join('\n\n')}`)
      }),
      "projects": createDir(projectsDirChildren),
      "skills": createDir({
        "skills.txt": createFile(portfolioData.skills.map(s => `- ${s.name} (${s.category})`).join('\n'))
      }),
      "experience": createDir({
        "experience.txt": createFile(portfolioData.experience.map(e => `${e.role} at ${e.company}\n${e.duration}\n- ${e.responsibilities.join('\n- ')}`).join('\n\n'))
      }),
      "education": createDir({
        "education.txt": createFile(portfolioData.education.map(e => `${e.degree}\n${e.institution} | ${e.score}`).join('\n\n'))
      }),
      "contact": createDir({
        "contact.txt": createFile(`Email: ${portfolioData.contact.email}\nPhone: ${portfolioData.contact.phone}\nLinkedIn: ${portfolioData.contact.linkedin}\nGitHub: ${portfolioData.contact.github}`)
      }),
      "resume": createDir({
        "resume.txt": createFile(`Download my full resume at:\n${portfolioData.resume.downloadUrl}`)
      })
    }, "drwxr-xr-x", "root")
  }, "drwxr-xr-x", "root"),
  etc: createDir({
    passwd: createFile("root:x:0:0:root:/root:/bin/bash\nmohibur:x:1000:1000:Mohibur:/home/mohibur:/bin/bash\n"),
    issue: createFile("PortfolioOS 1.0.4 \\n \\l\n")
  }, "drwxr-xr-x", "root"),
  var: createDir({
    log: createDir({}, "drwxr-xr-x", "root")
  }, "drwxr-xr-x", "root")
}, "drwxr-xr-x", "root");

// ────────────────────────────────────────────────────────────────────────────────
// Path Resolution
// ────────────────────────────────────────────────────────────────────────────────

const HOME_DIR = "/home/mohibur";

function resolvePath(currentDir: string, targetPath: string): string {
  const absCurrentDir = currentDir.startsWith("~") ? currentDir.replace("~", HOME_DIR) : currentDir;
  if (!targetPath) return absCurrentDir;

  let p = targetPath;
  if (p.startsWith("~/")) p = HOME_DIR + p.substring(1);
  if (p === "~") p = HOME_DIR;

  let base = p.startsWith("/") ? "" : absCurrentDir;
  const parts = p.split("/").filter(Boolean);
  const baseParts = base.split("/").filter(Boolean);

  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      baseParts.pop();
    } else {
      baseParts.push(part);
    }
  }

  return "/" + baseParts.join("/");
}

function getNode(path: string): FileEntry | DirEntry | null {
  const parts = path.split("/").filter(Boolean);
  let current: FileEntry | DirEntry = FS;

  for (const part of parts) {
    if (current.type !== "dir" || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }

  return current;
}

// ────────────────────────────────────────────────────────────────────────────────
// Commands
// ────────────────────────────────────────────────────────────────────────────────

export function cmdPwd(ctx: CommandContext): TerminalLine[] {
  const absoluteDir = ctx.linuxDir.startsWith("~")
    ? ctx.linuxDir.replace("~", HOME_DIR)
    : ctx.linuxDir;
  return [line(absoluteDir, "plain")];
}

export function cmdCd(ctx: CommandContext): TerminalLine[] {
  const target = ctx.args[0] || "~";
  const resolved = resolvePath(ctx.linuxDir === "~" ? HOME_DIR : ctx.linuxDir, target);

  const node = getNode(resolved);
  if (!node) {
    return [line(`bash: cd: ${target}: No such file or directory`, "plain")];
  }
  if (node.type !== "dir") {
    return [line(`bash: cd: ${target}: Not a directory`, "plain")];
  }

  const displayDir = resolved === HOME_DIR ? "~" : resolved.replace(HOME_DIR, "~");
  ctx.setLinuxDir(displayDir);
  return [];
}

export function cmdLs(ctx: CommandContext): TerminalLine[] {
  const args = ctx.args.filter(a => a.startsWith("-"));
  const paths = ctx.args.filter(a => !a.startsWith("-"));

  const showAll = args.some(a => a.includes("a"));
  const longFormat = args.some(a => a.includes("l"));
  const humanReadable = args.some(a => a.includes("h"));

  const targetPath = paths.length > 0 ? paths[0] : ".";
  const resolved = resolvePath(ctx.linuxDir === "~" ? HOME_DIR : ctx.linuxDir, targetPath);
  const node = getNode(resolved);

  if (!node) {
    return [line(`ls: cannot access '${targetPath}': No such file or directory`, "plain")];
  }

  if (node.type === "file") {
    if (longFormat) {
      const sizeStr = humanReadable ? (node.size > 1024 ? `${(node.size / 1024).toFixed(1)}K` : `${node.size}`) : `${node.size}`;
      return [line(`${node.permissions} 1 ${node.owner} ${node.owner} ${sizeStr.padStart(5)} ${node.date} ${targetPath}`, "plain")];
    }
    return [line(targetPath, "plain")];
  }

  const entries = Object.entries(node.children);
  if (showAll) {
    entries.unshift([".", node]);
    // Mock parent for display purposes
    entries.unshift(["..", { type: "dir", permissions: "drwxr-xr-x", owner: "root", size: 4096, date: node.date, children: {} }]);
  } else {
    // filter hidden
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i][0].startsWith(".")) {
        entries.splice(i, 1);
      }
    }
  }

  if (longFormat) {
    const totalBlocks = entries.length * 8; // mock blocks
    const lines: TerminalLine[] = [line(`total ${totalBlocks}`, "plain")];
    for (const [name, entry] of entries) {
      const sizeStr = humanReadable ? (entry.size > 1024 ? `${(entry.size / 1024).toFixed(1)}K` : `${entry.size}`) : `${entry.size}`;
      const display = entry.type === "dir" ? `${name}/` : name;
      lines.push(line(`${entry.permissions} 1 ${entry.owner} ${entry.owner} ${sizeStr.padStart(5)} ${entry.date} ${display}`, entry.type === "dir" ? "info" : "plain"));
    }
    return lines;
  }

  // Simple output
  const outStr = entries.map(([name, entry]) => entry.type === "dir" ? `${name}/` : name).join("  ");
  return outStr ? [line(outStr, "plain")] : [];
}

export function cmdCat(ctx: CommandContext): TerminalLine[] {
  if (ctx.args.length === 0) return [line("cat: missing operand", "plain")];

  const lines: TerminalLine[] = [];
  for (const file of ctx.args) {
    const resolved = resolvePath(ctx.linuxDir === "~" ? HOME_DIR : ctx.linuxDir, file);
    const node = getNode(resolved);

    if (!node) {
      lines.push(line(`cat: ${file}: No such file or directory`, "plain"));
    } else if (node.type === "dir") {
      lines.push(line(`cat: ${file}: Is a directory`, "plain"));
    } else {
      const parts = node.content.split("\n");
      for (const p of parts) {
        lines.push(line(p, "plain"));
      }
    }
  }
  return lines;
}

export function cmdWhoami(): TerminalLine[] {
  return [line("mohibur", "plain")];
}

export function cmdDate(): TerminalLine[] {
  return [line(new Date().toString(), "plain")];
}

export function cmdUname(ctx: CommandContext): TerminalLine[] {
  const isAll = ctx.args.includes("-a");
  if (isAll) {
    return [line("Linux portfolio 5.15.0-1042-aws #47-Ubuntu SMP PREEMPT x86_64 x86_64 x86_64 GNU/Linux", "plain")];
  }
  return [line("Linux", "plain")];
}

export function cmdEcho(ctx: CommandContext): TerminalLine[] {
  return [line(ctx.args.join(" "), "plain")];
}

export function cmdHistory(ctx: CommandContext): TerminalLine[] {
  return ctx.history.map((h, i) => line(`  ${i + 1}  ${h}`, "plain"));
}

export function cmdExit(ctx: CommandContext): TerminalLine[] {
  ctx.onClose();
  return [
    line(""),
    line("logout", "plain"),
    line("Closing Linux Shell...", "success"),
    line(""),
  ];
}

export function cmdUptime(): TerminalLine[] {
  const uptimeMs = performance.now();
  const totalSeconds = Math.floor(uptimeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
  const formattedHours = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes} min`;
  
  return [
    line(` ${timeString} up ${formattedHours},  1 user,  load average: ${(Math.random() * 0.5).toFixed(2)}, ${(Math.random() * 0.5).toFixed(2)}, ${(Math.random() * 0.5).toFixed(2)}`, "plain")
  ];
}

export function cmdFree(): TerminalLine[] {
  const mem = (performance as any).memory;
  let total = 8192; // 8Gi fallback
  let used = 4096;
  let free = 4096;
  
  if (mem) {
    total = Math.round(mem.jsHeapSizeLimit / (1024 * 1024));
    used = Math.round(mem.usedJSHeapSize / (1024 * 1024));
    free = total - used;
  }
  
  return [
    line("               total        used        free      shared  buff/cache   available", "plain"),
    line(`Mem:           ${total}Mi       ${used}Mi       ${free}Mi         0Mi       256Mi       ${free + 128}Mi`, "plain"),
    line(`Swap:          2048Mi          0Mi      2048Mi`, "plain")
  ];
}

export function cmdDf(): TerminalLine[] {
  return [
    line("Filesystem      Size  Used Avail Use% Mounted on", "plain"),
    line("udev            3.9G     0  3.9G   0% /dev", "plain"),
    line("tmpfs           798M  1.2M  797M   1% /run", "plain"),
    line("/dev/nvme0n1p1   50G   14G   34G  29% /", "plain"),
    line("tmpfs           3.9G     0  3.9G   0% /dev/shm", "plain"),
    line("tmpfs           5.0M     0  5.0M   0% /run/lock", "plain"),
    line("tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup", "plain"),
    line("/dev/nvme0n1p15 105M  6.1M   99M   6% /boot/efi", "plain"),
    line("tmpfs           798M     0  798M   0% /run/user/1000", "plain"),
  ];
}

export function cmdTop(): TerminalLine[] {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (performance as any).memory;
  const totalMem = mem ? Math.round(mem.jsHeapSizeLimit / 1024) : 8388608;
  const usedMem = mem ? Math.round(mem.usedJSHeapSize / 1024) : 4194304;
  const freeMem = totalMem - usedMem;
  
  const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
  const uptimeMs = performance.now();
  const minutes = Math.floor(uptimeMs / 60000);
  
  return [
    line(`top - ${timeString} up ${minutes} min,  1 user,  load average: 0.02, 0.04, 0.05`, "plain"),
    line(`Tasks: 112 total,   1 running, 111 sleeping,   0 stopped,   0 zombie`, "plain"),
    line(`%Cpu(s):  1.5 us,  0.5 sy,  0.0 ni, 97.9 id,  0.1 wa,  0.0 hi,  0.0 si,  0.0 st`, "plain"),
    line(`MiB Mem :   ${Math.round(totalMem/1024).toString().padStart(5)} total,   ${Math.round(freeMem/1024).toString().padStart(5)} free,   ${Math.round(usedMem/1024).toString().padStart(5)} used,     256 buff/cache`, "plain"),
    line(`MiB Swap:    2048 total,    2048 free,       0 used.   ${Math.round((freeMem/1024) + 128).toString().padStart(5)} avail Mem `, "plain"),
    line(""),
    line("    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND", "info"),
    line(`      1 root      20   0  169420  13516   8416 S   0.0   0.2   0:02.13 systemd`, "plain"),
    line(`    832 root      20   0  314812  32512  18312 S   0.0   0.4   0:01.44 NetworkManager`, "plain"),
    line(`   1294 mohibur   20   0 3543208 245124  78412 S   1.3   ${(usedMem/totalMem * 100).toFixed(1).padStart(3)}   0:14.22 browser`, "plain"),
    line(`   1543 mohibur   20   0 1142512  85112  41212 R   0.7   1.1   0:03.11 terminal`, "plain"),
    line(`   1544 mohibur   20   0   12412   4124   3112 S   0.0   0.1   0:00.01 top`, "plain"),
  ];
}

export function cmdLinuxHelp(): TerminalLine[] {
  return [
    line(""),
    line("GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)", "plain"),
    line("These shell commands are defined internally.", "plain"),
    line(""),
    line("  ls [-a] [-l] [-h] [dir] List directory contents.", "info"),
    line("  cd [dir]       Change the shell working directory.", "info"),
    line("  pwd            Print name of current/working directory.", "info"),
    line("  cat [file]     Concatenate files and print on the standard output.", "info"),
    line("  history        Display the history list with line numbers.", "info"),
    line("  clear          Clear the terminal screen.", "info"),
    line("  echo [arg ...] Write arguments to the standard output.", "info"),
    line("  whoami         Print effective userid.", "info"),
    line("  date           Print or set the system date and time.", "info"),
    line("  uname [-a]     Print system information.", "info"),
    line("  uptime         Tell how long the system has been running.", "info"),
    line("  free [-h]      Display amount of free and used memory in the system.", "info"),
    line("  df [-h]        Report file system disk space usage.", "info"),
    line("  top            Display Linux processes.", "info"),
    line("  help           Display information about builtin commands.", "info"),
    line("  exit           Exit the shell.", "info"),
    line(""),
  ];
}
