"use client";

import { HeroShell } from "./HeroShell";
import { Iridescent } from "./Iridescent";

export interface HeroIridescentProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: sheen scale. */
  scale?: number;
  /** Shader: hue rotation. */
  hueShift?: number;
  /** Shader: saturation. */
  saturation?: number;
  /** Shader: brightness. */
  brightness?: number;
}

/** Left copy over a holographic thin-film sheen — the premium product-launch look. */
export function HeroIridescent({
  eyebrow = "Product launch",
  title = "A finish you can't screenshot.",
  subtitle = "Thin-film interference colors drifting across the surface — computed per-pixel on the GPU, not a static PNG with a gradient mask.",
  primaryCta = "Pre-order",
  secondaryCta = "Watch film",
  scheme = "dark",
  speed = 0.8,
  scale = 2.4,
  hueShift = 0,
  saturation = 1,
  brightness = 0.9,
}: HeroIridescentProps) {
  return (
    <HeroShell
      layout="left"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent="#f0abfc"
      background={<Iridescent speed={speed} scale={scale} hueShift={hueShift} saturation={saturation} brightness={brightness} />}
    />
  );
}

export const HERO_IRIDESCENT_PRESETS = {
  hologram: { hueShift: 0, saturation: 1, brightness: 0.9 },
  oil: { hueShift: 0.35, saturation: 0.85, brightness: 0.8, scale: 1.8 },
  pearl: { hueShift: 0.6, saturation: 0.55, brightness: 1.05, speed: 0.6 },
};
