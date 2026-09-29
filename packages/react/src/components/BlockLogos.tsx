"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type LogoItem = {
  /** Brand name; doubles as the accessible label for the tile. */
  name: string;
  /** Destination when the tile is activated. */
  href?: string;
  /** Your own mark: an <img>, inline <svg>, or any node. Defaults to a styled wordmark. */
  logo?: ReactNode;
};

export interface BlockLogosProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  logos?: readonly LogoItem[];
  /** Tiles per row on wide screens (default 5). */
  columns?: 3 | 4 | 5 | 6;
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in real customers.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-logos{padding-block:clamp(56px,8cqw,104px)}
.vfx-logos .vfx-block-head{margin-bottom:44px}
.vfx-logos .vfx-block-title{font-size:clamp(26px,3.2cqw,38px)}
.vfx-logos-grid{display:grid;grid-template-columns:repeat(var(--vfx-logo-cols,5),minmax(0,1fr));gap:1px;background:var(--vb-border);border:1px solid var(--vb-border);border-radius:12px;overflow:hidden}
.vfx-logos-tile{display:flex;align-items:center;justify-content:center;min-height:96px;padding:20px 16px;background:var(--vb-card);color:var(--vb-muted);transition:background-color 180ms ease,color 180ms ease}
.vfx-logos-tile:hover{background:var(--vb-raised);color:var(--vb-fg)}
.vfx-logos-tile :where(img,svg,video){filter:grayscale(1);opacity:.55;max-height:40px;transition:filter 180ms ease,opacity 180ms ease}
.vfx-logos-tile:hover :where(img,svg,video){filter:grayscale(0);opacity:1}
.vfx-logos-word{font-size:15px;line-height:1.2;letter-spacing:.01em;font-weight:600;opacity:.55;transition:opacity 180ms ease}
.vfx-logos-tile:hover .vfx-logos-word{opacity:1}
.vfx-logos-tile[data-v="1"] .vfx-logos-word{font:italic 600 16px Georgia,serif}
.vfx-logos-tile[data-v="2"] .vfx-logos-word{font:500 11px/1.2 ui-monospace,"SFMono-Regular",monospace;letter-spacing:.22em;text-transform:uppercase}
.vfx-logos-tile[data-v="3"] .vfx-logos-word{font-weight:200;letter-spacing:.14em;font-size:16px;text-transform:uppercase}
.vfx-logos-tile[data-v="4"] .vfx-logos-word{font-weight:800;letter-spacing:-.03em;font-size:14px;text-transform:uppercase}
.vfx-logos-tile[data-v="0"] .vfx-logos-word{text-transform:lowercase;font-weight:500}
.vfx-logos-mark{margin-top:24px}
@container(max-width:760px){.vfx-logos-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.vfx-logos-tile{min-height:76px}}
@container(max-width:480px){.vfx-logos-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

const DEMO_LOGOS: readonly LogoItem[] = [
  { name: "Fieldnote" },
  { name: "Brightcar", href: "#logo-brightcar" },
  { name: "loopwell" },
  { name: "Arlo Health", href: "#logo-arlo" },
  { name: "Stackform" },
  { name: "Quantelle", href: "#logo-quantelle" },
  { name: "Harborlight" },
  { name: "Tessellate", href: "#logo-tessellate" },
  { name: "Ferroline" },
  { name: "Quietfox", href: "#logo-quietfox" },
];

/**
 * Customer logo wall: a hairline grid of brand tiles that sit desaturated
 * until hover. Provide real marks via logo (an <img> or inline <svg>) or skip
 * them and let each brand render as a styled wordmark — no assets required.
 * Every tile is an optional real link, and the default brands are fictional
 * demo content carrying a visible marker.
 */
export function BlockLogos({
  eyebrow = "Trusted by careful teams",
  title = "In good company.",
  description = "A few of the teams building their release rhythm with Orbit.",
  logos = [],
  columns = 5,
  demoNote = "Brand names and marks shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockLogosProps) {
  const items = logos.length ? logos : DEMO_LOGOS;

  return (
    <section
      className={`vfx-block vfx-logos${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={{ "--vfx-logo-cols": columns, ...blockAccentStyle(accent, style) } as CSSProperties}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            <header className="vfx-block-head vfx-block-head--center">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
              {description ? <p className="vfx-block-lede">{description}</p> : null}
            </header>
            <ul className="vfx-logos-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((logo, index) => (
                <li key={logo.name}>
                  {logo.href ? (
                    <a className="vfx-logos-tile" data-v={index % 5} href={logo.href} aria-label={logo.name}>
                      {logo.logo ?? <span className="vfx-logos-word" aria-hidden="true">{logo.name}</span>}
                    </a>
                  ) : (
                    <div className="vfx-logos-tile" data-v={index % 5}>
                      {logo.logo ?? <span className="vfx-logos-word">{logo.name}</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {demoNote ? <p className="vfx-logos-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
