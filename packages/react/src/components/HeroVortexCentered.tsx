"use client";

import { HeroShell, resolveHeroCta, type HeroContentProps } from "./HeroShell";
import { Vortex } from "./Vortex";

export interface HeroVortexCenteredProps extends HeroContentProps {
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: spiral tightness. */
  swirl?: number;
  /** Shader: spiral arms. */
  arms?: number;
  /** Shader: core glow — the "eye" that spotlights the headline. */
  coreGlow?: number;
  /** Shader: dust/arm color. */
  color?: string;
  /** Shader: core/emission color. */
  emission?: string;
}

/**
 * The eye-of-the-storm cut of HeroVortex: a tighter, slower spiral whose
 * bright core lands exactly behind a centered, short headline. The centered
 * radial scrim carves a calm reading pocket out of the arms.
 */
export function HeroVortexCentered({
  eyebrow = "Eye of the storm",
  title = "Calm at the\ncenter.",
  subtitle = "A tight spiral galaxy, slowed to a breath, with your headline sitting in the still eye where the arms never reach.",
  primaryCta = "Step inside",
  secondaryCta = "See the physics",
  scheme = "dark",
  speed = 0.35,
  swirl = 3.4,
  arms = 3,
  coreGlow = 1.7,
  color = "#6366f1",
  emission = "#e0f2fe",
  interactive = false,
  fallback,
  ...shellProps
}: HeroVortexCenteredProps) {
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={resolveHeroCta(primaryCta)}
      secondaryCta={resolveHeroCta(secondaryCta)}
      accent={emission}
      background={<Vortex interactive={interactive} fallback={fallback} speed={speed} swirl={swirl} arms={arms} coreGlow={coreGlow} color={color} emission={emission} />}
    />
  );
}

export const HERO_VORTEX_CENTERED_PRESETS = {
  eye: { color: "#6366f1", emission: "#e0f2fe", swirl: 3.4, arms: 3, speed: 0.35 },
  storm: { color: "#334155", emission: "#bae6fd", swirl: 4.2, arms: 5, coreGlow: 1.9, speed: 0.28 },
  pinwheel: { color: "#f472b6", emission: "#fde68a", swirl: 2.9, arms: 6, speed: 0.5 },
};
