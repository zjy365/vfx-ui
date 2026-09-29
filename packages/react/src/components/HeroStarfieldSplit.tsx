"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { Starfield } from "./Starfield";

export interface HeroStarfieldSplitProps extends HeroContentProps {
  /** Wall chips rendered on the right column. Fictional demo labels by default. */
  badges?: readonly string[];
  scheme?: "dark" | "light";
  /** Shader: fraction of cells carrying a star (0..1). */
  density?: number;
  /** Shader: drift and twinkle speed. */
  speed?: number;
  /** Shader: twinkle strength (0..1). */
  twinkle?: number;
  /** Shader: star color. */
  color?: string;
}

const CSS = `
.vfx-hero-starfield-split .vfx-hero-inner{width:min(94%,1180px)}
.vfx-hsf-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:clamp(24px,5cqw,72px);align-items:center;width:100%}
.vfx-hsf-wall{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(6px,1.2cqw,12px)}
.vfx-hsf-badge{padding:clamp(7px,2cqh,14px) clamp(10px,1.8cqw,16px);border-radius:12px;font-size:clamp(.66rem,min(1.5cqw,2.8cqh),.84rem);font-weight:500;color:var(--hero-fg);border:1px solid color-mix(in oklab,var(--hero-fg) 20%,transparent);background:rgb(var(--hero-scrim-rgb)/.42);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;text-align:center}
@media (max-width:880px){
.vfx-hero-starfield-split .vfx-hero-inner{width:100%}
.vfx-hsf-grid{grid-template-columns:1fr;justify-items:center;text-align:center}
.vfx-hsf-wall{grid-template-columns:repeat(3,minmax(0,1fr));width:100%}
}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Split starfield hero: copy on the left half, a badge wall in frosted chips
 * on the right so the star grid reads as the trust-panel backdrop. Below 880px
 * the columns stack and the wall reflows to three-across.
 */
export function HeroStarfieldSplit({
  eyebrow = "Mission control",
  title = "Every launch,\nplotted in stars.",
  subtitle = "A hashed star grid with twinkle and parallax drift on the right of your copy — the space-tech look without the space-program budget.",
  primaryCta = "Book a launch window",
  secondaryCta = "Mission log",
  badges = ["SOC 2 Type II", "99.99% uptime", "Edge-native", "Open API", "EU residency", "24/7 on-call"],
  scheme = "dark",
  density = 0.35,
  speed = 0.8,
  twinkle = 0.75,
  color = "#d0e4ff",
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroStarfieldSplitProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="split"
      scheme={scheme}
      accent={color}
      className={`vfx-hero-starfield-split${className ? ` ${className}` : ""}`}
      style={style}
      background={<Starfield interactive={interactive} fallback={fallback} density={density} speed={speed} twinkle={twinkle} color={color} />}
    >
      {children ?? <>
        <div className="vfx-hsf-grid">
          <div className="vfx-hsf-copy">
            {eyebrow ? <p className="vfx-hero-eyebrow">{eyebrow}</p> : null}
            {title != null && <h1 className="vfx-hero-title">{title}</h1>}
            {subtitle ? <p className="vfx-hero-subtitle">{subtitle}</p> : null}
            {ctaPrimary || ctaSecondary ? (
              <div className="vfx-hero-actions">
                {ctaPrimary ? <HeroAction action={ctaPrimary} variant="primary" /> : null}
                {ctaSecondary ? <HeroAction action={ctaSecondary} variant="secondary" /> : null}
              </div>
            ) : null}
          </div>
          {badges?.length ? (
            <div className="vfx-hsf-wall" aria-label="Trust badges">
              {badges.map((badge) => (
                <span className="vfx-hero-badge vfx-hsf-badge" key={badge}>{badge}</span>
              ))}
            </div>
          ) : null}
        </div>
        <style>{CSS}</style>
      </>}
    </HeroShell>
  );
}

export const HERO_STARFIELD_SPLIT_PRESETS = {
  ops: { color: "#d0e4ff", density: 0.35, twinkle: 0.75, speed: 0.8 },
  golden: { color: "#ffe3b8", density: 0.28, twinkle: 0.6, speed: 0.65 },
  nebula: { color: "#e0c3fc", density: 0.5, twinkle: 0.95, speed: 1.05 },
};
