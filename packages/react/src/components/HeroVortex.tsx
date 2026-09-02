"use client";

import { HeroShell } from "./HeroShell";
import { Vortex } from "./Vortex";

export interface HeroVortexProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: spiral tightness. */
  swirl?: number;
  /** Shader: spiral arms. */
  arms?: number;
  /** Shader: core glow. */
  coreGlow?: number;
  /** Shader: dust/arm color. */
  color?: string;
  /** Shader: core/emission color. */
  emission?: string;
}

/** Centered headline at the eye of a spiral galaxy. */
export function HeroVortex({
  eyebrow = "Deep tech",
  title = "Pull users into orbit.",
  subtitle = "A spiral galaxy with star speckles and trailing arms, swirling behind your headline. The core glow doubles as a spotlight for your copy.",
  primaryCta = "Launch console",
  secondaryCta = "Learn more",
  scheme = "dark",
  speed = 0.5,
  swirl = 2.4,
  arms = 2,
  coreGlow = 1.2,
  color = "#818cf8",
  emission = "#e0e7ff",
}: HeroVortexProps) {
  return (
    <HeroShell
      layout="centered"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent={emission}
      background={<Vortex speed={speed} swirl={swirl} arms={arms} coreGlow={coreGlow} color={color} emission={emission} />}
    />
  );
}

export const HERO_VORTEX_PRESETS = {
  indigo: { color: "#818cf8", emission: "#e0e7ff" },
  sol: { color: "#fbbf24", emission: "#fef3c7", arms: 3, swirl: 2.8 },
  nebula: { color: "#f472b6", emission: "#fbcfe8", coreGlow: 1.5, speed: 0.4 },
};
