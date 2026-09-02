"use client";

import { HeroShell } from "./HeroShell";
import { BlackHole } from "./BlackHole";

export interface HeroBlackHoleProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  badges?: readonly string[];
  scheme?: "dark" | "light";
  /** Pipeline: disk evolution speed. */
  speed?: number;
  /** Pipeline: camera orbit radius (horizon units). */
  distance?: number;
  /** Pipeline: outer disk radius (horizon units). */
  diskRadius?: number;
  /** Pipeline: camera elevation in radians. */
  tilt?: number;
  /** Pipeline: disk emission gain. */
  brightness?: number;
  /** Pipeline: Doppler beaming exponent. */
  doppler?: number;
  /** Pipeline: star tint spread. */
  stars?: number;
  /** Pipeline: horizontal framing of the hole, NDC -1..1. */
  centerX?: number;
  /** Pipeline: vertical framing of the hole, NDC -1..1. */
  centerY?: number;
}

/**
 * Left-copy hero over the real vgpu optimized-black-hole pipeline — the
 * baked geodesic G-buffer, HDR bloom, and prefiltered lensed star field as a
 * landing-page backdrop. The hole sits right of center (centerX 0.45) so the
 * scrim never slices the shadow; the Doppler-brightened approaching side
 * lands beside the headline.
 */
export function HeroBlackHole({
  eyebrow = "Event horizon",
  title = "Gravity does\nthe layout.",
  subtitle = "A ray-traced accretion disk with relativistic beaming, lensed star field, and a shadow that swallows everything behind your copy. Physics, not video.",
  primaryCta = "Start building",
  secondaryCta = "How it works",
  badges,
  scheme = "dark",
  speed = 0.75,
  distance = 13.5,
  diskRadius = 9,
  tilt = 0.16,
  brightness = 0.75,
  doppler = 1.21,
  stars = 0.5,
  centerX = 0.45,
  centerY = 0.12,
}: HeroBlackHoleProps) {
  return (
    <HeroShell
      layout="left"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      badges={badges}
      accent="#fbbf24"
      background={
        <BlackHole
          speed={speed}
          distance={distance}
          diskRadius={diskRadius}
          tilt={tilt}
          brightness={brightness}
          doppler={doppler}
          stars={stars}
          centerX={centerX}
          centerY={centerY}
        />
      }
    />
  );
}

export const HERO_BLACK_HOLE_PRESETS = {
  interstellar: { speed: 0.75, distance: 13.5, diskRadius: 9, tilt: 0.16, brightness: 0.75, doppler: 1.21 },
  gargantua: { speed: 0.75, distance: 11.5, diskRadius: 11, tilt: 0.05, brightness: 0.85, doppler: 1.45, centerX: 0.4 },
  ember: { speed: 0.85, distance: 12.5, diskRadius: 10, tilt: 0.22, brightness: 1.05, doppler: 1.8, stars: 0.3 },
};
