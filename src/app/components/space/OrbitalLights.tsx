"use client";

import React, { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Dynamic orbiting point lights — creates shimmer on metallic/emissive surfaces
// ────────────────────────────────────────────────────────────────────────────────

interface OrbitalLightsProps {
  count: number;
}

const OrbitalLights: FC<OrbitalLightsProps> = ({ count }) => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (light1Ref.current) {
      const r1 = 12;
      const s1 = 0.15;
      light1Ref.current.position.set(
        Math.cos(t * s1) * r1,
        Math.sin(t * s1 * 0.7) * 4,
        Math.sin(t * s1) * r1,
      );
    }

    if (light2Ref.current) {
      const r2 = 10;
      const s2 = 0.1;
      light2Ref.current.position.set(
        Math.cos(t * s2 + Math.PI) * r2,
        Math.sin(t * s2 * 0.5 + 1) * 3,
        Math.sin(t * s2 + Math.PI) * r2,
      );
    }
  });

  if (count === 0) return null;

  return (
    <>
      <pointLight
        ref={light1Ref}
        color="#4f7df7"
        intensity={0.4}
        distance={30}
        decay={2}
      />
      {count >= 2 && (
        <pointLight
          ref={light2Ref}
          color="#8b5cf6"
          intensity={0.3}
          distance={25}
          decay={2}
        />
      )}
    </>
  );
};

export default OrbitalLights;
