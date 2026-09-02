"use client";

import { HeroShell } from "./HeroShell";
import { MeshGradient } from "./MeshGradient";

export interface HeroMeshProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: cell density. */
  scale?: number;
  /** Shader: cell edge softness. */
  softness?: number;
  from?: string;
  to?: string;
  accent?: string;
  deep?: string;
}

/** Centered headline over a slow Voronoi mesh-gradient field. */
export function HeroMesh({
  eyebrow = "Design systems",
  title = "Color fields that never repeat.",
  subtitle = "Voronoi cells flowing through a curated palette — every frame is a different poster, and the text sits on its own soft scrim.",
  primaryCta = "Browse palettes",
  secondaryCta = "Copy component",
  scheme = "dark",
  speed = 0.6,
  scale = 3.2,
  softness = 0.09,
  from = "#0b1120",
  to = "#134e4a",
  accent = "#7c3aed",
  deep = "#f472b6",
}: HeroMeshProps) {
  return (
    <HeroShell
      layout="centered"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent={deep}
      background={<MeshGradient speed={speed} scale={scale} softness={softness} from={from} to={to} accent={accent} deep={deep} />}
    />
  );
}

export const HERO_MESH_PRESETS = {
  orchid: { from: "#0b1120", to: "#134e4a", accent: "#7c3aed", deep: "#f472b6" },
  citrus: { from: "#1c1917", to: "#78350f", accent: "#f59e0b", deep: "#fde68a" },
  arctic: { from: "#020617", to: "#0c4a6e", accent: "#0891b2", deep: "#a5f3fc" },
};
