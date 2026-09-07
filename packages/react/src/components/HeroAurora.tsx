"use client";

import { HeroShell, resolveHeroCta, type HeroContentProps } from "./HeroShell";
import { Aurora } from "./Aurora";

export interface HeroAuroraProps extends HeroContentProps {
  scheme?: "dark" | "light";
  /** Shader: animation speed multiplier. */
  speed?: number;
  /** Shader: curtain brightness. */
  intensity?: number;
  /** Shader: visible bands (1-5). */
  bands?: number;
  /** Shader: dominant curtain color. */
  primary?: string;
  /** Shader: secondary curtain color. */
  secondary?: string;
}

/** Bottom-left copy anchored under full-bleed aurora curtains. */
export function HeroAurora({
  eyebrow = "Nightly builds",
  title = "Light speed infrastructure.",
  subtitle = "Aurora curtains rendered per-pixel on the GPU — the background no CSS gradient can fake, with your headline sitting in its own scrim.",
  primaryCta = "Start free",
  secondaryCta = "Docs",
  scheme = "dark",
  speed = 0.7,
  intensity = 1,
  bands = 4,
  primary = "#2dd4bf",
  secondary = "#818cf8",
  interactive = false,
  fallback,
  ...shellProps
}: HeroAuroraProps) {
  return (
    <HeroShell
      {...shellProps}
      layout="left"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={resolveHeroCta(primaryCta)}
      secondaryCta={resolveHeroCta(secondaryCta)}
      accent={primary}
      background={<Aurora interactive={interactive} fallback={fallback} speed={speed} intensity={intensity} bands={bands} primary={primary} secondary={secondary} />}
    />
  );
}

export const HERO_AURORA_PRESETS = {
  glacier: { primary: "#2dd4bf", secondary: "#818cf8", intensity: 1 },
  ember: { primary: "#fb923c", secondary: "#e11d48", intensity: 0.9, speed: 0.85 },
  violet: { primary: "#a78bfa", secondary: "#38bdf8", intensity: 1.1, bands: 5 },
};
