"use client";

import React, { useRef, useMemo, useEffect, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom, generateObjectData, updateInstances } from "./utils";
import { sharedMouse } from "./sharedState";

// ────────────────────────────────────────────────────────────────────────────────
// Futuristic geometric objects — wireframes, holographic rings, glass shapes
// Each type uses its own InstancedMesh for minimal draw calls per type.
// ────────────────────────────────────────────────────────────────────────────────

interface FuturisticObjectsProps {
  count: number;
  enableCursorInfluence: boolean;
}

const FuturisticObjects: FC<FuturisticObjectsProps> = ({
  count,
  enableCursorInfluence,
}) => {
  // Split total count across 3 object types
  const wireframeCount = Math.ceil(count * 0.35);
  const ringCount = Math.ceil(count * 0.35);
  const glassCount = Math.max(1, count - wireframeCount - ringCount);

  return (
    <>
      <WireframeObjects
        count={wireframeCount}
        enableCursorInfluence={enableCursorInfluence}
        seed={200}
      />
      <HolographicRings
        count={ringCount}
        enableCursorInfluence={enableCursorInfluence}
        seed={300}
      />
      <GlassShapes
        count={glassCount}
        enableCursorInfluence={enableCursorInfluence}
        seed={400}
      />
    </>
  );
};

// ─── Wireframe Icosahedrons ────────────────────────────────────────────────

const WireframeObjects: FC<{
  count: number;
  enableCursorInfluence: boolean;
  seed: number;
}> = ({ count, enableCursorInfluence, seed }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const objects = useMemo(() => generateObjectData(count, seed), [count, seed]);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#3b82f6"),
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    updateInstances(
      meshRef.current,
      objects,
      dummy,
      delta,
      enableCursorInfluence,
      sharedMouse.nx,
      sharedMouse.ny,
    );
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
};

// ─── Holographic Rings ──────────────────────────────────────────────────────

const HolographicRings: FC<{
  count: number;
  enableCursorInfluence: boolean;
  seed: number;
}> = ({ count, enableCursorInfluence, seed }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const objects = useMemo(() => generateObjectData(count, seed), [count, seed]);

  const geometry = useMemo(
    () => new THREE.TorusGeometry(1, 0.02, 8, 32),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8b5cf6"),
        emissive: new THREE.Color("#8b5cf6"),
        emissiveIntensity: 0.4,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    updateInstances(
      meshRef.current,
      objects,
      dummy,
      delta,
      enableCursorInfluence,
      sharedMouse.nx,
      sharedMouse.ny,
    );
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
};

// ─── Glass Octahedrons ──────────────────────────────────────────────────────

const GlassShapes: FC<{
  count: number;
  enableCursorInfluence: boolean;
  seed: number;
}> = ({ count, enableCursorInfluence, seed }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const objects = useMemo(() => generateObjectData(count, seed), [count, seed]);

  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);

  // Emissive glass look without expensive transmission pass
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a1628"),
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.05,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      }),
    [],
  );

  // Per-instance tinted colors
  useEffect(() => {
    if (!meshRef.current) return;
    const rand = seededRandom(seed + 50);
    const color = new THREE.Color();
    const tints = ["#22d3ee", "#3b82f6", "#8b5cf6", "#a78bfa"];
    for (let i = 0; i < count; i++) {
      color.set(tints[Math.floor(rand() * tints.length)]);
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, seed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    updateInstances(
      meshRef.current,
      objects,
      dummy,
      delta,
      enableCursorInfluence,
      sharedMouse.nx,
      sharedMouse.ny,
    );
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
};

export default FuturisticObjects;
