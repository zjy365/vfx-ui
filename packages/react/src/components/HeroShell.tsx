"use client";

import { type CSSProperties, type ReactNode } from "react";

/**
 * Shared layout shell for every vfx-ui hero component.
 *
 * The GPU shader is only the background layer; this shell owns everything
 * that makes a hero *ship-ready*: real selectable DOM text (h1/p/a — never
 * texture-rendered type), per-layout scrim so text holds WCAG AA contrast
 * over any palette, opinionated typography, responsive reflow, and a
 * prefers-reduced-motion static fallback (the shader itself already freezes
 * its first frame; the entrance animation is gated here).
 *
 * Layout archetypes (see docs/POSITIONING.md):
 *  - centered: full-bleed background, centered headline stack, radial scrim.
 *  - left:     full-bleed background, bottom-weighted left copy, side scrim.
 *  - split:    copy on the left half, the shader reads as the right visual.
 *  - stacked:  centered copy with a badge row, top-weighted eyebrow.
 */
export type HeroLayout = "centered" | "left" | "split" | "stacked";

export interface HeroCta {
  label: string;
  href?: string;
}

export interface HeroShellProps {
  layout?: HeroLayout;
  /** Dark is the default aesthetic; light inverts text/scrim for bright pages. */
  scheme?: "dark" | "light";
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Optional trust-row labels (stacked/centered layouts). */
  badges?: readonly string[];
  /** The GPU background layer — rendered in an aria-hidden, pointer-free slot. */
  background: ReactNode;
  /** CSS accent for eyebrow/links, e.g. "#7dd3fc". */
  accent?: string;
  className?: string;
  style?: CSSProperties;
}

const HERO_CSS = `
.vfx-hero{position:relative;width:100%;height:100%;min-height:var(--hero-min-height,560px);overflow:hidden;container-type:size;display:flex;align-items:center;--hero-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--hero-fg:#f6f6f7;--hero-fg-dim:rgba(246,246,247,.74);--hero-bg-solid:#09090b;--hero-scrim-rgb:0 0 0;font-family:var(--hero-font);color:var(--hero-fg)}
.vfx-hero[data-scheme="light"]{--hero-fg:#0c0c0e;--hero-fg-dim:rgba(12,12,14,.68);--hero-bg-solid:#fafafa;--hero-scrim-rgb:255 255 255}
.vfx-hero-bg{position:absolute;inset:0;z-index:0}
.vfx-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none}
.vfx-hero-inner{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:clamp(16px,4cqh,72px) clamp(16px,4.5cqw,56px);display:flex;flex-direction:column;gap:clamp(10px,min(2cqw,4.5cqh),26px)}
.vfx-hero-eyebrow{margin:0;font-size:clamp(.6rem,min(1.6cqw,2.6cqh),.78rem);font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--hero-accent,var(--hero-fg-dim))}
.vfx-hero-title{margin:0;font-weight:650;letter-spacing:-.025em;line-height:1.04;font-size:clamp(1.4rem,min(7cqw,17cqh),4.4rem);max-width:18ch;white-space:pre-line}
.vfx-hero-subtitle{margin:0;font-size:clamp(.85rem,min(2.2cqw,5cqh),1.22rem);line-height:1.6;max-width:52ch;color:var(--hero-fg-dim)}
.vfx-hero-actions{display:flex;flex-wrap:wrap;gap:clamp(8px,min(1.4cqw,3cqh),14px);align-items:center;margin-top:clamp(4px,1.5cqh,6px)}
.vfx-hero-cta{display:inline-flex;align-items:center;gap:8px;padding:clamp(7px,2.6cqh,12px) clamp(12px,2.2cqw,22px);border-radius:999px;font-size:clamp(.72rem,min(1.6cqw,2.8cqh),.95rem);font-weight:600;text-decoration:none;transition:transform 160ms cubic-bezier(.16,1,.3,1),opacity 160ms ease}
.vfx-hero-cta--primary{background:var(--hero-fg);color:var(--hero-bg-solid)}
.vfx-hero-cta--primary:hover{transform:translateY(-1px)}
.vfx-hero-cta--secondary{color:var(--hero-fg);border:1px solid color-mix(in oklab,var(--hero-fg) 24%,transparent)}
.vfx-hero-cta--secondary:hover{border-color:color-mix(in oklab,var(--hero-fg) 52%,transparent)}
.vfx-hero-badges{display:flex;flex-wrap:wrap;gap:clamp(6px,1.2cqw,10px);margin-top:clamp(4px,1.5cqh,10px)}
.vfx-hero-badge{padding:clamp(3px,1.4cqh,6px) clamp(8px,1.6cqw,14px);border-radius:999px;font-size:clamp(.6rem,min(1.5cqw,2.6cqh),.8rem);font-weight:500;color:var(--hero-fg-dim);border:1px solid color-mix(in oklab,var(--hero-fg) 16%,transparent);backdrop-filter:blur(6px)}
/* --- layouts --- */
.vfx-hero[data-layout="centered"] .vfx-hero-inner{align-items:center;text-align:center}
.vfx-hero[data-layout="centered"] .vfx-hero-title,.vfx-hero[data-layout="centered"] .vfx-hero-subtitle{max-width:22ch;margin-inline:auto}
.vfx-hero[data-layout="centered"] .vfx-hero-subtitle{max-width:56ch}
.vfx-hero[data-layout="centered"] .vfx-hero-scrim{background:radial-gradient(120% 90% at 50% 42%,color-mix(in oklab,var(--hero-bg-solid) 78%,transparent) 0%,color-mix(in oklab,var(--hero-bg-solid) 46%,transparent) 46%,color-mix(in oklab,var(--hero-bg-solid) 12%,transparent) 100%)}
.vfx-hero[data-layout="left"] .vfx-hero-inner{justify-content:flex-end;align-items:flex-start}
.vfx-hero[data-layout="left"]{align-items:flex-end}
.vfx-hero[data-layout="left"] .vfx-hero-scrim{background:linear-gradient(to top,color-mix(in oklab,var(--hero-bg-solid) 88%,transparent) 0%,color-mix(in oklab,var(--hero-bg-solid) 52%,transparent) 42%,color-mix(in oklab,var(--hero-bg-solid) 8%,transparent) 100%)}
.vfx-hero[data-layout="split"] .vfx-hero-inner{max-width:none;padding-inline:clamp(24px,6vw,96px)}
.vfx-hero[data-layout="split"]{align-items:center}
/* Black-alpha stops (not the solid token): the shader canvas underneath is
   near-black, so a tinted solid panel would expose a vertical seam. */
.vfx-hero[data-layout="split"] .vfx-hero-scrim{background:linear-gradient(90deg,rgb(var(--hero-scrim-rgb)/.88) 0%,rgb(var(--hero-scrim-rgb)/.88) 26%,rgb(var(--hero-scrim-rgb)/.74) 38%,rgb(var(--hero-scrim-rgb)/.46) 50%,rgb(var(--hero-scrim-rgb)/.18) 62%,transparent 74%)}
.vfx-hero[data-layout="split"] .vfx-hero-inner{width:min(60%,720px);margin:0}
.vfx-hero[data-layout="split"] .vfx-hero-title{max-width:22ch}
.vfx-hero[data-layout="stacked"] .vfx-hero-inner{align-items:center;text-align:center;justify-content:flex-start}
.vfx-hero[data-layout="stacked"]{align-items:flex-start}
.vfx-hero[data-layout="stacked"] .vfx-hero-scrim{background:linear-gradient(to bottom,color-mix(in oklab,var(--hero-bg-solid) 72%,transparent) 0%,color-mix(in oklab,var(--hero-bg-solid) 34%,transparent) 46%,transparent 100%)}
/* --- responsive: split collapses to centered below 900px --- */
@media (max-width:900px){
  .vfx-hero[data-layout="split"] .vfx-hero-scrim{background:linear-gradient(to bottom,color-mix(in oklab,var(--hero-bg-solid) 84%,transparent) 0%,color-mix(in oklab,var(--hero-bg-solid) 56%,transparent) 55%,transparent 100%)}
  .vfx-hero[data-layout="split"] .vfx-hero-inner{width:100%;margin:0 auto;text-align:center;align-items:center}
  .vfx-hero[data-layout="split"] .vfx-hero-actions{justify-content:center}
  .vfx-hero[data-layout="split"] .vfx-hero-subtitle{margin-inline:auto}
}
/* --- entrance motion (static when the visitor opts out) --- */
@keyframes vfx-hero-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:no-preference){
  .vfx-hero-anim>*{animation:vfx-hero-rise 720ms cubic-bezier(.16,1,.3,1) both}
  .vfx-hero-anim>*:nth-child(2){animation-delay:90ms}
  .vfx-hero-anim>*:nth-child(3){animation-delay:180ms}
  .vfx-hero-anim>*:nth-child(4){animation-delay:270ms}
  .vfx-hero-anim>*:nth-child(5){animation-delay:360ms}
}
`;

export function HeroShell({
  layout = "centered",
  scheme = "dark",
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  badges,
  background,
  accent,
  className,
  style,
}: HeroShellProps) {
  return (
    <section
      className={`vfx-hero${className ? ` ${className}` : ""}`}
      data-layout={layout}
      data-scheme={scheme}
      style={{ ...(accent ? ({ "--hero-accent": accent } as CSSProperties) : null), ...style }}
    >
      <style>{HERO_CSS}</style>
      <div className="vfx-hero-bg" aria-hidden="true" style={{ pointerEvents: "none" }}>
        {background}
      </div>
      <div className="vfx-hero-scrim" aria-hidden="true" />
      <div className="vfx-hero-inner vfx-hero-anim">
        {eyebrow ? <p className="vfx-hero-eyebrow">{eyebrow}</p> : null}
        <h1 className="vfx-hero-title">{title}</h1>
        {subtitle ? <p className="vfx-hero-subtitle">{subtitle}</p> : null}
        {primaryCta || secondaryCta ? (
          <div className="vfx-hero-actions">
            {primaryCta ? (
              <a className="vfx-hero-cta vfx-hero-cta--primary" href={primaryCta.href ?? "#"}>
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a className="vfx-hero-cta vfx-hero-cta--secondary" href={secondaryCta.href ?? "#"}>
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        ) : null}
        {badges?.length ? (
          <div className="vfx-hero-badges">
            {badges.map((badge) => (
              <span className="vfx-hero-badge" key={badge}>{badge}</span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
