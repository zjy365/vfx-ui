"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockScene, blockAccentStyle, useInViewOnce } from "./blockShared";

export type ProcessStep = {
  title: string;
  text: ReactNode;
  /** Replaceable media (screenshot, diagram, any node) shown under the copy. */
  media?: ReactNode;
  /** Optional short label replacing the numeric badge text. */
  label?: string;
};

export interface BlockProcessStepsProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  steps?: readonly ProcessStep[];
  /** Call to action rendered under the steps. */
  action?: { label: string; href: string } | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-process-steps{padding-block:clamp(64px,9cqw,112px)}
.vfx-process-steps .vfx-block-head{margin-bottom:52px}
.vfx-process-steps-track{position:relative;display:grid;grid-template-columns:repeat(var(--vfx-steps,3),minmax(0,1fr));gap:28px}
.vfx-process-steps-track::before{content:"";position:absolute;top:24px;left:0;right:0;height:1px;background:var(--vb-border);transform:scaleX(var(--track-progress,1));transform-origin:left;transition:transform 600ms ease}
.vfx-process-step{min-width:0;position:relative}
.vfx-process-step-num{position:relative;display:inline-flex;align-items:center;height:48px;padding-right:18px;background:var(--vb-bg);font:400 36px/1 var(--vb-font);letter-spacing:-.07em;color:var(--vb-fg)}
.vfx-process-step-copy{display:flex;flex-direction:column;gap:14px;padding-top:24px}
.vfx-process-step h3{font-size:22px;font-weight:500;letter-spacing:-.04em;line-height:1.25}.vfx-process-step p{font-size:13px;line-height:1.75;color:var(--vb-muted);min-height:92px;max-width:36ch}
.vfx-process-step-media{position:relative;overflow:hidden;height:340px;border:1px solid var(--vb-border);border-radius:8px;margin-top:16px;background:var(--vb-card)}
.vfx-process-step-media>*{position:absolute;inset:0}.vfx-process-step-media .vfx-scene{padding:16px;min-height:0}.vfx-process-step-media .vfx-scene-top{padding-bottom:12px;font-size:8px}.vfx-process-step-media .vfx-scene-node{padding:8px;width:100%}.vfx-process-step-media .vfx-scene-node b{font-size:9px}.vfx-process-step-media .vfx-scene-node small{font-size:8px}.vfx-process-step-media .vfx-scene-bottom{font-size:7px}.vfx-process-step-media .vfx-scene-event{font-size:9px;padding:12px 0;gap:5px}.vfx-process-step-media .vfx-scene-event time{font-size:7px}.vfx-process-step-media .vfx-scene-canvas{gap:12px;padding:0}.vfx-process-step-media .vfx-scene-node+ .vfx-scene-node::before{height:13px}
.vfx-process-steps[data-revealed="false"] .vfx-process-step{opacity:0;transform:translateY(12px)}.vfx-process-step{transition:opacity 400ms ease,transform 400ms ease}.vfx-process-step:nth-child(2){transition-delay:80ms}.vfx-process-step:nth-child(3){transition-delay:160ms}
@container(max-width:760px){.vfx-process-steps-track{grid-template-columns:1fr;gap:36px}.vfx-process-steps-track::before{display:none}.vfx-process-step{display:grid;grid-template-columns:48px 1fr;gap:16px;padding-top:24px;border-top:1px solid var(--vb-border)}.vfx-process-step-num{font-size:32px}.vfx-process-step-copy{padding-top:6px}.vfx-process-step p{min-height:0}.vfx-process-step-media{max-width:420px;height:320px}}
@media(prefers-reduced-motion:reduce){.vfx-process-steps[data-revealed="false"] .vfx-process-step{opacity:1;transform:none}}
`;

/**
 * Process steps: three to four numbered stages with a connecting line that
 * draws itself in as the section scrolls into view. Steps, copy and media are
 * fully replaceable. On narrow screens the track becomes a vertical timeline.
 * Reduced motion shows the settled layout with no entrance animation.
 */
export function BlockProcessSteps({
  eyebrow = "Getting started",
  title = "Your next release starts here.",
  description = "Three steps. No migration weekend required.",
  steps = [],
  action = { label: "Read the quickstart", href: "#quickstart" },
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockProcessStepsProps) {
  const demoSteps: readonly ProcessStep[] = [
    { title: "Connect your repos", text: "One OAuth flow links GitHub, GitLab or any git remote. Orbit indexes branches, services and owners automatically." },
    { title: "Describe a release", text: "Pick the services, add flags and reviewers, and the release graph assembles itself — dependencies and blast radius included." },
    { title: "Ship and watch", text: "Deploy with staged rollouts. Orbit tracks health against your own metrics and pauses the moment something drifts." },
  ];
  const items = steps.length ? steps : demoSteps;
  const { ref, revealed } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`vfx-block vfx-process-steps${className ? ` ${className}` : ""}`}
      data-revealed={revealed}
      data-scheme={scheme}
      style={{ "--vfx-steps": items.length, "--track-progress": revealed ? 1 : 0, ...blockAccentStyle(accent, style) } as CSSProperties}
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
            <ol className="vfx-process-steps-track" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((step, index) => (
                <li className="vfx-process-step" key={step.title}>
                  <span className="vfx-process-step-num" aria-hidden="true">{step.label ?? String(index + 1).padStart(2, "0")}</span>
                  <div className="vfx-process-step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.media ? <div className="vfx-process-step-media">{step.media}</div> : !steps.length ? (
                      <div className="vfx-process-step-media"><BlockScene variant={index} /></div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            {action ? (
              <div className="vfx-block-actions" style={{ marginTop: "clamp(30px,4vw,44px)" }}>
                <a className="vfx-block-btn vfx-block-btn--ghost" href={action.href}>{action.label}</a>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
