"use client";

import { HeroShell, resolveHeroCta, type HeroContentProps } from "./HeroShell";
import { FluidGradient } from "./FluidGradient";

export interface HeroFluidMinimalProps extends HeroContentProps {
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
  /** Shader: highlight stop (also tints the eyebrow, when you add one). */
  accent?: string;
}

/**
 * Minimal cut of HeroFluid: one line of copy, one CTA, one liquid gradient —
 * the entire hero for products that can be named in a breath. Pass an eyebrow
 * or subtitle only if you mean it.
 */
export function HeroFluidMinimal({
  title = "One line. One button. Shipped.",
  primaryCta = "Get started",
  secondaryCta = null,
  scheme = "dark",
  speed = 0.45,
  warp = 2.3,
  scale = 1.4,
  from = "#0b1220",
  to = "#1e4a5f",
  accent = "#7fb8c9",
  interactive = false,
  fallback,
  ...shellProps
}: HeroFluidMinimalProps) {
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      title={title}
      primaryCta={resolveHeroCta(primaryCta)}
      secondaryCta={resolveHeroCta(secondaryCta)}
      accent={accent}
      background={<FluidGradient interactive={interactive} fallback={fallback} speed={speed} warp={warp} scale={scale} from={from} to={to} accent={accent} />}
    />
  );
}

export const HERO_FLUID_MINIMAL_PRESETS = {
  mist: { from: "#0b1220", to: "#1e4a5f", accent: "#7fb8c9", speed: 0.45 },
  ember: { from: "#1b0f0f", to: "#6e3226", accent: "#e0a458", speed: 0.4, warp: 2.6 },
  moss: { from: "#04110d", to: "#065f46", accent: "#6ee7b7", speed: 0.35, scale: 1.7 },
};
