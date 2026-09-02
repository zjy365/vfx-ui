"use client";

import { HeroShell } from "./HeroShell";
import { ChromaFlow } from "./ChromaFlow";

export interface HeroChromaProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
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
  /** Shader: top edge color (also tints the eyebrow). */
  upColor?: string;
  /** Shader: bottom edge color. */
  downColor?: string;
  /** Shader: left edge color. */
  leftColor?: string;
  /** Shader: right edge color. */
  rightColor?: string;
  /**
   * When true, the color field floods from whichever edge the cursor sweeps
   * toward. False (default) keeps the calm ambient slosh — the convention
   * across all vfx-ui backgrounds and heroes.
   */
  interactive?: boolean;
}

/**
 * Bottom-left copy over a four-edge chroma field — the reddit-ai-assistant
 * landing hero, abstracted into an original vfx-ui shader + the shared
 * HeroShell. With `interactive`, the field floods toward whichever direction
 * the cursor sweeps.
 */
export function HeroChroma({
  eyebrow = "AI-Powered Chrome Extension",
  title = "Intelligent Reddit\nreplies & posts",
  subtitle = "A drop-in hero whose background is a living color field: four edge palettes slosh over a midnight base behind real, selectable text — and flood toward your cursor when interactive.",
  primaryCta = "View on GitHub",
  secondaryCta = "Explore Features",
  scheme = "dark",
  speed = 1,
  radius = 0.45,
  momentum = 16,
  ambient = 0.55,
  baseColor = "#071021",
  upColor = "#1d4ed8",
  downColor = "#cbd5e1",
  leftColor = "#0ea5e9",
  rightColor = "#f59e0b",
  interactive = false,
}: HeroChromaProps) {
  return (
    <HeroShell
      layout="left"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent={upColor}
      background={
        <ChromaFlow
          interactive={interactive}
          speed={speed}
          radius={radius}
          momentum={momentum}
          ambient={ambient}
          baseColor={baseColor}
          upColor={upColor}
          downColor={downColor}
          leftColor={leftColor}
          rightColor={rightColor}
        />
      }
    />
  );
}

export const HERO_CHROMA_PRESETS = {
  /** The reddit-adjacent look: midnight navy, blue above, warm amber at right. */
  classic: { baseColor: "#071021", upColor: "#1d4ed8", downColor: "#cbd5e1", leftColor: "#0ea5e9", rightColor: "#f59e0b" },
  /** Violet dusk with pink and gold edges. */
  dusk: { baseColor: "#1b0b2e", upColor: "#a855f7", downColor: "#f5f5f4", leftColor: "#f472b6", rightColor: "#fbbf24", ambient: 0.6 },
  /** Cyan tide, wider bleed. */
  tide: { baseColor: "#03161f", upColor: "#0ea5e9", downColor: "#ecfeff", leftColor: "#06b6d4", rightColor: "#38bdf8", ambient: 0.5, radius: 0.6 },
};
