"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";

export type FooterLink = { label: string; href: string };
export type FooterLinkGroup = { label: string; links: readonly FooterLink[] };
export interface FooterContentProps {
  /** Your brand. The decorative lettering is generated from this text. */
  brand?: string;
  title?: ReactNode;
  description?: ReactNode;
  cta?: FooterLink | null;
  groups?: readonly FooterLinkGroup[];
  legal?: readonly FooterLink[];
  copyright?: ReactNode;
  /** Replaces the introduction and navigation; artwork and legal row remain. */
  children?: ReactNode;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
.vfx-footer{position:relative;isolation:isolate;container-type:inline-size;width:100%;overflow:hidden;box-sizing:border-box;font-family:inherit;background:var(--vf-bg);color:var(--vf-ink)}
.vfx-footer *{box-sizing:border-box}.vfx-footer a{color:inherit;text-decoration:none}.vfx-footer a:hover{text-decoration:underline;text-underline-offset:5px}.vfx-footer a:focus-visible{outline:2px solid currentColor;outline-offset:6px;border-radius:2px}
.vfx-footer ::selection{background:var(--vf-accent);color:var(--vf-bg)}
.vfx-footer-content{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:48px;padding:52px 5% 34px}
.vfx-footer-intro{min-width:0}.vfx-footer-title{font-size:clamp(30px,4.2cqw,56px);font-weight:500;line-height:1.08;letter-spacing:-.035em;margin:0;white-space:pre-line;max-width:14ch;text-wrap:balance}
.vfx-footer-description{font-size:14px;line-height:1.65;max-width:34ch;margin:18px 0 0;opacity:.74}
.vfx-footer-cta{display:inline-flex;align-items:center;gap:28px;margin-top:24px;padding:0 0 9px;border-bottom:1px solid currentColor;font-size:14px;line-height:1.5}.vfx-footer-cta svg{width:21px;height:21px;transition:transform .25s}.vfx-footer-cta:hover svg{transform:translate(3px,-3px)}
.vfx-footer-nav{display:flex;justify-content:flex-end;align-items:flex-start;flex-wrap:wrap;gap:36px 56px;padding-top:5px}.vfx-footer-group{display:flex;flex-direction:column;min-width:88px;gap:12px}.vfx-footer-group h3{font-size:11px;font-weight:400;opacity:.74;margin:0 0 5px}.vfx-footer-group a{font-size:13px;line-height:1.5;width:fit-content}
.vfx-footer-legal{position:relative;z-index:2;display:flex;justify-content:space-between;gap:24px;padding:20px 5%;font-size:11px;line-height:1.6;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent)}.vfx-footer-legal>span{opacity:.74}.vfx-footer-legal nav{display:flex;flex-wrap:wrap;gap:24px}
.vfx-footer-art{position:relative;width:100%;pointer-events:none}.vfx-footer-art canvas{display:block;width:100%;height:100%}.vfx-footer-wordmark{display:block;width:100%;height:100%;overflow:visible;fill:currentColor;font-family:var(--vfx-footer-display,inherit);font-weight:900}
.vfx-tidal-art{height:clamp(220px,30cqw,360px);overflow:hidden}.vfx-tidal-art canvas{position:absolute;inset:0}.vfx-tidal-brand{position:absolute;inset:26% 4% 0;color:var(--vf-ink);isolation:isolate}.vfx-tidal-brand .vfx-footer-wordmark{height:100%}
.vfx-fold-art{display:flex;padding:28px 3% 0;height:clamp(190px,29cqw,370px);perspective:1200px;background:var(--vf-bg);overflow:hidden}.vfx-fold-panel{position:relative;flex:1;min-width:0;overflow:hidden;transform-origin:center;transform:perspective(900px) rotateY(calc(var(--vf-depth,32) * var(--fold-turn,0deg))) scaleX(calc(1 / cos(calc(var(--vf-depth,32) * var(--fold-turn,0deg)))));will-change:transform;background:var(--vf-bg)}.vfx-fold-panel:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(10,8,36,var(--fold-shade)));border-right:1px solid color-mix(in srgb,var(--vf-ink) 12%,transparent);pointer-events:none}.vfx-fold-print{height:100%;display:flex;align-items:center}.vfx-fold-print .vfx-footer-wordmark{height:100%}.vfx-footer-fold .vfx-footer-content{padding-top:42px;padding-bottom:42px}
.vfx-phosphor-art{height:clamp(180px,26cqw,340px);padding:0 4%;margin:0 0 20px;overflow:hidden}.vfx-phosphor-art canvas{position:relative;z-index:1}.vfx-phosphor-art canvas[data-ready="true"]{background:var(--vf-bg)}.vfx-phosphor-fallback{position:absolute;inset:0 4%;opacity:.65}.vfx-footer-phosphor .vfx-footer-title{font-size:clamp(36px,5.5cqw,70px);max-width:18ch}.vfx-footer-phosphor .vfx-footer-content{padding-bottom:15px}
.vfx-footer-phosphor .vfx-footer-content{display:block;padding-top:42px;padding-bottom:22px}.vfx-footer-phosphor .vfx-footer-intro{display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap}.vfx-footer-phosphor .vfx-footer-cta{margin-top:0}.vfx-footer-phosphor>.vfx-footer-nav{position:relative;z-index:2;justify-content:space-between;padding:22px 5%;gap:24px;border-top:1px solid color-mix(in srgb,currentColor 24%,transparent)}.vfx-footer-phosphor .vfx-footer-group{flex-direction:row;align-items:baseline;gap:24px;flex-wrap:wrap}.vfx-footer-phosphor .vfx-footer-group h3{margin:0 10px 0 0}.vfx-footer-phosphor .vfx-phosphor-art{height:clamp(170px,29cqw,370px);margin-bottom:8px}
.vfx-footer-fold .vfx-footer-group{border-top:1px solid color-mix(in srgb,currentColor 28%,transparent);padding-top:15px}.vfx-footer-fold .vfx-footer-nav{padding-top:0}.vfx-footer-fold .vfx-footer-content{padding-top:32px}
@container(max-width:600px){.vfx-footer-content{grid-template-columns:1fr;gap:32px;padding:32px 6% 28px}.vfx-footer-title{font-size:36px;max-width:15ch}.vfx-footer-nav{justify-content:flex-start;gap:28px 44px;padding-top:0}.vfx-footer-group{gap:11px}.vfx-footer-legal{padding:18px 6%;font-size:11px;flex-wrap:wrap;gap:12px}.vfx-footer-description{font-size:13px}.vfx-footer-legal nav{gap:18px}.vfx-footer-phosphor .vfx-footer-intro{gap:24px}.vfx-footer-phosphor .vfx-footer-content{padding:32px 6% 24px}.vfx-footer-phosphor>.vfx-footer-nav{padding:22px 6%;display:grid;grid-template-columns:1fr 1fr;gap:24px}.vfx-footer-phosphor .vfx-footer-group{flex-direction:column;gap:12px}.vfx-footer-phosphor .vfx-footer-group h3{margin:0 0 4px}}
@media(prefers-reduced-motion:reduce){.vfx-footer *{transition:none!important}.vfx-footer-cta:hover svg{transform:none}}
`;

export function FooterArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}

export function FooterFrame({
  brand,
  title,
  description,
  cta,
  groups = [],
  legal = [],
  copyright,
  children,
  className = "",
  style,
  surfaceRef,
  artwork,
  kind,
  before = false,
}: FooterContentProps & {
  surfaceRef?: RefObject<HTMLElement>;
  artwork: ReactNode;
  kind: string;
  before?: boolean;
}) {
  const navigation = groups.length > 0 && (
    <nav className="vfx-footer-nav" aria-label="Footer navigation">
      {groups.map((group, i) => (
        <div className="vfx-footer-group" key={`${group.label}-${i}`}>
          <h3>{group.label}</h3>
          {group.links.map((link, j) => (
            <a href={link.href} key={`${link.href}-${j}`}>
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
  return (
    <footer
      ref={surfaceRef}
      className={`vfx-footer vfx-footer-${kind} ${className}`}
      style={style}
      aria-label={brand ? `${brand} footer` : "Footer"}
    >
      <style>{CSS}</style>
      {before && artwork}
      <div className="vfx-footer-content">
        {children ?? (
          <>
            <div className="vfx-footer-intro">
              {title != null && <h2 className="vfx-footer-title">{title}</h2>}
              {description != null && (
                <div className="vfx-footer-description">{description}</div>
              )}
              {cta && (
                <a className="vfx-footer-cta" href={cta.href}>
                  {cta.label}
                  <FooterArrow />
                </a>
              )}
            </div>
            {kind !== "phosphor" && navigation}
          </>
        )}
      </div>
      {!before && artwork}
      {kind === "phosphor" && children == null && navigation}
      {(copyright != null || legal.length > 0) && (
        <div className="vfx-footer-legal">
          <span>{copyright}</span>
          {legal.length > 0 && (
            <nav aria-label="Legal">
              {legal.map((link, i) => (
                <a key={`${link.href}-${i}`} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}
    </footer>
  );
}

/** Scalable real text, hidden only from AT because the footer already names the brand. */
export function FooterWordmark({ text }: { text: string }) {
  return (
    <svg
      className="vfx-footer-wordmark"
      viewBox="0 0 1000 210"
      aria-hidden="true"
    >
      <text
        x="500"
        y="179"
        textAnchor="middle"
        fontSize="215"
        textLength="960"
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
    </svg>
  );
}
