"use client";

import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export interface BlockComparisonProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** The "before" layer (bottom). Defaults to a flat, untreated demo panel. */
  before?: ReactNode;
  /** The "after" layer (top, revealed by the handle). Defaults to a treated demo panel. */
  after?: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Handle position in percent, 0–100. */
  defaultPosition?: number;
  /** Accessible description of what the comparison shows. */
  caption?: string;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-comparison{padding-block:clamp(64px,9cqw,112px)}
.vfx-comparison .vfx-block-head{margin-bottom:48px}
.vfx-comparison-stage{position:relative;width:100%;max-width:100%;aspect-ratio:16/9;min-height:240px;border:1px solid var(--vb-border);border-radius:10px;overflow:hidden;isolation:isolate;touch-action:pan-y;background:var(--vb-card)}
.vfx-comparison-layer{position:absolute;inset:0}.vfx-comparison-layer--after{clip-path:inset(0 0 0 var(--vfx-pos,50%))}.vfx-comparison-layer>*{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vfx-comparison-handle{position:absolute;top:0;bottom:0;left:var(--vfx-pos,50%);width:2px;transform:translateX(-1px);background:#fff;z-index:3;pointer-events:none;box-shadow:0 0 12px #00000025}
.vfx-comparison-grip{position:absolute;top:50%;left:50%;translate:-50% -50%;display:grid;place-items:center;width:40px;height:52px;border-radius:7px;background:#fff;color:#222;box-shadow:0 3px 12px #00000025}.vfx-comparison-grip svg{width:18px;height:18px}
.vfx-comparison-chip{position:absolute;z-index:2;top:16px;padding:6px 10px;border-radius:4px;background:#ffffffdf;color:#252620;font:9px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.06em}.vfx-comparison-chip--before{left:16px}.vfx-comparison-chip--after{right:16px}
.vfx-comparison-range{position:absolute;inset:0;z-index:4;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;appearance:none;background:transparent}.vfx-comparison-range::-webkit-slider-thumb{appearance:none;width:40px;height:100%}.vfx-comparison-range::-moz-range-thumb{width:40px;height:100%;border:0;border-radius:0;background:transparent}.vfx-comparison-stage:has(.vfx-comparison-range:focus-visible){outline:2px solid var(--vb-accent);outline-offset:4px}
.vfx-comparison-note{margin-top:18px;font:10px/1.7 ui-monospace,monospace;text-align:center;color:var(--vb-faint)!important}
.vfx-compare-before,.vfx-compare-after{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;padding:10%;overflow:hidden}
.vfx-compare-before{background:#e3e5e8;color:#444}.vfx-compare-after{background:#e7eadb;color:#23311d}
.vfx-compare-wordmark{position:absolute;top:10%;left:10%;font-size:12px;font-weight:600;letter-spacing:-.03em}.vfx-compare-before .vfx-compare-wordmark{font:11px Arial,sans-serif}
.vfx-compare-copy{position:relative;z-index:1;display:flex;flex-direction:column;gap:16px;max-width:260px}
.vfx-compare-copy strong{font:400 clamp(24px,4.8cqw,56px)/1.02 Georgia,serif;letter-spacing:-.045em}.vfx-compare-copy small{font-size:10px;line-height:1.6;max-width:25ch}.vfx-compare-copy em{font:10px var(--vb-font);padding:10px 14px;width:fit-content;border:1px solid currentColor;border-radius:3px;margin-top:4px}
.vfx-compare-before .vfx-compare-copy strong{font:700 clamp(20px,3.3cqw,38px)/1.15 Arial,sans-serif;letter-spacing:0}.vfx-compare-before .vfx-compare-copy em{background:#697381;color:white;border:0;border-radius:0}
.vfx-compare-object{position:relative;width:65%;aspect-ratio:.66;margin:auto;border-radius:8px 8px 18px 18px;background:#526444;box-shadow:12px 18px 24px #23311d30;transform:rotate(-8deg);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;border-top:12px solid #3e4f33;color:#eef0dd}
.vfx-compare-object::before{content:"M";font:italic clamp(38px,9cqw,104px) Georgia,serif;line-height:1}.vfx-compare-object span{font:8px ui-monospace,monospace;letter-spacing:.15em}.vfx-compare-object::after{content:"SINGLE ORIGIN / 250g";font:6px ui-monospace,monospace;position:absolute;bottom:15%}
.vfx-compare-before .vfx-compare-object{transform:none;background:#989da2;border-top-color:#7c8186;border-radius:2px;box-shadow:none;color:white}.vfx-compare-before .vfx-compare-object::before{font-family:Arial,sans-serif;font-style:normal}
@container(max-width:580px){.vfx-comparison-stage{aspect-ratio:1.2;min-height:280px}.vfx-compare-before,.vfx-compare-after{padding:12% 8%}.vfx-compare-copy{gap:12px}.vfx-compare-copy strong{font-size:28px}.vfx-compare-before .vfx-compare-copy strong{font-size:22px}.vfx-compare-copy small{font-size:8px}.vfx-compare-wordmark{top:17%;left:8%;font-size:10px}.vfx-compare-object{width:76%}.vfx-compare-object span{font-size:6px}.vfx-compare-object::after{font-size:4px}}
`;

function ComparisonDemo({ after = false }: { after?: boolean }) {
  return <div className={after ? "vfx-compare-after" : "vfx-compare-before"} aria-hidden="true">
    <span className="vfx-compare-wordmark">meridian®</span>
    <div className="vfx-compare-copy"><strong>{after ? <>A slower<br />kind of morning.</> : <>Good coffee.<br />Every day.</>}</strong><small>Thoughtfully sourced. Roasted in small batches. Made for your everyday ritual.</small><em>Explore our coffee ↗</em></div>
    <div className="vfx-compare-object"><span>MERIDIAN</span></div>
  </div>;
}

/**
 * Before/after comparison with a draggable, keyboard- and touch-operable
 * handle. The interaction is a real range input stretched over the stage, so
 * arrow keys, Home/End, screen readers and touch all work without pointer
 * gymnastics. Pass your own before/after nodes (images, canvases, anything).
 */
export function BlockComparison({
  eyebrow = "Before / after",
  title = "A new look. The same good coffee.",
  description = "Slide between two directions for Meridian. The details make the difference.",
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  defaultPosition = 50,
  caption = "Demo visuals generated in CSS. Pass images or video of your own via the before/after props.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockComparisonProps) {
  const [position, setPosition] = useState(Math.max(0, Math.min(100, defaultPosition)));
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(event.currentTarget.value));
  }, []);

  return (
    <section
      className={`vfx-block vfx-comparison${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={{ "--vfx-pos": `${position}%`, ...blockAccentStyle(accent, style) } as CSSProperties}
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
            <div className="vfx-comparison-stage">
              <div className="vfx-comparison-layer">{before ?? <ComparisonDemo />}</div>
              <div className="vfx-comparison-layer vfx-comparison-layer--after">{after ?? <ComparisonDemo after />}</div>
              <span className="vfx-comparison-chip vfx-comparison-chip--before">{beforeLabel}</span>
              <span className="vfx-comparison-chip vfx-comparison-chip--after">{afterLabel}</span>
              <div className="vfx-comparison-handle" aria-hidden="true">
                <span className="vfx-comparison-grip">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 5 3 10l4 5M13 5l4 5-4 5" />
                  </svg>
                </span>
              </div>
              <input
                className="vfx-comparison-range"
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={position}
                onChange={onChange}
                aria-label={`${beforeLabel} / ${afterLabel} comparison handle`}
                aria-valuetext={`${Math.round(100 - position)}% ${afterLabel.toLowerCase()}`}
              />
            </div>
            {caption ? <p className="vfx-comparison-note">{caption}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
