"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { BlackHole } from "./BlackHole";

export interface HeroBlackHoleCinemaProps extends HeroContentProps {
  /** Letterbox bar thickness (CSS length); defaults to a scope-ratio feel. */
  bars?: string;
  scheme?: "dark" | "light";
  /** Pipeline: disk evolution speed. */
  speed?: number;
  /** Pipeline: disk emission gain. */
  brightness?: number;
  /** Pipeline: camera orbit radius (horizon units). */
  distance?: number;
  /** Pipeline: outer disk radius (horizon units). */
  diskRadius?: number;
  /** Pipeline: camera elevation in radians. */
  tilt?: number;
  /** Pipeline: Doppler beaming exponent. */
  doppler?: number;
  /** Pipeline: star tint spread. */
  stars?: number;
  /** Pipeline: horizontal framing of the hole, NDC -1..1. */
  centerX?: number;
  /** Pipeline: vertical framing of the hole, NDC -1..1. */
  centerY?: number;
  /** Pipeline: fade the scene band behind the centered title (0..1). */
  centerFade?: number;
}

const CSS = `
.vfx-hero-bh-cinema{--vfx-bhc-bar:clamp(26px,8.5cqh,92px)}
.vfx-hero-bh-cinema .vfx-hero-inner{align-items:center;text-align:center;padding-block:calc(var(--vfx-bhc-bar) + clamp(14px,4cqh,56px))}
.vfx-hero-bh-cinema .vfx-hero-eyebrow{letter-spacing:.42em}
.vfx-hero-bh-cinema .vfx-hero-title{font-weight:600;letter-spacing:.01em;font-size:clamp(1.6rem,min(6.4cqw,15cqh),4rem)}
.vfx-hero-bh-cinema::before,.vfx-hero-bh-cinema::after{content:"";position:absolute;left:0;right:0;height:var(--vfx-bhc-bar);background:#020204;z-index:1;pointer-events:none}
.vfx-hero-bh-cinema::before{top:0}
.vfx-hero-bh-cinema::after{bottom:0}
@media (max-width:640px){.vfx-hero-bh-cinema{--vfx-bhc-bar:clamp(20px,7cqh,64px)}}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Cinema cut of HeroBlackHole: the accretion disk framed like a feature film
 * — hard letterbox bars top and bottom, the title card centered in the band,
 * and the pipeline's centerFade dimming the scene right behind the type.
 */
export function HeroBlackHoleCinema({
  eyebrow = "Now in orbit",
  title = "The calm\nbetween stars.",
  subtitle = "A ray-traced accretion disk with relativistic beaming, letterboxed like a feature film. Your title card plays in the quiet band.",
  primaryCta = "Enter the theater",
  secondaryCta = "Watch the reel",
  bars,
  scheme = "dark",
  speed = 0.6,
  brightness = 0.7,
  distance = 15,
  diskRadius = 9,
  tilt = 0.14,
  doppler = 1.21,
  stars = 0.5,
  centerX = 0,
  centerY = 0,
  centerFade = 0.5,
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroBlackHoleCinemaProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      accent="#fbbf24"
      className={`vfx-hero-bh-cinema${className ? ` ${className}` : ""}`}
      style={{ ...(bars ? ({ "--vfx-bhc-bar": bars } as typeof style) : null), ...style }}
      background={
        <BlackHole interactive={interactive} fallback={fallback}
          speed={speed}
          brightness={brightness}
          distance={distance}
          diskRadius={diskRadius}
          tilt={tilt}
          doppler={doppler}
          stars={stars}
          centerX={centerX}
          centerY={centerY}
          centerFade={centerFade}
        />
      }
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

export const HERO_BLACK_HOLE_CINEMA_PRESETS = {
  feature: { distance: 15, brightness: 0.7, speed: 0.6, centerFade: 0.5 },
  wide: { distance: 17, diskRadius: 11, tilt: 0.08, brightness: 0.65, centerFade: 0.42 },
  noir: { brightness: 0.9, doppler: 1.6, stars: 0.2, speed: 0.45, centerFade: 0.62 },
};
