"use client";

import { useState, useEffect } from "react";
import type { QualityTier } from "./types";

/**
 * Detects device capability and returns a quality tier.
 * Runs once on mount — the tier never changes during a session.
 */
export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>("medium");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(
      navigator.userAgent,
    );
    const memory =
      (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;

    if (isMobile || cores < 4 || memory < 4) {
      setTier("low");
    } else if (cores >= 8 && memory >= 8) {
      setTier("high");
    } else {
      setTier("medium");
    }
  }, []);

  return tier;
}
