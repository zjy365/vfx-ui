"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockScene, BlockActionButton, blockAccentStyle, resolveBlockAction, type BlockAction } from "./blockShared";

export type FeatureTab = {
  label: string;
  /** Short line shown under the active tab's copy. */
  description: ReactNode;
  /** Replace the built-in illustration for this tab. */
  media?: ReactNode;
  href?: string;
};

export interface BlockFeatureTabsProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  tabs?: readonly FeatureTab[];
  /** Action rendered under the copy, re-resolved per active tab when tab.href is set. */
  action?: BlockAction | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-feature-tabs{padding-block:clamp(64px,9cqw,112px)}
.vfx-feature-tabs .vfx-block-head{margin-bottom:48px}
.vfx-feature-tabs-body{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:48px;align-items:center}
.vfx-feature-tabs-list{display:flex;flex-direction:column;border-top:1px solid var(--vb-border);counter-reset:feature}
.vfx-feature-tab{counter-increment:feature;position:relative;text-align:left;width:100%;padding:24px 20px 24px 38px;border:0;border-bottom:1px solid var(--vb-border);background:transparent;color:var(--vb-faint);cursor:pointer;font-family:inherit}
.vfx-feature-tab::before{content:counter(feature,decimal-leading-zero);position:absolute;left:0;top:28px;font:10px ui-monospace,monospace;color:var(--vb-faint)}
.vfx-feature-tab-label{font-size:21px;letter-spacing:-.04em;font-weight:500;display:block}
.vfx-feature-tab-hint{display:none;font-size:13px;line-height:1.75;color:var(--vb-muted);margin-top:12px}
.vfx-feature-tab[aria-selected="true"]{color:var(--vb-fg)}.vfx-feature-tab[aria-selected="true"]::before{color:var(--vb-accent)}.vfx-feature-tab[aria-selected="true"] .vfx-feature-tab-hint{display:block}
.vfx-feature-tab:hover{color:var(--vb-fg)}
.vfx-feature-tabs-stage{position:relative;min-height:480px;border:1px solid var(--vb-border);border-radius:12px;overflow:hidden;background:var(--vb-card)}
.vfx-feature-tabs-panel{display:flex;flex-direction:column-reverse;min-height:480px}
.vfx-feature-tabs-art{position:relative;flex:1;min-height:320px;padding:20px 28px 0;overflow:hidden}.vfx-feature-tabs-art>.vfx-scene{border:1px solid var(--vb-border);border-radius:8px;min-height:310px;box-shadow:0 8px 24px #0000000d}
.vfx-feature-tabs-art>img,.vfx-feature-tabs-art>video{width:100%;height:310px;object-fit:cover}
.vfx-feature-tabs-copy{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px;padding:24px 28px;background:var(--vb-card)}
.vfx-feature-tabs-copy>p:not(.vfx-block-eyebrow){font-size:12px;line-height:1.7;color:var(--vb-muted);max-width:40ch}.vfx-feature-tabs-copy .vfx-block-eyebrow{grid-column:1/-1}
.vfx-feature-tabs-copy .vfx-block-btn{min-height:36px;padding:10px 12px;font-size:11px}
@container(max-width:760px){.vfx-feature-tabs-body{grid-template-columns:1fr;gap:24px}.vfx-feature-tabs-list{flex-direction:row;border-top:0;border-bottom:1px solid var(--vb-border);overflow-x:auto}.vfx-feature-tab{padding:14px 20px;flex:1;min-width:80px;border:0;white-space:nowrap}.vfx-feature-tab-label{font-size:14px}.vfx-feature-tab::before,.vfx-feature-tab-hint,.vfx-feature-tab[aria-selected="true"] .vfx-feature-tab-hint{display:none}.vfx-feature-tab[aria-selected="true"]{box-shadow:inset 0 -2px var(--vb-accent)}.vfx-feature-tabs-stage,.vfx-feature-tabs-panel{min-height:420px}.vfx-feature-tabs-copy{grid-template-columns:1fr}.vfx-feature-tabs-art{padding:16px 16px 0}.vfx-feature-tabs-copy{padding:20px}}
`;

/**
 * Interactive feature tabs: the tab list, copy and stage illustration switch
 * together. Implements the WAI-ARIA tabs pattern (roving tabindex, horizontal
 * arrow keys, Home/End) and degrades to a horizontally scrollable tab strip
 * above the stage on small screens. Touch just taps; reduced motion drops the
 * transitions.
 */
export function BlockFeatureTabs({
  eyebrow = "Inside the product",
  title = "Every part of the release. In reach.",
  description = "Tab through the surfaces your team lives in every release week.",
  tabs = [],
  action = { label: "Explore the docs", href: "#docs" },
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockFeatureTabsProps) {
  const demoTabs: readonly FeatureTab[] = [
    { label: "Plan", description: "Sketch the release as a graph. Move a node and every dependent date recomputes — no spreadsheet gymnastics." },
    { label: "Ship", description: "Flip flags with staged rollouts. Orbit watches error budgets and pauses the rollout before users notice." },
    { label: "Review", description: "Afterwards, replay the whole week: metrics, logs and deploys on one scrubbable timeline." },
    { label: "Share", description: "Publish a live snapshot to stakeholders — read-only, always current, no screenshot archaeology." },
  ];
  const items = tabs.length ? tabs : demoTabs;
  const instanceId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = items[active];
  const tabAction = current?.href ? { label: action?.label ?? "Learn more", href: current.href } : action ? resolveBlockAction(action) : undefined;

  return (
    <section
      className={`vfx-block vfx-feature-tabs${className ? ` ${className}` : ""}`}
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
            <div className="vfx-feature-tabs-body">
              <div className="vfx-feature-tabs-list" role="tablist" aria-label="Product surfaces" aria-orientation="vertical">
                {items.map((tab, index) => (
                  <button
                    type="button"
                    role="tab"
                    id={`${instanceId}-tab-${index}`}
                    aria-selected={index === active}
                    aria-controls={`${instanceId}-panel-${index}`}
                    tabIndex={index === active ? 0 : -1}
                    className="vfx-feature-tab"
                    key={tab.label}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    onClick={() => setActive(index)}
                    onKeyDown={onKeyDown}
                  >
                    <span className="vfx-feature-tab-label">{tab.label}</span>
                    <span className="vfx-feature-tab-hint">{tab.description}</span>
                  </button>
                ))}
              </div>
              <div
                className="vfx-feature-tabs-stage"
                id={`${instanceId}-panel-${active}`}
                role="tabpanel"
                aria-labelledby={`${instanceId}-tab-${active}`}
                tabIndex={0}
              >
                {current && (
                  <div className="vfx-feature-tabs-panel" key={active}>
                    <div className="vfx-feature-tabs-copy">
                      <p className="vfx-block-eyebrow" style={{ fontSize: 11 }}>{current.label}</p>
                      <p>{current.description}</p>
                      {tabAction ? (
                        <div className="vfx-block-actions">
                          <BlockActionButton action={tabAction} variant="accent" />
                        </div>
                      ) : null}
                    </div>
                    <div className="vfx-feature-tabs-art">{current.media ?? <BlockScene variant={active} label={current.label.toUpperCase() + " / WORKSPACE"} />}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
