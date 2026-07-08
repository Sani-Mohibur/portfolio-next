"use client";

import React, { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharedMouse, sharedScroll } from "./sharedState";
import { PARALLAX_STRENGTH, LERP_SPEED } from "./constants";

// ────────────────────────────────────────────────────────────────────────────────
// Camera rig — mouse parallax + scroll-based camera drift
// ────────────────────────────────────────────────────────────────────────────────

interface CameraRigProps {
  children: React.ReactNode;
}

const CameraRig: FC<CameraRigProps> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const scrollTarget = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth mouse parallax (reads from sharedState, no event listener needed)
    target.current.x += (sharedMouse.sx - target.current.x) * LERP_SPEED;
    target.current.y += (sharedMouse.sy - target.current.y) * LERP_SPEED;

    // Smooth scroll interpolation
    scrollTarget.current +=
      (sharedScroll.progress - scrollTarget.current) * 0.03;

    // Apply parallax rotation
    groupRef.current.rotation.y = -target.current.x * PARALLAX_STRENGTH;
    groupRef.current.rotation.x = target.current.y * PARALLAX_STRENGTH * 0.5;

    // Scroll-based drift: camera moves forward and slightly rotates
    groupRef.current.position.z = -scrollTarget.current * 8;
    groupRef.current.rotation.y += scrollTarget.current * 0.15;
  });

  return <group ref={groupRef}>{children}</group>;
};

export default CameraRig;
