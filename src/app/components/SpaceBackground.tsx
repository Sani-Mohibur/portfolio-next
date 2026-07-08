"use client";

import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  type FC,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

interface AsteroidData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  rotationSpeed: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

interface MouseTrailPoint {
  position: THREE.Vector3;
  age: number;
}

// ────────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────────

const ASTEROID_COUNT = 18;
const STAR_COUNT = 1800;
const TRAIL_LENGTH = 40;
const TRAIL_DECAY = 2.5;
const PARALLAX_STRENGTH = 0.06;
const LERP_SPEED = 0.04;

// ────────────────────────────────────────────────────────────────────────────────
// Utility: Seeded pseudo-random for deterministic asteroid generation
// ────────────────────────────────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Utility: Create a distorted dodecahedron geometry (low-poly asteroid)
// ────────────────────────────────────────────────────────────────────────────────

function createAsteroidGeometry(seed: number): THREE.BufferGeometry {
  const geo = new THREE.DodecahedronGeometry(1, 1);
  const rand = seededRandom(seed);
  const pos = geo.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i);
    const distortion = 0.7 + rand() * 0.6; // 0.7 → 1.3 range
    vertex.multiplyScalar(distortion);
    pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geo.computeVertexNormals();
  return geo;
}

// ────────────────────────────────────────────────────────────────────────────────
// Procedural Asteroids (instanced for minimal draw calls)
// ────────────────────────────────────────────────────────────────────────────────

const Asteroids: FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate asteroid data deterministically
  const asteroids = useMemo<AsteroidData[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: ASTEROID_COUNT }, () => {
      const orbitRadius = 4 + rand() * 14;
      const angle = rand() * Math.PI * 2;
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * orbitRadius,
          (rand() - 0.5) * 8,
          Math.sin(angle) * orbitRadius
        ),
        rotation: new THREE.Euler(
          rand() * Math.PI * 2,
          rand() * Math.PI * 2,
          rand() * Math.PI * 2
        ),
        scale: 0.15 + rand() * 0.45,
        rotationSpeed: new THREE.Vector3(
          (rand() - 0.5) * 0.3,
          (rand() - 0.5) * 0.3,
          (rand() - 0.5) * 0.2
        ),
        orbitRadius,
        orbitSpeed: (rand() - 0.5) * 0.02,
        orbitOffset: angle,
      };
    });
  }, []);

  // Create multiple geometries for variety, merged into one for instancing
  const geometry = useMemo(() => createAsteroidGeometry(123), []);

  // PBR rocky material with procedural color baked into per-instance color
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.92,
        metalness: 0.08,
        flatShading: true,
      }),
    []
  );

  // Set per-instance colors on mount
  useEffect(() => {
    if (!meshRef.current) return;
    const rand = seededRandom(99);
    const color = new THREE.Color();
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      // Dark rocky tones with subtle warm/cool variation
      const hue = 0.05 + rand() * 0.08; // Warm brown range
      const sat = 0.05 + rand() * 0.15;
      const light = 0.08 + rand() * 0.12;
      color.setHSL(hue, sat, light);
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05); // Guard against tab-switch spikes

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const a = asteroids[i];

      // Slow orbit
      a.orbitOffset += a.orbitSpeed * clampedDelta;
      dummy.position.set(
        Math.cos(a.orbitOffset) * a.orbitRadius,
        a.position.y + Math.sin(a.orbitOffset * 0.7) * 0.3,
        Math.sin(a.orbitOffset) * a.orbitRadius
      );

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
      args={[geometry, material, ASTEROID_COUNT]}
      frustumCulled={false}
    />
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Animated Point-Cloud Starfield
// ────────────────────────────────────────────────────────────────────────────────

const Starfield: FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes, basePositions } = useMemo(() => {
    const rand = seededRandom(777);
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const base = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 20 + rand() * 40;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      sz[i] = 0.5 + rand() * 2.0;
    }

    return { positions: pos, sizes: sz, basePositions: base };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xdde4f0,
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    // Subtle twinkling via slight positional oscillation
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const offset = i * 0.01;
      arr[i3] = basePositions[i3] + Math.sin(t + offset) * 0.02;
      arr[i3 + 1] =
        basePositions[i3 + 1] + Math.cos(t * 1.3 + offset) * 0.02;
    }
    posAttr.needsUpdate = true;

    // Slow global rotation
    pointsRef.current.rotation.y = t * 0.05;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

// ────────────────────────────────────────────────────────────────────────────────
// Glowing Mouse-Trail Ribbon
// ────────────────────────────────────────────────────────────────────────────────

const MouseTrail: FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  const trail = useRef<MouseTrailPoint[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      age: TRAIL_DECAY + 1,
    }))
  );

  const mouseWorld = useRef(new THREE.Vector3());
  const prevMouse = useRef(new THREE.Vector2(0, 0));

  // Listen to pointer moves (on window, since canvas is pointer-events-none)
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      // Normalize to [-1, 1]
      prevMouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  // Ribbon geometry built each frame
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // 2 vertices per trail point (top & bottom of ribbon)
    const vertexCount = TRAIL_LENGTH * 2;
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
    );
    geo.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2)
    );
    // Build indices for triangle strip → triangles
    const indices: number[] = [];
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
    geo.setIndex(indices);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.3, 0.6, 1.0),
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Project mouse to world space at z = 0
    const m = prevMouse.current;
    mouseWorld.current.set(
      (m.x * viewport.width) / 2,
      (m.y * viewport.height) / 2,
      0
    );

    // Unshift a new point at the head, shift out the tail
    const pts = trail.current;
    for (let i = pts.length - 1; i > 0; i--) {
      pts[i].position.copy(pts[i - 1].position);
      pts[i].age = pts[i - 1].age + clampedDelta;
    }
    pts[0].position.lerp(mouseWorld.current, 0.35);
    pts[0].age = 0;

    // Rebuild ribbon geometry
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const uvAttr = geometry.attributes.uv as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const uvArr = uvAttr.array as Float32Array;

    const up = new THREE.Vector3(0, 0, 1);
    const dir = new THREE.Vector3();

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const t = i / (TRAIL_LENGTH - 1); // 0 → 1
      const alpha = Math.max(0, 1 - pts[i].age / TRAIL_DECAY);
      const width = 0.12 * alpha * (1 - t * 0.7); // Taper toward tail

      // Direction
      if (i < TRAIL_LENGTH - 1) {
        dir.subVectors(pts[i].position, pts[i + 1].position).normalize();
      }
      const perp = new THREE.Vector3()
        .crossVectors(dir, up)
        .normalize()
        .multiplyScalar(width);

      const p = pts[i].position;
      const idx = i * 2;

      posArr[idx * 3] = p.x + perp.x;
      posArr[idx * 3 + 1] = p.y + perp.y;
      posArr[idx * 3 + 2] = p.z + perp.z;

      posArr[(idx + 1) * 3] = p.x - perp.x;
      posArr[(idx + 1) * 3 + 1] = p.y - perp.y;
      posArr[(idx + 1) * 3 + 2] = p.z - perp.z;

      uvArr[idx * 2] = t;
      uvArr[idx * 2 + 1] = 0;
      uvArr[(idx + 1) * 2] = t;
      uvArr[(idx + 1) * 2 + 1] = 1;
    }

    posAttr.needsUpdate = true;
    uvAttr.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
};

// ────────────────────────────────────────────────────────────────────────────────
// Mouse Parallax Camera Rig
// ────────────────────────────────────────────────────────────────────────────────

const CameraRig: FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    target.current.x +=
      (mouse.current.x - target.current.x) * LERP_SPEED;
    target.current.y +=
      (mouse.current.y - target.current.y) * LERP_SPEED;

    groupRef.current.rotation.y =
      -target.current.x * PARALLAX_STRENGTH;
    groupRef.current.rotation.x =
      target.current.y * PARALLAX_STRENGTH * 0.5;
  });

  return (
    <group ref={groupRef}>
      <Asteroids />
      <Starfield />
    </group>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Lightweight CSS Fallback (prefers-reduced-motion / low-end)
// ────────────────────────────────────────────────────────────────────────────────

const StaticFallback: FC = () => (
  <div
    aria-hidden="true"
    style={{
      position: "fixed",
      inset: 0,
      zIndex: -10,
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at 50% 40%, #0f172a 0%, #020617 50%, #000000 100%)",
      overflow: "hidden",
    }}
  >
    {/* CSS-only static stars */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.7), transparent),
          radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1.5px 1.5px at 20% 90%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1px 1px at 40% 40%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1.5px 1.5px at 60% 70%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.4), transparent)
        `,
      }}
    />
  </div>
);

// ────────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────────

const SpaceBackground: FC = () => {
  const [shouldRender3D, setShouldRender3D] = useState(false);

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
            "radial-gradient(ellipse at 50% 40%, #0f172a 0%, #020617 50%, #000000 100%)",
        }}
        // The canvas itself should not capture pointer events
        // (the wrapper div is pointer-events-none, but R3F needs
        //  events disabled at the Canvas level too)
        events={undefined as never}
      >
        {/* Minimal ambient + single directional for PBR asteroids */}
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.6}
          color="#b4c6e7"
        />
        <directionalLight
          position={[-4, -2, -6]}
          intensity={0.2}
          color="#4a3f6b"
        />

        {/* Scene content under parallax rig */}
        <CameraRig />

        {/* Mouse trail is in screen space, not affected by parallax */}
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
