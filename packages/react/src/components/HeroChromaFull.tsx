"use client";

import { HeroShell, resolveHeroCta, type HeroContentProps } from "./HeroShell";
import { ChromaFlow } from "./ChromaFlow";

export interface HeroChromaFullProps extends HeroContentProps {
  scheme?: "dark" | "light";
  /** Shader: ambient drift speed. */
  speed?: number;
  /** Shader: how far each edge's color bleeds inward. */
  radius?: number;
  /** Shader: sweep-to-color sensitivity. */
  momentum?: number;
  /** Shader: resting bleed per edge (0..1). */
  ambient?: number;
  /** Shader: base gradient color. */
  baseColor?: string;
  /** Shader: top edge color. */
  upColor?: string;
  /** Shader: bottom edge color. */
  downColor?: string;
  /** Shader: left edge color. */
  leftColor?: string;
  /** Shader: right edge color (also tints the eyebrow). */
  rightColor?: string;
}

/**
 * Full-bleed cut of HeroChroma: the four-edge chroma field runs wall to wall
 * with copy anchored bottom-left over the side scrim — a dusk palette by
 * default, wider edge bleed, and the flood interaction available via
 * `interactive`.
 */
export function HeroChromaFull({
  eyebrow = "Full-bleed, wide open",
  title = "Color on\nevery edge.",
  subtitle = "A four-edge liquid field flooding a midnight base behind real, selectable text — set it full-bleed and let the copy sit low.",
  primaryCta = "Flood the frame",
  secondaryCta = "Tweak the palette",
  scheme = "dark",
  speed = 0.85,
  radius = 0.6,
  momentum = 16,
  ambient = 0.65,
  baseColor = "#1b0b2e",
  upColor = "#a855f7",
  downColor = "#f5f5f4",
  leftColor = "#f472b6",
  rightColor = "#fbbf24",
  interactive = false,
  fallback,
  ...shellProps
}: HeroChromaFullProps) {
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
      accent={rightColor}
      background={<ChromaFlow interactive={interactive} fallback={fallback} speed={speed} radius={radius} momentum={momentum} ambient={ambient} baseColor={baseColor} upColor={upColor} downColor={downColor} leftColor={leftColor} rightColor={rightColor} />}
    />
  );
}

export const HERO_CHROMA_FULL_PRESETS = {
  dusk: { baseColor: "#1b0b2e", upColor: "#a855f7", downColor: "#f5f5f4", leftColor: "#f472b6", rightColor: "#fbbf24", ambient: 0.65 },
  tide: { baseColor: "#03161f", upColor: "#0ea5e9", downColor: "#ecfeff", leftColor: "#06b6d4", rightColor: "#38bdf8", ambient: 0.5, radius: 0.7 },
  classic: { baseColor: "#071021", upColor: "#1d4ed8", downColor: "#cbd5e1", leftColor: "#0ea5e9", rightColor: "#f59e0b", ambient: 0.55, radius: 0.45 },
};
