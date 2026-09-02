"use client";

import { HeroShell } from "./HeroShell";
import { Starfield } from "./Starfield";

export interface HeroStarfieldProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: fraction of cells carrying a star (0..1). */
  density?: number;
  /** Shader: drift and twinkle speed. */
  speed?: number;
  /** Shader: twinkle strength (0..1). */
  twinkle?: number;
  /** Shader: star color. */
  color?: string;
}

/** Bottom-left copy under a twinkling hashed star grid — the space-tech staple. */
export function HeroStarfield({
  eyebrow = "Built for scale",
  title = "Reach for the stars. Ship tonight.",
  subtitle = "A hashed star grid with twinkle and slow parallax drift — depth you can feel, rendered entirely on the GPU.",
  primaryCta = "Deploy now",
  secondaryCta = "Read the story",
  scheme = "dark",
  density = 0.35,
  speed = 1,
  twinkle = 0.8,
  color = "#d0e4ff",
}: HeroStarfieldProps) {
  return (
    <HeroShell
      layout="left"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent={color}
      background={<Starfield density={density} speed={speed} twinkle={twinkle} color={color} />}
    />
  );
}

export const HERO_STARFIELD_PRESETS = {
  classic: { color: "#d0e4ff", density: 0.35, twinkle: 0.8 },
  deep: { color: "#c7d2fe", density: 0.5, twinkle: 0.6, speed: 0.7 },
  warm: { color: "#fde68a", density: 0.3, twinkle: 0.9, speed: 1.2 },
};
