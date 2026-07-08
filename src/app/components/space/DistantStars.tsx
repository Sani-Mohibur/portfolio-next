"use client";

import React, { useRef, useMemo, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "./utils";

// ────────────────────────────────────────────────────────────────────────────────
// Far-shell starfield — colored, GPU-rotated only (no per-vertex loop)
// ────────────────────────────────────────────────────────────────────────────────

interface DistantStarsProps {
  count: number;
}

const DistantStars: FC<DistantStarsProps> = ({ count }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rand = seededRandom(777);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorOptions = [
      new THREE.Color("#dde4f0"), // Cool white
      new THREE.Color("#a5b4fc"), // Soft indigo
      new THREE.Color("#c4b5fd"), // Soft violet
      new THREE.Color("#67e8f9"), // Cyan tint
      new THREE.Color("#ffffff"), // Pure white
    ];

    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 50 + rand() * 40; // Far shell: radius 50–90

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = colorOptions[Math.floor(rand() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    [],
  );

  // Slow global rotation only — no per-vertex animation (GPU does the work)
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.008;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.x = t * 0.3;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default DistantStars;
