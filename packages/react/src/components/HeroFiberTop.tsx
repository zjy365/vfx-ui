"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { FiberFlow } from "./FiberFlow";

export interface HeroFiberTopProps extends HeroContentProps {
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

const CSS = `
.vfx-hero.vfx-hero-fiber-top .vfx-hero-inner{align-items:flex-start;text-align:left;justify-content:flex-start;padding-top:clamp(20px,7cqh,84px)}
.vfx-hero-fiber-top .vfx-hero-title{max-width:20ch}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Top-aligned cut of HeroFiber: a left-set masthead pressed against the top
 * edge while the silk-fiber field streams beneath it — the fibers carry the
 * lower two-thirds, the top-weighted scrim carries the type.
 */
export function HeroFiberTop({
  eyebrow = "Studio open · Winter season",
  title = "Work woven\nfrom light.",
  subtitle = "Luminous silk fibers streaming through the dark, computed per-pixel. Your name goes at the top; the current does the rest.",
  primaryCta = "Commission a piece",
  secondaryCta = "View the loom",
  scheme = "dark",
  speed = 0.9,
  intensity = 1,
  scale = 1.7,
  strands = 24,
  sharp = 6,
  from = "#1e1b4b",
  to = "#4f46e5",
  accent = "#a5b4fc",
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroFiberTopProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="stacked"
      scheme={scheme}
      accent={accent}
      className={`vfx-hero-fiber-top${className ? ` ${className}` : ""}`}
      style={style}
      background={<FiberFlow interactive={interactive} fallback={fallback} speed={speed} intensity={intensity} scale={scale} strands={strands} sharp={sharp} from={from} to={to} accent={accent} />}
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

export const HERO_FIBER_TOP_PRESETS = {
  classic: { from: "#1e1b4b", to: "#4f46e5", accent: "#a5b4fc" },
  ocean: { from: "#083344", to: "#0891b2", accent: "#67e8f9", speed: 0.75 },
  ember: { from: "#450a0a", to: "#ea580c", accent: "#fdba74", speed: 1.05 },
};
