"use client";

import { HeroShell, resolveHeroCta, type HeroContentProps } from "./HeroShell";
import { ParticleField } from "./ParticleField";

export interface HeroParticlesProps extends HeroContentProps {
  badges?: readonly string[];
  scheme?: "dark" | "light";
  /** Shader: fraction of cells carrying a particle (0..1). */
  density?: number;
  /** Shader: drift/wander/breathing speed. */
  speed?: number;
  /** Shader: particle radius relative to its cell. */
  size?: number;
  /** Shader: particle color. */
  color?: string;
}

/** Top-weighted headline with a badge row over a drifting particle field. */
export function HeroParticles({
  eyebrow = "Community edition",
  title = "Where your users gather.",
  subtitle = "Cell-hashed particles with drift and size breathing, computed on the GPU. A calm, confident field for a product that speaks for itself.",
  primaryCta = "Join free",
  secondaryCta = "See features",
  badges = ["12k teams", "Open source", "Self-hostable"],
  scheme = "dark",
  density = 0.45,
  speed = 0.8,
  size = 0.16,
  color = "#9ccaff",
  interactive = false,
  fallback,
  ...shellProps
}: HeroParticlesProps) {
  return (
    <HeroShell
      {...shellProps}
      layout="stacked"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={resolveHeroCta(primaryCta)}
      secondaryCta={resolveHeroCta(secondaryCta)}
      badges={badges}
      accent={color}
      background={<ParticleField interactive={interactive} fallback={fallback} density={density} speed={speed} size={size} color={color} />}
    />
  );
}

export const HERO_PARTICLES_PRESETS = {
  azure: { color: "#9ccaff", density: 0.45 },
  mint: { color: "#6ee7b7", density: 0.4, size: 0.18 },
  dune: { color: "#fcd34d", density: 0.5, speed: 0.6 },
};
