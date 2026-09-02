"use client";

import { HeroShell } from "./HeroShell";
import { FluidGradient } from "./FluidGradient";

export interface HeroFluidProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: animation speed multiplier. */
  speed?: number;
  /** Shader: domain-warp turbulence. */
  warp?: number;
  /** Shader: noise frequency. */
  scale?: number;
  /** Shader: dark base stop. */
  from?: string;
  /** Shader: mid stop. */
  to?: string;
  /** Shader: highlight stop (also tints the eyebrow). */
  accent?: string;
}

/** Centered headline over a flowing liquid-gradient field. */
export function HeroFluid({
  eyebrow = "Ship faster",
  title = "Your product, in one sentence.",
  subtitle = "A drop-in hero section with a GPU-rendered liquid gradient behind real, selectable text. Zero props, already production-grade.",
  primaryCta = "Get started",
  secondaryCta = "Live demo",
  scheme = "dark",
  speed = 0.5,
  warp = 2.2,
  scale = 1.5,
  from = "#0b1026",
  to = "#1d4ed8",
  accent = "#7dd3fc",
}: HeroFluidProps) {
  return (
    <HeroShell
      layout="centered"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent={accent}
      background={<FluidGradient speed={speed} warp={warp} scale={scale} from={from} to={to} accent={accent} />}
    />
  );
}

export const HERO_FLUID_PRESETS = {
  midnight: { from: "#0b1026", to: "#1d4ed8", accent: "#7dd3fc", speed: 0.5 },
  magma: { from: "#1a0b0e", to: "#9f1239", accent: "#fda4af", speed: 0.65, warp: 2.6 },
  moss: { from: "#04110d", to: "#065f46", accent: "#6ee7b7", speed: 0.45, scale: 1.8 },
};
