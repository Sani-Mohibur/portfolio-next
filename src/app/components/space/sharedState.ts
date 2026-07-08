// ────────────────────────────────────────────────────────────────────────────────
// Module-level mutable state for cross-component communication
// without React re-renders.  Read in useFrame loops only.
// ────────────────────────────────────────────────────────────────────────────────

/** Pointer position — updated by InputListeners, consumed by all scene components */
export const sharedMouse = {
  /** Normalized device coordinates  −1 → +1 */
  nx: 0,
  ny: 0,
  /** Screen-space center-relative  −1 → +1  (same as old CameraRig mouse) */
  sx: 0,
  sy: 0,
};

/** Scroll progress 0 → 1  (top → bottom of page) */
export const sharedScroll = {
  progress: 0,
};
