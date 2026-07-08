"use client";

import React, { useRef, useMemo, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sharedMouse } from "./sharedState";
import { TRAIL_LENGTH, TRAIL_DECAY } from "./constants";
import type { MouseTrailPoint } from "./types";

// ────────────────────────────────────────────────────────────────────────────────
// Gradient mouse-trail ribbon — cyan head → violet tail
// All vectors cached outside useFrame to avoid GC pressure.
// ────────────────────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColorHead;
uniform vec3 uColorTail;

void main() {
  float t = vUv.x;                             // 0 at head, 1 at tail
  vec3  color = mix(uColorHead, uColorTail, t);
  float alpha = (1.0 - t) * 0.5;
  gl_FragColor = vec4(color, alpha);
}
`;

const MouseTrail: FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const trail = useRef<MouseTrailPoint[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      age: TRAIL_DECAY + 1,
    })),
  );

  // Cached vectors
  const _mouseWorld = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const _up = useRef(new THREE.Vector3(0, 0, 1));
  const _perp = useRef(new THREE.Vector3());

  // Ribbon geometry — 2 vertices per trail point
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertexCount = TRAIL_LENGTH * 2;
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3),
    );
    geo.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2),
    );
    // Triangle strip → triangles
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

  // Gradient shader material
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uColorHead: { value: new THREE.Color("#22d3ee") },
          uColorTail: { value: new THREE.Color("#8b5cf6") },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Project mouse to world space at z = 0
    _mouseWorld.current.set(
      (sharedMouse.nx * viewport.width) / 2,
      (sharedMouse.ny * viewport.height) / 2,
      0,
    );

    // Shift trail points
    const pts = trail.current;
    for (let i = pts.length - 1; i > 0; i--) {
      pts[i].position.copy(pts[i - 1].position);
      pts[i].age = pts[i - 1].age + clampedDelta;
    }
    pts[0].position.lerp(_mouseWorld.current, 0.35);
    pts[0].age = 0;

    // Rebuild ribbon geometry
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const uvAttr = geometry.attributes.uv as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const uvArr = uvAttr.array as Float32Array;

    const dir = _dir.current;
    const up = _up.current;
    const perp = _perp.current;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const t = i / (TRAIL_LENGTH - 1); // 0 → 1
      const alpha = Math.max(0, 1 - pts[i].age / TRAIL_DECAY);
      const width = 0.15 * alpha * (1 - t * 0.7); // Taper toward tail

      if (i < TRAIL_LENGTH - 1) {
        dir.subVectors(pts[i].position, pts[i + 1].position).normalize();
      }
      perp.crossVectors(dir, up).normalize().multiplyScalar(width);

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

export default MouseTrail;
