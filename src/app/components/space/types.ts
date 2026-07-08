import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Quality
// ────────────────────────────────────────────────────────────────────────────────

export type QualityTier = "high" | "medium" | "low";

export interface QualityConfig {
  distantStars: number;
  cosmicDust: number;
  foregroundParticles: number;
  nebulaPlanes: number;
  asteroids: number;
  futuristicObjects: number;
  orbitalLights: number;
  enableCursorInfluence: boolean;
}

// ────────────────────────────────────────────────────────────────────────────────
// Scene data
// ────────────────────────────────────────────────────────────────────────────────

export interface AsteroidData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  rotationSpeed: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

export interface ObjectData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  rotationSpeed: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

export interface MouseTrailPoint {
  position: THREE.Vector3;
  age: number;
}
