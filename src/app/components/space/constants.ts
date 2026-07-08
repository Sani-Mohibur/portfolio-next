import type { QualityTier, QualityConfig } from "./types";

// ────────────────────────────────────────────────────────────────────────────────
// Quality tier configurations
// ────────────────────────────────────────────────────────────────────────────────

export const QUALITY_CONFIGS: Record<QualityTier, QualityConfig> = {
  high: {
    distantStars: 2000,
    cosmicDust: 600,
    foregroundParticles: 200,
    nebulaPlanes: 3,
    asteroids: 12,
    futuristicObjects: 8,
    orbitalLights: 2,
    enableCursorInfluence: true,
  },
  medium: {
    distantStars: 1200,
    cosmicDust: 300,
    foregroundParticles: 100,
    nebulaPlanes: 2,
    asteroids: 10,
    futuristicObjects: 4,
    orbitalLights: 1,
    enableCursorInfluence: true,
  },
  low: {
    distantStars: 600,
    cosmicDust: 0,
    foregroundParticles: 0,
    nebulaPlanes: 1,
    asteroids: 6,
    futuristicObjects: 2,
    orbitalLights: 0,
    enableCursorInfluence: false,
  },
};

// ────────────────────────────────────────────────────────────────────────────────
// Scene constants
// ────────────────────────────────────────────────────────────────────────────────

export const TRAIL_LENGTH = 40;
export const TRAIL_DECAY = 2.5;
export const PARALLAX_STRENGTH = 0.06;
export const LERP_SPEED = 0.04;

// ────────────────────────────────────────────────────────────────────────────────
// Color palette
// ────────────────────────────────────────────────────────────────────────────────

export const PALETTE = {
  deepSpaceBlack: "#000000",
  navyVoid: "#0a0e27",
  midnightBlue: "#0f172a",
  electricBlue: "#3b82f6",
  cyanHighlight: "#22d3ee",
  violet: "#8b5cf6",
  deepPurple: "#4a1d96",
  warmAccent: "#f472b6",
  indigo: "#6366f1",
  lightViolet: "#a78bfa",
  lightCyan: "#67e8f9",
} as const;
