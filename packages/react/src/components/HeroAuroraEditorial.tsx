"use client";

import type { ReactNode } from "react";
import { HeroShell, resolveHeroCta, type HeroCta, type HeroContentProps } from "./HeroShell";
import { Aurora } from "./Aurora";

export interface HeroAuroraEditorialProps extends HeroContentProps {
  /** Second, dimmer support line under the subtitle — the editorial standfirst. */
  detail?: ReactNode;
  scheme?: "dark" | "light";
  /** Shader: animation speed multiplier. */
  speed?: number;
  /** Shader: curtain brightness. */
  intensity?: number;
  /** Shader: visible bands (1-5). */
  bands?: number;
  /** Shader: dominant curtain color. */
  primary?: string;
  /** Shader: secondary curtain color. */
  secondary?: string;
}

const CSS = `
.vfx-hero-aurora-editorial .vfx-hero-eyebrow{letter-spacing:.34em;font-size:clamp(.58rem,min(1.5cqw,2.4cqh),.74rem)}
.vfx-hero-aurora-editorial .vfx-hero-title{font-family:Georgia,"Iowan Old Style","Times New Roman",serif;font-weight:500;letter-spacing:-.02em;line-height:1.04;font-size:clamp(1.9rem,min(8.6cqw,19cqh),6rem);max-width:16ch}
.vfx-hero-aurora-editorial .vfx-hero-subtitle{max-width:44ch;font-size:clamp(.9rem,min(2.1cqw,4.4cqh),1.14rem)}
.vfx-hero-aurora-editorial .vfx-hero-detail{margin:0;font-style:italic;font-size:clamp(.78rem,min(1.8cqw,3.8cqh),1rem);line-height:1.7;max-width:52ch;color:color-mix(in oklab,var(--hero-fg) 52%,transparent)}
`;

function HeroAction({ action, variant }: { action: HeroCta; variant: "primary" | "secondary" }) {
  const className = `vfx-hero-cta vfx-hero-cta--${variant}`;
  return action.href ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Editorial variant of HeroAurora: a centered serif masthead under the
 * curtains — large display title, two standfirst lines, dual CTAs. The
 * centered radial scrim keeps the type at WCAG AA over any palette.
 */
export function HeroAuroraEditorial({
  eyebrow = "A dispatch from the north",
  title = "Letters written\nin light.",
  subtitle = "One aurora, computed per-pixel behind your headline — no two visits see the same sky twice.",
  detail = "Set in real, selectable type. Replace every word; keep the weather.",
  primaryCta = "Start reading",
  secondaryCta = "Browse issues",
  scheme = "dark",
  speed = 0.55,
  intensity = 0.95,
  bands = 4,
  primary = "#2dd4bf",
  secondary = "#818cf8",
  interactive = false,
  fallback,
  children,
  className,
  style,
  ...shellProps
}: HeroAuroraEditorialProps) {
  const ctaPrimary = resolveHeroCta(primaryCta);
  const ctaSecondary = resolveHeroCta(secondaryCta);
  return (
    <HeroShell
      {...shellProps}
      layout="centered"
      scheme={scheme}
      accent={primary}
      className={`vfx-hero-aurora-editorial${className ? ` ${className}` : ""}`}
      style={style}
      background={<Aurora interactive={interactive} fallback={fallback} speed={speed} intensity={intensity} bands={bands} primary={primary} secondary={secondary} />}
    >
      {children ?? <>
        {eyebrow ? <p className="vfx-hero-eyebrow">{eyebrow}</p> : null}
        {title != null && <h1 className="vfx-hero-title">{title}</h1>}
        {subtitle ? <p className="vfx-hero-subtitle">{subtitle}</p> : null}
        {detail ? <p className="vfx-hero-detail">{detail}</p> : null}
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

export const HERO_AURORA_EDITORIAL_PRESETS = {
  press: { primary: "#2dd4bf", secondary: "#818cf8", bands: 4, speed: 0.55 },
  midnight: { primary: "#818cf8", secondary: "#38bdf8", bands: 5, speed: 0.45, intensity: 0.85 },
  dawn: { primary: "#fbbf24", secondary: "#f472b6", bands: 3, speed: 0.7, intensity: 1 },
};
