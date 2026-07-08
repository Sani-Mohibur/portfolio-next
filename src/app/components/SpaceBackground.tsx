"use client";

import React, { useState, useEffect, type FC } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";
import { useQualityTier } from "./space/useQualityTier";
import { QUALITY_CONFIGS } from "./space/constants";
import { sharedMouse, sharedScroll } from "./space/sharedState";

// Scene components
import CameraRig from "./space/CameraRig";
import DistantStars from "./space/DistantStars";
import CosmicDust from "./space/CosmicDust";
import ForegroundParticles from "./space/ForegroundParticles";
import Nebula from "./space/Nebula";
import Asteroids from "./space/Asteroids";
import FuturisticObjects from "./space/FuturisticObjects";
import MouseTrail from "./space/MouseTrail";
import OrbitalLights from "./space/OrbitalLights";
import StaticFallback from "./space/StaticFallback";

// ────────────────────────────────────────────────────────────────────────────────
// InputListeners — single component that writes mouse + scroll to sharedState
// Lives inside the Canvas tree but renders nothing.
// ────────────────────────────────────────────────────────────────────────────────

const InputListeners: FC = () => {
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      sharedMouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      sharedMouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      sharedMouse.sx = (e.clientX / window.innerWidth - 0.5) * 2;
      sharedMouse.sy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        sharedScroll.progress =
          maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial read
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
};

// ────────────────────────────────────────────────────────────────────────────────
// Main SpaceBackground — orchestrates all layers
// ────────────────────────────────────────────────────────────────────────────────

const SpaceBackground: FC = () => {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const qualityTier = useQualityTier();
  const config = QUALITY_CONFIGS[qualityTier];

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setShouldRender3D(false);
      return;
    }

    // Basic capability check: WebGL2 support + reasonable device
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setShouldRender3D(false);
        return;
      }

      // Check hardware concurrency as a rough low-end proxy
      const cores = navigator.hardwareConcurrency ?? 4;
      if (cores < 2) {
        setShouldRender3D(false);
        return;
      }

      setShouldRender3D(true);
    } catch {
      setShouldRender3D(false);
    }
  }, []);

  if (!shouldRender3D) {
    return <StaticFallback />;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 100 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, #0a0e27 0%, #020617 50%, #000000 100%)",
        }}
        // Canvas itself should not capture pointer events
        events={undefined as never}
      >
        {/* Unified input listeners (mouse + scroll → sharedState) */}
        <InputListeners />

        {/* Lighting */}
        <ambientLight intensity={0.12} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.5}
          color="#b4c6e7"
        />
        <directionalLight
          position={[-4, -2, -6]}
          intensity={0.2}
          color="#4a3f6b"
        />
        <OrbitalLights count={config.orbitalLights} />

        {/* Scene content under parallax + scroll rig */}
        <CameraRig>
          <DistantStars count={config.distantStars} />
          <Nebula planeCount={config.nebulaPlanes} />
          {config.cosmicDust > 0 && (
            <CosmicDust count={config.cosmicDust} />
          )}
          <Asteroids
            count={config.asteroids}
            enableCursorInfluence={config.enableCursorInfluence}
          />
          <FuturisticObjects
            count={config.futuristicObjects}
            enableCursorInfluence={config.enableCursorInfluence}
          />
          {config.foregroundParticles > 0 && (
            <ForegroundParticles
              count={config.foregroundParticles}
              enableCursorInfluence={config.enableCursorInfluence}
            />
          )}
        </CameraRig>

        {/* Mouse trail — screen space, not affected by parallax */}
        <MouseTrail />

        {/* Performance helpers */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
