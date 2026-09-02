"use client";

import { HeroShell } from "./HeroShell";
import { FiberFlow } from "./FiberFlow";

export interface HeroFiberProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  badges?: readonly string[];
  scheme?: "dark" | "light";
  /** Shader: animation speed multiplier. */
  speed?: number;
  /** Shader: brightness. */
  intensity?: number;
  /** Shader: field scale. */
  scale?: number;
  /** Shader: fiber density. */
  strands?: number;
  /** Shader: fiber sharpness. */
  sharp?: number;
  /** Shader: deep fiber color. */
  from?: string;
  /** Shader: mid fiber color. */
  to?: string;
  /** Shader: strand-peak sheen color. */
  accent?: string;
}

/** Top-weighted headline over luminous silk fibers streaming through the dark. */
export function HeroFiber({
  eyebrow = "Now in private beta",
  title = "Threads of light for your next launch.",
  subtitle = "A domain-warped ridge field of silk fibers, computed per-pixel on the GPU. Copy the component, keep the conversions.",
  primaryCta = "Request access",
  secondaryCta = "Changelog",
  badges = ["SOC 2", "99.99% uptime", "No credit card"],
  scheme = "dark",
  speed = 1,
  intensity = 1,
  scale = 1.6,
  strands = 22,
  sharp = 6,
  from = "#1e1b4b",
  to = "#4f46e5",
  accent = "#a5b4fc",
}: HeroFiberProps) {
  return (
    <HeroShell
      layout="stacked"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      badges={badges}
      accent={accent}
      background={<FiberFlow speed={speed} intensity={intensity} scale={scale} strands={strands} sharp={sharp} from={from} to={to} accent={accent} />}
    />
  );
}

export const HERO_FIBER_PRESETS = {
  indigo: { from: "#1e1b4b", to: "#4f46e5", accent: "#a5b4fc" },
  gold: { from: "#27180a", to: "#b45309", accent: "#fcd34d", sharp: 7 },
  rose: { from: "#2a0a18", to: "#be185d", accent: "#f9a8d4", strands: 26 },
};
