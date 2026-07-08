"use client";

import React, { useRef, useMemo, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "./utils";

// ────────────────────────────────────────────────────────────────────────────────
// Mid-layer colored dust particles — electric blue / violet / cyan tones
// ────────────────────────────────────────────────────────────────────────────────

interface CosmicDustProps {
  count: number;
}

const CosmicDust: FC<CosmicDustProps> = ({ count }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rand = seededRandom(333);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const dustColors = [
      new THREE.Color("#3b82f6"), // Electric blue
      new THREE.Color("#8b5cf6"), // Violet
      new THREE.Color("#22d3ee"), // Cyan
      new THREE.Color("#6366f1"), // Indigo
      new THREE.Color("#a78bfa"), // Light violet
    ];

    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 10 + rand() * 25; // Mid shell: radius 10–35

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Dimmed to stay subtle
      const color = dustColors[Math.floor(rand() * dustColors.length)];
      colors[i * 3] = color.r * 0.5;
      colors[i * 3 + 1] = color.g * 0.5;
      colors[i * 3 + 2] = color.b * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.04,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.z = t * 0.15;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default CosmicDust;
