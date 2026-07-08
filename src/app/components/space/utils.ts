import * as THREE from "three";
import type { ObjectData } from "./types";

// ────────────────────────────────────────────────────────────────────────────────
// Seeded PRNG — deterministic visuals across renders
// ────────────────────────────────────────────────────────────────────────────────

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Distorted dodecahedron geometry for asteroids
// ────────────────────────────────────────────────────────────────────────────────

export function createAsteroidGeometry(seed: number): THREE.BufferGeometry {
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
// Shared object data generator for futuristic objects
// ────────────────────────────────────────────────────────────────────────────────

export function generateObjectData(count: number, seed: number): ObjectData[] {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => {
    const orbitRadius = 5 + rand() * 12;
    const angle = rand() * Math.PI * 2;
    return {
      position: new THREE.Vector3(
        Math.cos(angle) * orbitRadius,
        (rand() - 0.5) * 10,
        Math.sin(angle) * orbitRadius,
      ),
      rotation: new THREE.Euler(
        rand() * Math.PI * 2,
        rand() * Math.PI * 2,
        rand() * Math.PI * 2,
      ),
      scale: 0.2 + rand() * 0.4,
      rotationSpeed: new THREE.Vector3(
        (rand() - 0.5) * 0.4,
        (rand() - 0.5) * 0.4,
        (rand() - 0.5) * 0.3,
      ),
      orbitRadius,
      orbitSpeed: (rand() - 0.5) * 0.015,
      orbitOffset: angle,
    };
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// Shared instanced-mesh update loop — avoids duplication across object types
// ────────────────────────────────────────────────────────────────────────────────

export function updateInstances(
  mesh: THREE.InstancedMesh,
  objects: ObjectData[],
  dummy: THREE.Object3D,
  delta: number,
  enableCursorInfluence: boolean,
  mouseNx: number,
  mouseNy: number,
): void {
  const clampedDelta = Math.min(delta, 0.05);

  for (let i = 0; i < objects.length; i++) {
    const o = objects[i];

    o.orbitOffset += o.orbitSpeed * clampedDelta;
    dummy.position.set(
      Math.cos(o.orbitOffset) * o.orbitRadius,
      o.position.y + Math.sin(o.orbitOffset * 0.5) * 0.5,
      Math.sin(o.orbitOffset) * o.orbitRadius,
    );

    // Cursor influence — gently push nearby objects
    if (enableCursorInfluence) {
      const mouseX = mouseNx * 8;
      const mouseY = mouseNy * 5;
      const dx = dummy.position.x - mouseX;
      const dy = dummy.position.y - mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 25 && distSq > 0.1) {
        const dist = Math.sqrt(distSq);
        const push = (1 - dist / 5) * 0.2;
        dummy.position.x += (dx / dist) * push;
        dummy.position.y += (dy / dist) * push;
      }
    }

    o.rotation.x += o.rotationSpeed.x * clampedDelta;
    o.rotation.y += o.rotationSpeed.y * clampedDelta;
    o.rotation.z += o.rotationSpeed.z * clampedDelta;
    dummy.rotation.copy(o.rotation);

    dummy.scale.setScalar(o.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
