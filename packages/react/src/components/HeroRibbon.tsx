"use client";

import { HeroShell } from "./HeroShell";
import { RibbonField } from "./RibbonField";

export interface HeroRibbonProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: ribbon brightness. */
  intensity?: number;
  /** Shader: horizontal drift (-1..1). */
  drift?: number;
  /** Shader: grain strength. */
  grain?: number;
}

/** Split layout: copy left, three Gaussian light ribbons sweeping the right. */
export function HeroRibbon({
  eyebrow = "Realtime analytics",
  title = "Signals, not noise.",
  subtitle = "Three light ribbons over a dot-matrix grid with bloom and grain — the data-center aesthetic without the data-center budget.",
  primaryCta = "Start tracking",
  secondaryCta = "View demo",
  scheme = "dark",
  speed = 1,
  intensity = 1,
  drift = 0.2,
  grain = 1,
}: HeroRibbonProps) {
  return (
    <HeroShell
      layout="split"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent="#7dd3fc"
      background={<RibbonField speed={speed} intensity={intensity} drift={drift} grain={grain} />}
    />
  );
}

export const HERO_RIBBON_PRESETS = {
  signal: { intensity: 1, drift: 0.2 },
  quiet: { intensity: 0.7, speed: 0.6, drift: -0.15 },
  surge: { intensity: 1.3, speed: 1.4, drift: 0.5 },
};
