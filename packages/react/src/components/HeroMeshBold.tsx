"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { MeshGradient } from "./MeshGradient";

export interface HeroMeshBoldProps extends HeroContentProps {
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: cell density. */
  scale?: number;
  /** Shader: cell edge softness. */
  softness?: number;
  /** Shader: base gradient stop. */
  from?: string;
  /** Shader: mid gradient stop. */
  to?: string;
  /** Shader: accent cell color. */
  accent?: string;
  /** Shader: highlight cell color (also tints the eyebrow). */
  deep?: string;
}

const CSS = `
.vfx-hero-mesh-bold .vfx-hero-title{font-weight:800;letter-spacing:-.035em;line-height:.94;font-size:clamp(2.3rem,min(11cqw,26cqh),8rem);text-transform:uppercase;max-width:14ch}
.vfx-hero-mesh-bold .vfx-hero-subtitle{max-width:36ch;font-size:clamp(.82rem,min(1.9cqw,4cqh),1.05rem)}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Slogan cut of HeroMesh: one oversized ultra-bold headline shouting over a
 * vivid Voronoi mesh field — the poster hero for a one-line product. Keep the
 * title short; the type is drawn to fill the frame.
 */
export function HeroMeshBold({
  eyebrow = "Bold by default",
  title = "Make noise.\nBe heard.",
  subtitle = "One sentence, one shader, nothing else in the way.",
  primaryCta = "Turn it up",
  secondaryCta = null,
  scheme = "dark",
  speed = 0.8,
  scale = 2.6,
  softness = 0.12,
  from = "#140b24",
  to = "#7c3aed",
  accent = "#ec4899",
  deep = "#fbbf24",
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroMeshBoldProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      accent={deep}
      className={`vfx-hero-mesh-bold${className ? ` ${className}` : ""}`}
      style={style}
      background={<MeshGradient interactive={interactive} fallback={fallback} speed={speed} scale={scale} softness={softness} from={from} to={to} accent={accent} deep={deep} />}
    >
      {children ?? <>
        {eyebrow ? <p className="vfx-hero-eyebrow">{eyebrow}</p> : null}
        {title != null && <h1 className="vfx-hero-title">{title}</h1>}
        {subtitle ? <p className="vfx-hero-subtitle">{subtitle}</p> : null}
        {ctaPrimary || ctaSecondary ? (
          <div className="vfx-hero-actions">
            {ctaPrimary ? <HeroAction action={ctaPrimary} variant="primary" /> : null}
            {ctaSecondary ? <HeroAction action={ctaSecondary} variant="secondary" /> : null}
          </div>
        ) : null}
        <style>{CSS}</style>
      </>}
    </HeroShell>
  );
}

export const HERO_MESH_BOLD_PRESETS = {
  poster: { from: "#140b24", to: "#7c3aed", accent: "#ec4899", deep: "#fbbf24" },
  citrus: { from: "#1a2b0e", to: "#65a30d", accent: "#f59e0b", deep: "#fde68a" },
  ultraviolet: { from: "#0b1120", to: "#2563eb", accent: "#06b6d4", deep: "#e0f2fe", speed: 1.05 },
};
