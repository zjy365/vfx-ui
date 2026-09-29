"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockScene, blockAccentStyle } from "./blockShared";

export type FeatureGridItem = {
  title: string;
  description: ReactNode;
  /** Optional glyph node (an SVG icon, emoji, or anything visual). */
  icon?: ReactNode;
  /** Optional media node shown above the copy (featured card grows to fit it). */
  media?: ReactNode;
  href?: string;
  /** The first item is featured by default; set featured:false on it to opt out. */
  featured?: boolean;
};

export interface BlockFeatureGridProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  items?: readonly FeatureGridItem[];
  /** "bento" leads with one large card; "even" lays all cards out equally. */
  layout?: "bento" | "even";
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-feature-grid{padding-block:clamp(64px,9cqw,112px)}
.vfx-feature-grid .vfx-block-head{margin-bottom:48px}
.vfx-feature-grid-cells{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;border-top:1px solid var(--vb-border);border-left:1px solid var(--vb-border)}
.vfx-feature-cell{position:relative;display:flex;flex-direction:column;gap:14px;min-width:0;padding:32px;border-right:1px solid var(--vb-border);border-bottom:1px solid var(--vb-border);background:var(--vb-bg);transition:background 180ms}
.vfx-feature-cell:has(a):hover{background:var(--vb-card)}
.vfx-feature-cell-hit{position:absolute;inset:0;z-index:3}.vfx-feature-cell-hit::after{content:"↗";position:absolute;right:24px;top:24px;font-size:20px;color:var(--vb-muted)}
.vfx-feature-cell-glyph{display:grid;place-items:center;width:36px;height:36px;margin-bottom:16px;color:var(--vb-muted)}.vfx-feature-cell-glyph svg{width:26px;height:26px}
.vfx-feature-cell h3{font-size:20px;line-height:1.3;letter-spacing:-.035em;font-weight:500}
.vfx-feature-cell p{font-size:14px;line-height:1.75;color:var(--vb-muted);max-width:45ch}
.vfx-feature-cell--featured{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:36px;padding:0;background:var(--vb-card)}
.vfx-feature-cell--featured .vfx-feature-cell-copy{padding:44px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.vfx-feature-cell--featured h3{font-size:30px;max-width:15ch;line-height:1.12}
.vfx-feature-cell--featured .vfx-feature-cell-glyph{margin:0}
.vfx-feature-cell-media{position:relative;min-height:200px;overflow:hidden;border:1px solid var(--vb-border);border-radius:8px;margin-top:10px}
.vfx-feature-cell--featured .vfx-feature-cell-media{border:0;border-radius:0;min-height:330px;margin:0;border-left:1px solid var(--vb-border)}
.vfx-feature-grid[data-layout="even"] .vfx-feature-grid-cells{grid-template-columns:repeat(3,minmax(0,1fr))}
@container(max-width:760px){.vfx-feature-cell--featured{grid-template-columns:1fr;gap:0}.vfx-feature-cell--featured .vfx-feature-cell-copy{padding:28px}.vfx-feature-cell--featured .vfx-feature-cell-media{border-left:0;border-top:1px solid var(--vb-border);min-height:280px}.vfx-feature-grid[data-layout="even"] .vfx-feature-grid-cells{grid-template-columns:repeat(2,minmax(0,1fr))}.vfx-feature-cell{padding:24px}.vfx-feature-cell--featured{padding:0}}
@container(max-width:480px){.vfx-feature-grid-cells,.vfx-feature-grid[data-layout="even"] .vfx-feature-grid-cells{grid-template-columns:1fr}}
`;

const GLYPHS = [
  // Simple inline glyphs keep the grid legible without an icon dependency.
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" key="g0"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2Z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" key="g1"><path d="M4 17.5 9.5 12l3.5 3.5L20 8" /><path d="M14.5 8H20v5.5" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" key="g2"><rect x="3.5" y="4" width="17" height="13" rx="2.5" /><path d="M8 21h8M12 17.5V21" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" key="g3"><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M5.6 5.6l2.3 2.3M16.1 16.1l2.3 2.3M18.4 5.6l-2.3 2.3M7.9 16.1l-2.3 2.3" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" key="g4"><path d="M12 21s-7.5-4.6-9.5-9A5.4 5.4 0 0 1 12 6.7 5.4 5.4 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9Z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" key="g5"><path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.5l6.4-.6L12 3Z" /></svg>,
];

/** Feature grid with real hierarchy: one bento feature card plus supporting cells. */
export function BlockFeatureGrid({
  eyebrow = "Why Orbit",
  title = "Less managing. More making.",
  description = "The small details that make a big difference, from the first commit to the final handoff.",
  items = [],
  layout = "bento",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockFeatureGridProps) {
  const demoItems: readonly FeatureGridItem[] = [
    {
      title: "A release graph, not a timeline",
      description: "Every deploy, flag and rollback lives on one canvas. Drag a node to re-plan the week; the graph recomputes instantly.",
      featured: true,
      media: <BlockScene />,
    },
    { title: "Flags that explain themselves", description: "Each flag carries its owner, rollout and expiry — surfaced before it becomes archaeology." },
    { title: "Replays for every incident", description: "Timeline scrubs through metrics, logs and deploys together, so review takes minutes." },
    { title: "Works with your stack", description: "First-class integrations for GitHub, Linear, Slack and Datadog — or bring your own webhook." },
    { title: "Private by default", description: "SOC 2 Type II posture, regional data residency, and audit trails on every plan." },
  ];
  const cells = items.length ? items : demoItems;
  const featuredIndex = layout === "bento" ? cells.findIndex((item, index) => item.featured !== false && index === 0 || item.featured === true) : -1;

  return (
    <section
      className={`vfx-block vfx-feature-grid${className ? ` ${className}` : ""}`}
      data-layout={layout}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            <header className="vfx-block-head">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
              {description ? <p className="vfx-block-lede">{description}</p> : null}
            </header>
            <div className="vfx-feature-grid-cells">
              {cells.map((item, index) => {
                const featured = index === featuredIndex;
                const glyph = item.icon ?? GLYPHS[index % GLYPHS.length];
                const copy = (
                  <>
                    <span className="vfx-feature-cell-glyph" aria-hidden="true">{glyph}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </>
                );
                return featured ? (
                  <article className="vfx-feature-cell vfx-feature-cell--featured" key={item.title}>
                    <div className="vfx-feature-cell-copy">{copy}</div>
                    {item.media ? <div className="vfx-feature-cell-media">{item.media}</div> : null}
                  </article>
                ) : (
                  <article className="vfx-feature-cell" key={item.title}>
                    {item.href ? <a className="vfx-feature-cell-hit" href={item.href} aria-label={item.title} /> : null}
                    {item.media ? <div className="vfx-feature-cell-media">{item.media}</div> : null}
                    {copy}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
