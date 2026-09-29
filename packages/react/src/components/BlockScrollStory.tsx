"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockScene, blockAccentStyle } from "./blockShared";

export type StoryStep = {
  eyebrow?: string;
  title: ReactNode;
  text: ReactNode;
  /** Replace the built-in scene for this step (any node). */
  media?: ReactNode;
};

export interface BlockScrollStoryProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  steps?: readonly StoryStep[];
  /** Flip the media column to the right on desktop. */
  flip?: boolean;
  /** Link scroll-position to the scene; off keeps the first scene static. */
  interactive?: boolean;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-scroll-story{padding-block:clamp(64px,9cqw,112px)}
.vfx-scroll-story .vfx-block-head{margin-bottom:56px}
.vfx-scroll-story-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,7cqw,96px);align-items:start;position:relative}
.vfx-scroll-story[data-flip="true"] .vfx-scroll-story-media{order:2}
.vfx-scroll-story-media{position:sticky;top:104px;height:420px;border:1px solid var(--vb-border);border-radius:10px;overflow:hidden;background:var(--vb-card)}
.vfx-scroll-story-scene{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity 300ms,visibility 300ms}.vfx-scroll-story-scene[data-active="true"]{opacity:1;visibility:visible}.vfx-scroll-story-scene>*{width:100%;height:100%}
.vfx-scroll-story-steps{display:flex;flex-direction:column;counter-reset:story}
.vfx-scroll-story-step{counter-increment:story;position:relative;padding:32px 0 52px 46px;border-top:1px solid var(--vb-border);min-height:250px}
.vfx-scroll-story-step::before{content:counter(story,decimal-leading-zero);position:absolute;left:0;top:34px;color:var(--vb-faint);font:11px ui-monospace,monospace}
.vfx-scroll-story-dot{position:absolute;top:-1px;left:0;width:0;height:2px;background:var(--vb-accent);transition:width 350ms}.vfx-scroll-story-step[data-active="true"] .vfx-scroll-story-dot{width:100%}
.vfx-scroll-story-step .vfx-block-eyebrow{margin-bottom:18px}.vfx-scroll-story-step h3{font-size:clamp(24px,2.9cqw,34px);font-weight:500;letter-spacing:-.045em;line-height:1.15;max-width:16ch;margin-bottom:18px}
.vfx-scroll-story-step>p:not(.vfx-block-eyebrow){font-size:13px;line-height:1.8;color:var(--vb-muted);max-width:40ch}
@container(max-width:760px){.vfx-scroll-story-body{grid-template-columns:1fr;gap:32px}.vfx-scroll-story-media{position:sticky;top:16px;z-index:2;height:270px;box-shadow:0 8px 30px #00000015}.vfx-scroll-story[data-flip="true"] .vfx-scroll-story-media{order:0}.vfx-scroll-story-step{min-height:220px;padding-bottom:36px}.vfx-scroll-story-media .vfx-scene{padding:16px}.vfx-scroll-story-media .vfx-scene-canvas{flex-direction:row;align-items:center;gap:8px;padding:0}.vfx-scroll-story-media .vfx-scene-node{flex-direction:column;padding:12px 8px;width:33%;text-align:center;gap:8px}.vfx-scroll-story-media .vfx-scene-node em{display:none}.vfx-scroll-story-media .vfx-scene-node+ .vfx-scene-node::before{left:auto;right:100%;top:50%;height:1px;width:9px}.vfx-scroll-story-media .vfx-scene-node b{font-size:10px}.vfx-scroll-story-media .vfx-scene-node small{font-size:8px}.vfx-scroll-story-media .vfx-scene-dial{width:140px}.vfx-scroll-story-media .vfx-scene-top{padding-bottom:10px}.vfx-scroll-story-media .vfx-scene-event{padding:10px 0}}
`;

/**
 * Scroll story: a sticky scene on one side and the narrative steps on the
 * other; the scene crossfades as each step crosses the middle of the
 * viewport. On small screens the scene docks (sticky) above the steps so the
 * story still reads end to end. Reduced motion swaps the crossfade for an
 * instant change and keeps every step fully legible.
 */
export function BlockScrollStory({
  eyebrow = "How it feels",
  title = "A release week, told in three scenes.",
  description = "A little structure makes room for better work. Follow one release from idea to done.",
  steps = [],
  flip = false,
  interactive = true,
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockScrollStoryProps) {
  const demoSteps: readonly StoryStep[] = [
    { eyebrow: "Monday", title: "Sketch the week as a graph.", text: "Drop deploys, flags and checklists onto one canvas. Orbit links each node to its owner and its dependencies, so the plan survives contact with reality." },
    { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Release to five percent of traffic. The scene watches error budgets and latency; anything drifting pauses the rollout before anyone files a ticket." },
    { eyebrow: "Friday", title: "Replay it for the team.", text: "The whole week becomes a scrubbable timeline — metrics, logs, deploys and decisions in one replay your stakeholders can read without a walkthrough." },
  ];
  const items = steps.length ? steps : demoSteps;
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!interactive || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = stepRefs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    for (const el of stepRefs.current) el && observer.observe(el);
    return () => observer.disconnect();
  }, [interactive, items.length]);

  return (
    <section
      className={`vfx-block vfx-scroll-story${className ? ` ${className}` : ""}`}
      data-flip={flip}
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
            <div className="vfx-scroll-story-body">
              <div className="vfx-scroll-story-media" aria-hidden="true">
                {items.map((step, index) => (
                  <div className="vfx-scroll-story-scene" data-active={index === active} key={index}>
                    {step.media ?? <BlockScene variant={index} />}
                  </div>
                ))}
              </div>
              <div className="vfx-scroll-story-steps">
                {items.map((step, index) => (
                  <article
                    className="vfx-scroll-story-step"
                    data-active={index === active}
                    key={index}
                    ref={(el) => { stepRefs.current[index] = el; }}
                  >
                    <span className="vfx-scroll-story-dot" aria-hidden="true" />
                    {step.eyebrow ? <p className="vfx-block-eyebrow">{step.eyebrow}</p> : null}
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
