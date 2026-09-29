"use client";

import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { RibbonField } from "./RibbonField";

export interface HeroRibbonLeftProps extends HeroContentProps {
  scheme?: "dark" | "light";
  /** Shader: animation speed. */
  speed?: number;
  /** Shader: ribbon brightness. */
  intensity?: number;
  /** Shader: horizontal drift (-1..1). */
  drift?: number;
  /** Shader: grain strength. */
  grain?: number;
}

const CSS = `
.vfx-hero-ribbon-left .vfx-hero-scrim{background:linear-gradient(90deg,rgb(var(--hero-scrim-rgb)/.92) 0%,rgb(var(--hero-scrim-rgb)/.85) 42%,rgb(var(--hero-scrim-rgb)/.55) 60%,rgb(var(--hero-scrim-rgb)/.2) 76%,transparent 90%)}
.vfx-hero-ribbon-left .vfx-hero-inner{flex-direction:row;align-items:stretch;gap:clamp(18px,3.4cqw,52px);width:min(88%,1180px);padding-inline:clamp(20px,6vw,72px)}
.vfx-hrl-rail{display:flex;flex-direction:column;align-items:center;gap:12px;padding-block:4px}
.vfx-hrl-mark{margin:0;writing-mode:vertical-rl;rotate:180deg;text-transform:uppercase;letter-spacing:.32em;font-size:clamp(.6rem,min(1.4cqw,2.4cqh),.74rem);font-weight:600;color:var(--hero-accent,var(--hero-fg-dim));white-space:nowrap}
.vfx-hrl-rule{flex:1;width:1px;background:linear-gradient(to bottom,transparent,color-mix(in oklab,var(--hero-fg) 28%,transparent),transparent)}
.vfx-hrl-main{display:flex;flex-direction:column;gap:clamp(10px,min(2cqw,4.5cqh),22px);min-width:0;align-items:flex-start}
.vfx-hero-ribbon-left .vfx-hero-actions{justify-content:flex-start}
@media (max-width:820px){
.vfx-hero-ribbon-left .vfx-hero-inner{flex-direction:column;width:100%;text-align:center;align-items:center}
.vfx-hrl-rail{flex-direction:row;width:100%;padding-block:0}
.vfx-hrl-mark{writing-mode:horizontal-tb;rotate:none;letter-spacing:.28em}
.vfx-hrl-rule{height:1px;width:auto;flex:1;background:linear-gradient(to right,transparent,color-mix(in oklab,var(--hero-fg) 28%,transparent),transparent)}
.vfx-hrl-main{align-items:center}
.vfx-hero-ribbon-left .vfx-hero-title,.vfx-hero-ribbon-left .vfx-hero-subtitle{margin-inline:auto}
.vfx-hero-ribbon-left .vfx-hero-actions{justify-content:center}
}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Mirrored cut of HeroRibbon: the copy column sits left with a vertical
 * eyebrow rail along its edge, while the widened scrim keeps the ribbons
 * reading as the right-hand visual. The rail un-rotates to a horizontal rule
 * on narrow screens.
 */
export function HeroRibbonLeft({
  eyebrow = "Live telemetry",
  title = "Noise, combed\ninto light.",
  subtitle = "Three Gaussian light ribbons sweep the right of your copy over a dot-matrix grid — the data-center aesthetic, typeset like a broadsheet.",
  primaryCta = "Open the feed",
  secondaryCta = "Read the method",
  scheme = "dark",
  speed = 0.9,
  intensity = 1,
  drift = 0.25,
  grain = 1,
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroRibbonLeftProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="split"
      scheme={scheme}
      accent="#67e8f9"
      className={`vfx-hero-ribbon-left${className ? ` ${className}` : ""}`}
      style={style}
      background={<RibbonField interactive={interactive} fallback={fallback} speed={speed} intensity={intensity} drift={drift} grain={grain} />}
    >
      {children ?? <>
        <div className="vfx-hrl-rail">
          {eyebrow ? <p className="vfx-hrl-mark">{eyebrow}</p> : null}
          <span className="vfx-hrl-rule" aria-hidden="true" />
        </div>
        <div className="vfx-hrl-main">
          {title != null && <h1 className="vfx-hero-title">{title}</h1>}
          {subtitle ? <p className="vfx-hero-subtitle">{subtitle}</p> : null}
          {ctaPrimary || ctaSecondary ? (
            <div className="vfx-hero-actions">
              {ctaPrimary ? <HeroAction action={ctaPrimary} variant="primary" /> : null}
              {ctaSecondary ? <HeroAction action={ctaSecondary} variant="secondary" /> : null}
            </div>
          ) : null}
        </div>
        <style>{CSS}</style>
      </>}
    </HeroShell>
  );
}

export const HERO_RIBBON_LEFT_PRESETS = {
  signal: { intensity: 1, drift: 0.25, speed: 0.9 },
  quiet: { intensity: 0.7, speed: 0.55, drift: -0.15 },
  surge: { intensity: 1.3, speed: 1.4, drift: 0.5 },
};
