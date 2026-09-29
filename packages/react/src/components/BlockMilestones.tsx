"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle, useInViewOnce } from "./blockShared";

export type Milestone = {
  label: ReactNode;
  /** Optional supporting line under the label. */
  note?: ReactNode;
};

export interface BlockMilestonesProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  milestones?: readonly Milestone[];
  /**
   * Index of the milestone currently in progress. Steps before it count as
   * done and light up; steps after stay dimmed. Defaults to the first step.
   */
  current?: number;
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in your real roadmap.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-milestones{padding-block:clamp(56px,8cqw,104px)}
.vfx-milestones .vfx-block-head{margin-bottom:52px}
.vfx-milestones-track{position:relative}
.vfx-milestones-track>ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(var(--vfx-milestone-cols,4),minmax(0,1fr));gap:24px}
.vfx-milestones-line{position:absolute;left:0;right:0;top:13px;height:1px;background:var(--vb-border)}
.vfx-milestones-fill{position:absolute;left:0;top:12px;height:3px;width:var(--vfx-fill,0%);max-width:100%;background:var(--vb-accent);transition:width 700ms ease}
.vfx-milestones-item{position:relative;display:flex;flex-direction:column;gap:12px;min-width:0;transition:opacity 350ms ease,transform 350ms ease}
.vfx-milestones-dot{display:grid;place-items:center;position:relative;z-index:1;width:27px;height:27px;border-radius:50%;border:1px solid var(--vb-border);background:var(--vb-bg);transition:background-color 300ms ease,border-color 300ms ease,box-shadow 300ms ease;transition-delay:calc(var(--i,0)*140ms)}
.vfx-milestones-item[data-state="done"] .vfx-milestones-dot{background:var(--vb-accent);border-color:var(--vb-accent)}
.vfx-milestones-item[data-state="done"] .vfx-milestones-dot::after{content:"✓";font:600 11px/1 var(--vb-font);color:var(--vb-accent-ink)}
.vfx-milestones-item[data-state="active"] .vfx-milestones-dot{border-color:var(--vb-accent);animation:vfx-milestones-breath 2.2s ease-in-out infinite}
.vfx-milestones-item[data-state="active"] .vfx-milestones-dot::after{content:"";width:9px;height:9px;border-radius:50%;background:var(--vb-accent)}
@keyframes vfx-milestones-breath{0%,100%{box-shadow:0 0 0 4px color-mix(in srgb,var(--vb-accent) 12%,transparent)}50%{box-shadow:0 0 0 8px color-mix(in srgb,var(--vb-accent) 22%,transparent)}}
.vfx-milestones-label{font-size:12px;font-weight:500;letter-spacing:-.01em;line-height:1.5}
.vfx-milestones-item[data-state="upcoming"] .vfx-milestones-label{color:var(--vb-faint);font-weight:400}
.vfx-milestones-note{font-size:11px;line-height:1.6;color:var(--vb-faint)}
.vfx-milestones-mark{margin-top:36px}
/* Entrance: items lift in; done dots fill one after another once revealed. */
.vfx-milestones[data-revealed="false"] .vfx-milestones-item{opacity:0;transform:translateY(8px)}
.vfx-milestones[data-revealed="false"] .vfx-milestones-item[data-state="done"] .vfx-milestones-dot{background:var(--vb-bg);border-color:var(--vb-border)}
.vfx-milestones[data-revealed="false"] .vfx-milestones-item[data-state="done"] .vfx-milestones-dot::after{content:"";width:9px;height:9px;border-radius:50%;background:transparent;border:1px solid var(--vb-border)}
@container(max-width:760px){
  .vfx-milestones-track{padding-left:14px}
  .vfx-milestones-track>ol{grid-template-columns:1fr;gap:0}
  .vfx-milestones-line{left:14px;right:auto;top:0;bottom:0;width:1px;height:auto}
  .vfx-milestones-fill{left:13px;top:0;width:3px;height:var(--vfx-fill,0%);max-height:100%;transition:height 700ms ease}
  .vfx-milestones-item{flex-direction:row;align-items:flex-start;gap:16px;padding-block:14px}
  .vfx-milestones-copy{display:flex;flex-direction:column;gap:5px;min-width:0;padding-top:4px}
}
@media(prefers-reduced-motion:reduce){.vfx-milestones[data-revealed="false"] .vfx-milestones-item{opacity:1;transform:none}}
`;

const DEMO_MILESTONES: readonly Milestone[] = [
  { label: "Private alpha", note: "Ten teams, paper cuts fixed weekly." },
  { label: "Public beta", note: "Open signups, canary automation live." },
  { label: "General availability", note: "Pricing, SSO and audit exports." },
  { label: "Self-hosted", note: "Control plane inside your VPC." },
];

/**
 * Milestone progress: a roadmap strip whose completed steps light up in
 * sequence as it scrolls into view, the current step breathes, and upcoming
 * steps stay dimmed. Which steps are done is pure data — set current to the
 * index in progress. A vertical version renders on narrow screens. The
 * default roadmap is fictional demo content carrying a visible marker.
 */
export function BlockMilestones({
  eyebrow = "Roadmap",
  title = "Where we are in the plan.",
  description = "Four milestones from a garage whiteboard to self-hosted deployments.",
  milestones = [],
  current = 0,
  demoNote = "Roadmap names and notes shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockMilestonesProps) {
  const items = milestones.length ? milestones : DEMO_MILESTONES;
  const { ref, revealed } = useInViewOnce<HTMLElement>();
  const activeIndex = Math.max(0, Math.min(current, items.length - 1));
  const span = Math.max(items.length - 1, 1);
  const fill = revealed ? (activeIndex / span) * 100 : 0;

  return (
    <section
      ref={ref}
      className={`vfx-block vfx-milestones${className ? ` ${className}` : ""}`}
      data-revealed={revealed}
      data-scheme={scheme}
      style={
        {
          "--vfx-milestone-cols": Math.min(items.length, 4),
          "--vfx-fill": `${fill}%`,
          ...blockAccentStyle(accent, style),
        } as CSSProperties
      }
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
            <div className="vfx-milestones-track">
              <span className="vfx-milestones-line" aria-hidden="true" />
              <span className="vfx-milestones-fill" aria-hidden="true" />
              <ol aria-label="Milestone progress">
                {items.map((milestone, index) => {
                  const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "upcoming";
                  return (
                    <li
                      className="vfx-milestones-item"
                      data-state={state}
                      aria-current={state === "active" ? "step" : undefined}
                      style={{ "--i": index } as CSSProperties}
                      key={index}
                    >
                      <span className="vfx-milestones-dot" aria-hidden="true" />
                      <div className="vfx-milestones-copy">
                        <span className="vfx-milestones-label">{milestone.label}</span>
                        {milestone.note ? <span className="vfx-milestones-note">{milestone.note}</span> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            {demoNote ? <p className="vfx-milestones-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
