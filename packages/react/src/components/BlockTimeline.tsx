"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle, useInViewOnce } from "./blockShared";

export type TimelineEvent = {
  /** Period or date label, e.g. "2024 Q2". */
  when: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  /** Small chip tagging the event (e.g. "Funding"). */
  tag?: string;
};

export interface BlockTimelineProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  events?: readonly TimelineEvent[];
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in your real history.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-timeline{padding-block:clamp(64px,9cqw,112px)}
.vfx-timeline .vfx-block-head{margin-bottom:56px}
.vfx-timeline-track{position:relative}
.vfx-timeline-track>ol{list-style:none;margin:0;padding:0}
.vfx-timeline-rail{position:absolute;left:11px;top:8px;bottom:8px;width:2px;background:var(--vb-accent);scale:1 var(--track-progress,1);transform-origin:top;transition:scale 900ms ease}
.vfx-timeline-item{position:relative;display:grid;grid-template-columns:24px 1fr;gap:0 20px;padding-bottom:44px}
.vfx-timeline-item:last-child{padding-bottom:0}
.vfx-timeline-dot{position:relative;z-index:1;width:24px;height:24px;display:grid;place-items:center}
.vfx-timeline-dot::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--vb-accent);box-shadow:0 0 0 4px var(--vb-bg),0 0 0 5px var(--vb-border)}
.vfx-timeline-body{display:flex;flex-direction:column;gap:8px;min-width:0;padding-top:1px}
.vfx-timeline-when{font:500 10px/1.4 ui-monospace,"SFMono-Regular",monospace;letter-spacing:.09em;text-transform:uppercase;color:var(--vb-muted)}
.vfx-timeline-item h3{font-size:19px;font-weight:500;letter-spacing:-.03em;line-height:1.3}
.vfx-timeline-item p{font-size:13px;line-height:1.75;color:var(--vb-muted);max-width:56ch}
.vfx-timeline-tag{width:fit-content;padding:4px 8px;border:1px solid var(--vb-border);border-radius:4px;font:9px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--vb-faint)}
.vfx-timeline-mark{margin-top:40px}
.vfx-timeline[data-revealed="false"] .vfx-timeline-item{opacity:0;transform:translateY(10px)}
.vfx-timeline-item{transition:opacity 400ms ease,transform 400ms ease}
.vfx-timeline-item:nth-child(2){transition-delay:90ms}.vfx-timeline-item:nth-child(3){transition-delay:180ms}.vfx-timeline-item:nth-child(4){transition-delay:270ms}.vfx-timeline-item:nth-child(5){transition-delay:360ms}.vfx-timeline-item:nth-child(6){transition-delay:450ms}.vfx-timeline-item:nth-child(7){transition-delay:540ms}.vfx-timeline-item:nth-child(8){transition-delay:630ms}
@container(min-width:860px){
  .vfx-timeline-rail{left:50%;translate:-50% 0;width:1px}
  .vfx-timeline-item{grid-template-columns:1fr 48px 1fr;gap:0 28px;padding-bottom:56px}
  .vfx-timeline-item:nth-child(odd) .vfx-timeline-cell{grid-column:1;text-align:right;justify-items:end}
  .vfx-timeline-item:nth-child(odd) .vfx-timeline-body{align-items:flex-end}
  .vfx-timeline-item:nth-child(odd) p{max-width:38ch}
  .vfx-timeline-item:nth-child(even) .vfx-timeline-cell{grid-column:3}
  .vfx-timeline-dot{grid-column:2;grid-row:1;justify-self:center}
  .vfx-timeline-when{margin-top:2px}
}
@media(prefers-reduced-motion:reduce){.vfx-timeline[data-revealed="false"] .vfx-timeline-item{opacity:1;transform:none}.vfx-timeline[data-revealed="false"] .vfx-timeline-rail{scale:1 1}}
`;

const DEMO_EVENTS: readonly TimelineEvent[] = [
  { when: "2023 · Spring", title: "A garage, a whiteboard, one graph", text: "Two engineers keep losing track of which service owns which rollout. The first version of the release graph is drawn on paper.", tag: "Origins" },
  { when: "2023 · Autumn", title: "First ten teams", text: "A friends-and-family beta ships the graph as a product. Ten teams join, nine stay, and the tenth sends a very useful bug report.", tag: "Beta" },
  { when: "2024 · Spring", title: "Canary automation", text: "Rollouts learn to watch metrics and pause themselves. The Friday deploy becomes boring, in the best way.", tag: "Product" },
  { when: "2024 · Autumn", title: "Seed round", text: "Harborlight leads a small round. The team doubles to six people and a much better coffee setup.", tag: "Funding" },
  { when: "2025 · Spring", title: "Replays for everyone", text: "Ninety days of release history becomes standard on every plan, not just enterprise.", tag: "Product" },
  { when: "2026 · Today", title: "Self-hosted control plane", text: "Enterprise teams run the whole graph inside their own VPC. Nothing leaves the building.", tag: "Shipping" },
];

/**
 * Company or product timeline: a vertical rail that draws itself in as the
 * section scrolls into view, alternating left/right on wide screens and
 * collapsing to a single rail on small ones. Events, dates and tags are all
 * replaceable; the default history is fictional demo content carrying a
 * visible marker. Reduced motion shows the settled timeline immediately.
 */
export function BlockTimeline({
  eyebrow = "Timeline",
  title = "How we got here.",
  description = "Three years of turning release chaos into a map you can read.",
  events = [],
  demoNote = "Dates and events shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockTimelineProps) {
  const items = events.length ? events : DEMO_EVENTS;
  const { ref, revealed } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`vfx-block vfx-timeline${className ? ` ${className}` : ""}`}
      data-revealed={revealed}
      data-scheme={scheme}
      style={{ "--track-progress": revealed ? 1 : 0, ...blockAccentStyle(accent, style) } as CSSProperties}
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
            <div className="vfx-timeline-track">
              <span className="vfx-timeline-rail" aria-hidden="true" />
              <ol>
                {items.map((event) => (
                  <li className="vfx-timeline-item" key={`${String(event.when)}-${String(event.title)}`}>
                    <span className="vfx-timeline-dot" aria-hidden="true" />
                    <div className="vfx-timeline-cell vfx-timeline-body">
                      <span className="vfx-timeline-when">{event.when}</span>
                      <h3>{event.title}</h3>
                      {event.text ? <p>{event.text}</p> : null}
                      {event.tag ? <span className="vfx-timeline-tag">{event.tag}</span> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {demoNote ? <p className="vfx-timeline-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
