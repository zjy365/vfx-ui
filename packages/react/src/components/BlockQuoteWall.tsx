"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type WallQuote = {
  quote: ReactNode;
  name: string;
  /** Role / company line under the name. */
  role?: ReactNode;
};

export interface BlockQuoteWallProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  quotes?: readonly WallQuote[];
  /** "wall" pins quotes in masonry columns; "rotate" cycles one at a time. */
  mode?: "wall" | "rotate";
  /** Rotation interval in milliseconds (rotate mode only, default 6000). */
  interval?: number;
  /** Pause rotation while hovering or focusing the rotor (default true). */
  pauseOnHover?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  carouselLabel?: string;
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in real quotes.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-quotewall{padding-block:clamp(64px,9cqw,112px)}
.vfx-quotewall .vfx-block-head{margin-bottom:52px}
/* Wall mode: masonry columns with alternating emphasis for rhythm. */
.vfx-quotewall-wall{columns:3;column-gap:18px}
.vfx-quote{break-inside:avoid;display:flex;flex-direction:column;gap:20px;margin:0 0 18px;padding:26px 24px;background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius);transition:transform 180ms ease,border-color 180ms ease}
.vfx-quote:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--vb-accent) 40%,var(--vb-border))}
.vfx-quote blockquote{margin:0;font-size:13px;line-height:1.8;letter-spacing:-.015em;color:var(--vb-muted)}
.vfx-quotewall-wall .vfx-quote:nth-child(3n+1) blockquote{font-size:16px;line-height:1.65;color:var(--vb-fg)}
.vfx-quote-person{display:flex;align-items:center;gap:11px;margin-top:auto}
.vfx-quote-avatar{display:grid;place-items:center;width:32px;height:32px;flex:none;border-radius:50%;border:1px solid var(--vb-border);background:var(--vb-raised);font:11px ui-monospace,"SFMono-Regular",monospace;color:var(--vb-muted)}
.vfx-quote-name{display:block;font-size:12px;font-weight:500;line-height:1.5}
.vfx-quote-role{display:block;font-size:10px;color:var(--vb-faint);line-height:1.6}
/* Rotate mode: stacked slides, one visible; controls below. */
.vfx-quotewall-rotor{display:grid}
.vfx-quotewall-slide{grid-area:1/1;display:flex;flex-direction:column;gap:26px;padding:clamp(28px,4cqw,44px);border:1px solid var(--vb-border);border-radius:var(--vb-radius);background:var(--vb-card);opacity:0;visibility:hidden;translate:0 10px;transition:opacity 420ms ease,translate 420ms ease,visibility 0s 420ms}
.vfx-quotewall-slide[data-active="true"]{opacity:1;visibility:visible;translate:0 0;transition:opacity 420ms ease,translate 420ms ease,visibility 0s 0s}
.vfx-quotewall-slide blockquote{margin:0;font-size:clamp(20px,2.6cqw,30px);line-height:1.45;letter-spacing:-.03em;max-width:44ch;text-wrap:pretty}
.vfx-quotewall-controls{display:flex;align-items:center;gap:12px;margin-top:20px}
.vfx-quotewall-controls button{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--vb-border);border-radius:8px;background:var(--vb-card);color:var(--vb-fg);cursor:pointer;transition:border-color 160ms}
.vfx-quotewall-controls button:hover{border-color:var(--vb-accent)}
.vfx-quotewall-controls svg{width:14px;height:14px}
.vfx-quotewall-count{font:10px ui-monospace,monospace;color:var(--vb-faint);letter-spacing:.08em}
.vfx-quotewall-mark{margin-top:32px}
@container(max-width:900px){.vfx-quotewall-wall{columns:2}}
@container(max-width:560px){.vfx-quotewall-wall{columns:1}}
@media(prefers-reduced-motion:reduce){.vfx-quote:hover{transform:none}.vfx-quotewall-slide{transition:none}}
`;

const DEMO_QUOTES: readonly WallQuote[] = [
  { quote: "The replay is the status update. Our Friday review went from an hour to fifteen minutes.", name: "Mara Ellison", role: "Head of Platform, Fieldnote (demo)" },
  { quote: "Adoption was the surprise. Teams that ignored the old wiki check the graph daily.", name: "Priya Raman", role: "VP Engineering, loopwell (demo)" },
  { quote: "It reads our repo better than we do. Ownership edges appeared that nobody remembered to document.", name: "June Park", role: "Engineering Manager, Stackform (demo)" },
  { quote: "Auditors asked for our release trail. We exported it in one click and the conversation ended there.", name: "Jonas Feld", role: "CTO, Arlo Health (demo)" },
  { quote: "The canary pause caught a regression our dashboards never surfaced. That Friday paid for the year.", name: "Deniz Okafor", role: "Staff Engineer, Brightcar (demo)" },
  { quote: "Migrating took an afternoon. The next week another team told us their migration took an afternoon too.", name: "Tomás Rivera", role: "Platform Lead, Quantelle (demo)" },
];

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "•"
  );
}

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "prev" ? <path d="M9 2 4 7l5 5" /> : <path d="M5 2l5 5-5 5" />}
    </svg>
  );
}

/**
 * Quote wall: many quotes as a masonry wall, or one quote at a time in a
 * keyboard-friendly rotator (real prev/next controls, focus and hover pause
 * the rotation, and prefers-reduced-motion turns auto-advance off entirely).
 * Quotes, people and roles are props; the defaults are fictional demo
 * content carrying a visible marker.
 */
export function BlockQuoteWall({
  eyebrow = "In their words",
  title = "Field notes from release teams.",
  description = "Six teams, six shipping habits, one shared observation: the graph makes coordination boring.",
  quotes = [],
  mode = "wall",
  interval = 6000,
  pauseOnHover = true,
  previousLabel = "Previous quote",
  nextLabel = "Next quote",
  carouselLabel = "Team quotes",
  demoNote = "All quotes, people and companies on this page are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockQuoteWallProps) {
  const items = quotes.length ? quotes : DEMO_QUOTES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (index > items.length - 1) setIndex(0);
  }, [index, items.length]);

  useEffect(() => {
    if (mode !== "rotate" || paused || reducedMotion || items.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [mode, paused, reducedMotion, interval, items.length]);

  const active = Math.min(index, items.length - 1);

  return (
    <section
      className={`vfx-block vfx-quotewall${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
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
            {mode === "wall" ? (
              <div className="vfx-quotewall-wall">
                {items.map((item) => (
                  <figure className="vfx-quote" key={item.name}>
                    <blockquote>“{item.quote}”</blockquote>
                    <figcaption className="vfx-quote-person">
                      <span className="vfx-quote-avatar" aria-hidden="true">{initialsOf(item.name)}</span>
                      <span>
                        <span className="vfx-quote-name">{item.name}</span>
                        {item.role ? <span className="vfx-quote-role">{item.role}</span> : null}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div
                className="vfx-quotewall-rotor"
                role="group"
                aria-roledescription="carousel"
                aria-label={carouselLabel}
                onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
                onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
                onFocusCapture={pauseOnHover ? () => setPaused(true) : undefined}
                onBlurCapture={pauseOnHover ? () => setPaused(false) : undefined}
              >
                {items.map((item, itemIndex) => (
                  <figure
                    className="vfx-quotewall-slide"
                    data-active={itemIndex === active}
                    aria-roledescription="slide"
                    aria-label={`${itemIndex + 1} of ${items.length}`}
                    key={item.name}
                  >
                    <blockquote>“{item.quote}”</blockquote>
                    <figcaption className="vfx-quote-person">
                      <span className="vfx-quote-avatar" aria-hidden="true">{initialsOf(item.name)}</span>
                      <span>
                        <span className="vfx-quote-name">{item.name}</span>
                        {item.role ? <span className="vfx-quote-role">{item.role}</span> : null}
                      </span>
                    </figcaption>
                  </figure>
                ))}
                <div className="vfx-quotewall-controls">
                  <button type="button" onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)} aria-label={previousLabel}>
                    <ArrowIcon direction="prev" />
                  </button>
                  <button type="button" onClick={() => setIndex((current) => (current + 1) % items.length)} aria-label={nextLabel}>
                    <ArrowIcon direction="next" />
                  </button>
                  <span className="vfx-quotewall-count" aria-hidden="true">
                    {active + 1} / {items.length}
                  </span>
                </div>
              </div>
            )}
            {demoNote ? <p className="vfx-quotewall-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
