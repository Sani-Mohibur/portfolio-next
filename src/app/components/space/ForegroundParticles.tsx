"use client";

import React, { useRef, useMemo, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "./utils";
import { sharedMouse } from "./sharedState";

// ────────────────────────────────────────────────────────────────────────────────
// Near-camera particles that react to cursor movement
// ────────────────────────────────────────────────────────────────────────────────

interface ForegroundParticlesProps {
  count: number;
  enableCursorInfluence: boolean;
}

const ForegroundParticles: FC<ForegroundParticlesProps> = ({
  count,
  enableCursorInfluence,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { geometry, basePositions } = useMemo(() => {
    const rand = seededRandom(555);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    const particleColors = [
      new THREE.Color("#22d3ee"), // Cyan
      new THREE.Color("#3b82f6"), // Electric blue
      new THREE.Color("#a78bfa"), // Light violet
      new THREE.Color("#67e8f9"), // Light cyan
    ];

    for (let i = 0; i < count; i++) {
      // Spread in a flattened volume near the camera
      const x = (rand() - 0.5) * 20;
      const y = (rand() - 0.5) * 14;
      const z = (rand() - 0.5) * 10 - 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      const color = particleColors[Math.floor(rand() * particleColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geo, basePositions: base };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    [],
  );

  // Cached vector — avoids allocation in useFrame
  const mouseWorld = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    if (enableCursorInfluence) {
      mouseWorld.current.set(
        (sharedMouse.nx * viewport.width) / 2,
        (sharedMouse.ny * viewport.height) / 2,
        0,
      );

      const influenceRadius = 3;
      const influenceRadiusSq = influenceRadius * influenceRadius;
      const pushStrength = 0.15;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        // 2D distance to cursor (Z ignored for perf)
        const dx = bx - mouseWorld.current.x;
        const dy = by - mouseWorld.current.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < influenceRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const factor = (1 - dist / influenceRadius) * pushStrength;
          arr[i3] = bx + (dx / dist) * factor;
          arr[i3 + 1] = by + (dy / dist) * factor;
          arr[i3 + 2] = bz;
        } else {
          // Smoothly return to base position
          arr[i3] += (bx - arr[i3]) * 0.05;
          arr[i3 + 1] += (by - arr[i3 + 1]) * 0.05;
          arr[i3 + 2] += (bz - arr[i3 + 2]) * 0.05;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default ForegroundParticles;
