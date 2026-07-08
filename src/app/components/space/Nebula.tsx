"use client";

import React, { useMemo, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Animated nebula atmosphere — shader planes with simplex noise
// ────────────────────────────────────────────────────────────────────────────────

interface NebulaProps {
  planeCount: number;
}

// ─── GLSL: Compact 2D simplex noise + fBm ────────────────────────────────────

const NOISE_GLSL = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
   -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x  + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
`;

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform float uOpacity;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Animated noise layers
  float n1 = fbm(uv * 2.0 + uTime * 0.05);
  float n2 = fbm(uv * 3.0 - uTime * 0.03 + 10.0);

  // Color mixing
  vec3 color = mix(uColor1, uColor2, smoothstep(-0.3, 0.3, n1));
  color = mix(color, uColor3, smoothstep(0.0, 0.6, n2) * 0.5);

  // Soft edge fade
  float edgeFade = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x)
                 * smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);

  float alpha = (n1 * 0.5 + 0.5) * (n2 * 0.3 + 0.5) * edgeFade * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`;

// ─── Per-plane configuration ────────────────────────────────────────────────

interface NebulaPlaneConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  opacity: number;
  color1: THREE.Color;
  color2: THREE.Color;
  color3: THREE.Color;
}

const ALL_CONFIGS: NebulaPlaneConfig[] = [
  {
    position: [-8, 2, -25],
    rotation: [0.1, 0.3, 0.05],
    scale: [30, 20, 1],
    opacity: 0.08,
    color1: new THREE.Color("#0a0e27"),
    color2: new THREE.Color("#1e1b4b"),
    color3: new THREE.Color("#3b82f6"),
  },
  {
    position: [10, -3, -20],
    rotation: [-0.1, -0.2, 0.1],
    scale: [25, 18, 1],
    opacity: 0.06,
    color1: new THREE.Color("#1e1b4b"),
    color2: new THREE.Color("#4a1d96"),
    color3: new THREE.Color("#8b5cf6"),
  },
  {
    position: [0, 5, -30],
    rotation: [0.2, 0.0, -0.1],
    scale: [35, 22, 1],
    opacity: 0.05,
    color1: new THREE.Color("#0f172a"),
    color2: new THREE.Color("#164e63"),
    color3: new THREE.Color("#22d3ee"),
  },
];

// ─── Single nebula plane with its own shader material ───────────────────────

const NebulaPlane: FC<{ config: NebulaPlaneConfig; index: number }> = ({
  config,
  index,
}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: config.opacity },
          uColor1: { value: config.color1 },
          uColor2: { value: config.color2 },
          uColor3: { value: config.color3 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [config],
  );

  // Animate time uniform — offset per plane so they don't sync
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime() + index * 100;
  });

  return (
    <mesh position={config.position} rotation={config.rotation} scale={config.scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// ─── Nebula container ───────────────────────────────────────────────────────

const Nebula: FC<NebulaProps> = ({ planeCount }) => {
  const configs = useMemo(
    () => ALL_CONFIGS.slice(0, planeCount),
    [planeCount],
  );

  return (
    <>
      {configs.map((config, i) => (
        <NebulaPlane key={i} config={config} index={i} />
      ))}
    </>
  );
};

export default Nebula;
