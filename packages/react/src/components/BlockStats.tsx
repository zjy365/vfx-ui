"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle, useInViewOnce } from "./blockShared";

export type StatItem = {
  /** Final number; counts up from zero when the band scrolls into view. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places kept during and after the count-up (default 0). */
  decimals?: number;
  /** Replace the default prefix + grouped number + suffix formatting. */
  format?: (value: number) => string;
  label: ReactNode;
  description?: ReactNode;
};

export interface BlockStatsProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  stats?: readonly StatItem[];
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in real numbers.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-stats{padding-block:clamp(56px,8cqw,104px)}
.vfx-stats .vfx-block-head{margin-bottom:48px}
.vfx-stats-row{display:grid;grid-template-columns:repeat(var(--vfx-stat-cols,4),minmax(0,1fr))}
.vfx-stat{display:flex;flex-direction:column;gap:10px;padding:8px 28px;border-left:1px solid var(--vb-border)}
.vfx-stat:first-child{border-left:0;padding-left:0}
.vfx-stat-value{font-size:clamp(38px,4.6cqw,60px);font-weight:400;letter-spacing:-.06em;line-height:1;font-variant-numeric:tabular-nums;color:var(--vb-fg);order:1}
.vfx-stat-value small{font-size:.5em;color:var(--vb-muted);letter-spacing:0}
.vfx-stat-label{font-size:12px;font-weight:500;letter-spacing:.01em;order:2}
.vfx-stat-description{font-size:11px;line-height:1.6;color:var(--vb-faint);max-width:24ch;order:3}
.vfx-stats-mark{margin-top:36px}
.vfx-stats .vfx-sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.vfx-stats[data-revealed="false"] .vfx-stat{opacity:0;transform:translateY(10px)}
.vfx-stat{transition:opacity 400ms ease,transform 400ms ease}
.vfx-stat:nth-child(2){transition-delay:60ms}.vfx-stat:nth-child(3){transition-delay:120ms}.vfx-stat:nth-child(4){transition-delay:180ms}
@container(max-width:760px){.vfx-stats-row{grid-template-columns:1fr 1fr;gap:28px 0}.vfx-stat:nth-child(3){border-left:0;padding-left:0}}
@container(max-width:480px){.vfx-stats-row{grid-template-columns:1fr}.vfx-stat{border-left:0;padding-left:0}}
@media(prefers-reduced-motion:reduce){.vfx-stats[data-revealed="false"] .vfx-stat{opacity:1;transform:none}}
`;

const DEMO_STATS: readonly StatItem[] = [
  { value: 128, suffix: "ms", label: "Median deploy window", description: "From merge to production, fleet-wide." },
  { value: 99.98, decimals: 2, suffix: "%", label: "Rollouts completed clean", description: "The rest were caught by a canary pause." },
  { value: 3200, label: "Teams shipping weekly", description: "From two-person studios to platform orgs." },
  { value: 14, label: "Minutes to first graph", description: "Connect a repo, watch the map assemble." },
];

function formatStat(stat: StatItem, value: number): string {
  if (stat.format) return stat.format(value);
  const rounded = Number(value.toFixed(stat.decimals ?? 0));
  return `${stat.prefix ?? ""}${rounded.toLocaleString("en-US", {
    minimumFractionDigits: stat.decimals ?? 0,
    maximumFractionDigits: stat.decimals ?? 0,
  })}${stat.suffix ?? ""}`;
}

/**
 * Stats band: numbers count up from zero when the section scrolls into view,
 * with a settled, screen-reader-friendly final value always present. Numbers,
 * prefixes, suffixes and formatting are all props; the defaults are fictional
 * demo content carrying a visible marker. Reduced motion shows the final
 * figures immediately.
 */
export function BlockStats({
  eyebrow,
  title,
  description,
  stats = [],
  demoNote = "Figures shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockStatsProps) {
  const items = stats.length ? stats : DEMO_STATS;
  const { ref, revealed } = useInViewOnce<HTMLElement>();
  // Starts settled (SSR and no-JS see final figures); the count-up re-arms it.
  const [progress, setProgress] = useState(1);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!revealed || ranOnce.current) return;
    ranOnce.current = true;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }
    setProgress(0);
    let frame = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [revealed]);

  const eased = progress;

  return (
    <section
      ref={ref}
      className={`vfx-block vfx-stats${className ? ` ${className}` : ""}`}
      data-revealed={revealed}
      data-scheme={scheme}
      style={{ "--vfx-stat-cols": Math.min(items.length, 4), ...blockAccentStyle(accent, style) } as CSSProperties}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            {eyebrow || title != null || description ? (
              <header className="vfx-block-head">
                {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
                {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
                {description ? <p className="vfx-block-lede">{description}</p> : null}
              </header>
            ) : null}
            <dl className="vfx-stats-row" style={{ margin: 0 }}>
              {items.map((stat, index) => {
                const final = formatStat(stat, stat.value);
                return (
                  <div className="vfx-stat" key={index}>
                    <dt className="vfx-stat-label">{stat.label}</dt>
                    <dd className="vfx-stat-value" style={{ margin: 0 }}>
                      <span aria-hidden="true">{formatStat(stat, stat.value * eased)}</span>
                      <span className="vfx-sr-only">{final}</span>
                    </dd>
                    {stat.description ? (
                      <p className="vfx-stat-description">{stat.description}</p>
                    ) : null}
                  </div>
                );
              })}
            </dl>
            {demoNote ? <p className="vfx-stats-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
