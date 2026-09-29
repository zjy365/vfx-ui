"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { ParticleField } from "./ParticleField";

export interface HeroParticlesBadgeProps extends HeroContentProps {
  /** Chips rendered as the top row. Fictional demo labels by default. */
  badges?: readonly string[];
  scheme?: "dark" | "light";
  /** Shader: fraction of cells carrying a particle (0..1). */
  density?: number;
  /** Shader: drift/wander/breathing speed. */
  speed?: number;
  /** Shader: particle radius relative to its cell. */
  size?: number;
  /** Shader: particle color. */
  color?: string;
}

const CSS = `
.vfx-hero-particles-badge .vfx-hero-badges{margin-top:0;justify-content:center}
.vfx-hero-particles-badge .vfx-hero-badge{background:rgb(var(--hero-scrim-rgb)/.34);backdrop-filter:blur(8px)}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Badge-first cut of HeroParticles: the trust chips lead the stack at the very
 * top, then a centered headline over the drifting particle field. Chips get
 * their own frosted backing so they hold contrast wherever the field drifts.
 */
export function HeroParticlesBadge({
  eyebrow = "Community edition",
  title = "Where your people\ngather next.",
  subtitle = "Cell-hashed particles with drift and size breathing, computed on the GPU — a calm field that lets the headline carry the room.",
  primaryCta = "Claim a seat",
  secondaryCta = "See the lineup",
  badges = ["9k teams", "Open source", "Ships in one file"],
  scheme = "dark",
  density = 0.42,
  speed = 0.75,
  size = 0.15,
  color = "#9ccaff",
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroParticlesBadgeProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      accent={color}
      className={`vfx-hero-particles-badge${className ? ` ${className}` : ""}`}
      style={style}
      background={<ParticleField interactive={interactive} fallback={fallback} density={density} speed={speed} size={size} color={color} />}
    >
      {children ?? <>
        {badges?.length ? (
          <div className="vfx-hero-badges">
            {badges.map((badge) => (
              <span className="vfx-hero-badge" key={badge}>{badge}</span>
            ))}
          </div>
        ) : null}
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

export const HERO_PARTICLES_BADGE_PRESETS = {
  azure: { color: "#9ccaff", density: 0.42 },
  mint: { color: "#6ee7b7", density: 0.38, size: 0.17, speed: 0.65 },
  dune: { color: "#fcd34d", density: 0.5, speed: 0.55 },
};
