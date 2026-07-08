"use client";

import React, { type FC } from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Lightweight CSS-only fallback for prefers-reduced-motion / low-end devices
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

export default StaticFallback;
