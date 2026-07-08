"use client";

import React, { useRef, useMemo, useEffect, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom, createAsteroidGeometry } from "./utils";
import { sharedMouse } from "./sharedState";
import type { AsteroidData } from "./types";

// ────────────────────────────────────────────────────────────────────────────────
// Instanced asteroids — enhanced material & expanded color palette
// ────────────────────────────────────────────────────────────────────────────────

interface AsteroidsProps {
  count: number;
  enableCursorInfluence: boolean;
}

const Asteroids: FC<AsteroidsProps> = ({ count, enableCursorInfluence }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Deterministic asteroid data
  const asteroids = useMemo<AsteroidData[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }, () => {
      const orbitRadius = 4 + rand() * 14;
      const angle = rand() * Math.PI * 2;
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * orbitRadius,
          (rand() - 0.5) * 8,
          Math.sin(angle) * orbitRadius,
        ),
        rotation: new THREE.Euler(
          rand() * Math.PI * 2,
          rand() * Math.PI * 2,
          rand() * Math.PI * 2,
        ),
        scale: 0.15 + rand() * 0.45,
        rotationSpeed: new THREE.Vector3(
          (rand() - 0.5) * 0.3,
          (rand() - 0.5) * 0.3,
          (rand() - 0.5) * 0.2,
        ),
        orbitRadius,
        orbitSpeed: (rand() - 0.5) * 0.02,
        orbitOffset: angle,
      };
    });
  }, [count]);

  const geometry = useMemo(() => createAsteroidGeometry(123), []);

  // Enhanced PBR material with subtle emissive edge glow
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.85,
        metalness: 0.15,
        flatShading: true,
        emissive: new THREE.Color("#1a1a2e"),
        emissiveIntensity: 0.1,
      }),
    [],
  );

  // Per-instance colors — expanded from brown-grey to include metallic blues/purples
  useEffect(() => {
    if (!meshRef.current) return;
    const rand = seededRandom(99);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const palette = rand();
      if (palette < 0.4) {
        // Dark rocky brown (original range)
        color.setHSL(0.05 + rand() * 0.08, 0.05 + rand() * 0.15, 0.08 + rand() * 0.12);
      } else if (palette < 0.7) {
        // Dark metallic blue
        color.setHSL(0.6 + rand() * 0.1, 0.15 + rand() * 0.2, 0.06 + rand() * 0.1);
      } else {
        // Dark purple/violet
        color.setHSL(0.75 + rand() * 0.1, 0.1 + rand() * 0.2, 0.06 + rand() * 0.1);
      }
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05); // Guard against tab-switch spikes

    for (let i = 0; i < count; i++) {
      const a = asteroids[i];

      // Slow orbit
      a.orbitOffset += a.orbitSpeed * clampedDelta;
      dummy.position.set(
        Math.cos(a.orbitOffset) * a.orbitRadius,
        a.position.y + Math.sin(a.orbitOffset * 0.7) * 0.3,
        Math.sin(a.orbitOffset) * a.orbitRadius,
      );

      // Subtle cursor influence — gently push nearby asteroids
      if (enableCursorInfluence) {
        const mouseX = sharedMouse.nx * 8;
        const mouseY = sharedMouse.ny * 5;
        const dx = dummy.position.x - mouseX;
        const dy = dummy.position.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 16 && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const push = (1 - dist / 4) * 0.15;
          dummy.position.x += (dx / dist) * push;
          dummy.position.y += (dy / dist) * push;
        }
      }

      // Tumble
      a.rotation.x += a.rotationSpeed.x * clampedDelta;
      a.rotation.y += a.rotationSpeed.y * clampedDelta;
      a.rotation.z += a.rotationSpeed.z * clampedDelta;
      dummy.rotation.copy(a.rotation);

      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
};

export default Asteroids;
