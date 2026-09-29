"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockActionButton, blockAccentStyle, type BlockAction } from "./blockShared";

export interface BlockCtaProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  primaryCta?: BlockAction | null;
  secondaryCta?: BlockAction | null;
  /** Decorative layer behind the copy (a GPU background, image, or video). */
  media?: ReactNode;
  /** Small reassurance line under the actions (e.g. "No card required"). */
  note?: ReactNode;
  /** "panel" floats a card on the section; "banner" runs full-bleed. */
  layout?: "panel" | "banner";
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-cta{padding-block:clamp(40px,6cqw,80px)}
.vfx-cta-stage{position:relative;isolation:isolate;overflow:hidden;border:1px solid var(--vb-border);border-radius:12px;background:var(--vb-card)}
.vfx-cta-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:24px;padding:clamp(36px,6cqw,76px);max-width:80%}
.vfx-cta-title{font-size:clamp(38px,6cqw,72px);line-height:1.03;letter-spacing:-.065em;font-weight:500;max-width:13ch;text-wrap:balance}
.vfx-cta-description{font-size:14px;line-height:1.75;color:var(--vb-muted)!important;max-width:42ch}
.vfx-cta-actions{margin-top:8px}.vfx-cta-note{font:10px/1.8 ui-monospace,monospace;color:var(--vb-faint)!important}
.vfx-cta-glowline{position:absolute;right:-12%;top:50%;transform:translateY(-50%) rotate(-28deg);width:52%;aspect-ratio:1;border:1px solid var(--vb-border);border-radius:50%;box-shadow:0 0 0 36px var(--vb-card),0 0 0 37px var(--vb-border),0 0 0 72px var(--vb-card),0 0 0 73px var(--vb-border),0 0 0 108px var(--vb-card),0 0 0 109px var(--vb-border);pointer-events:none}
.vfx-cta-glowline::after{content:"↗";position:absolute;left:20%;top:20%;font-size:clamp(90px,17cqw,200px);line-height:1;color:var(--vb-accent);font-weight:200}
.vfx-cta-media{position:absolute;inset:0;z-index:0;opacity:.18;pointer-events:none}.vfx-cta-media>*{width:100%;height:100%}
.vfx-cta[data-layout="banner"]{padding:0}.vfx-cta[data-layout="banner"]>.vfx-block-container{max-width:none;padding:0}.vfx-cta[data-layout="banner"] .vfx-cta-stage{border-radius:0;border-inline:0}.vfx-cta[data-layout="banner"] .vfx-cta-inner{max-width:1200px;margin:auto;padding-inline:clamp(24px,5cqw,64px)}
@container(max-width:640px){.vfx-cta-inner{max-width:100%;padding:32px 24px}.vfx-cta-title{font-size:40px;max-width:12ch}.vfx-cta-glowline{opacity:.25;right:-42%}.vfx-cta-description{max-width:32ch}.vfx-cta-note{max-width:32ch}}
`;

/**
 * Closing CTA: headline, supporting copy, primary and secondary actions, and
 * a brand visual. The default visual is a concentric line artwork; pass anything via
 * media (a vfx-ui background component, an image, a looped video) to make the
 * last screen match the rest of your page.
 */
export function BlockCta({
  eyebrow,
  title = "Your next release could feel like this.",
  description = "A little less coordination. A lot more making. Bring your next idea to Orbit.",
  primaryCta = { label: "Get started free", href: "#start" },
  secondaryCta = { label: "See the docs", href: "#docs" },
  media,
  note = "Free for solo projects · no card required · demo copy",
  layout = "panel",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockCtaProps) {
  return (
    <section
      className={`vfx-block vfx-cta${className ? ` ${className}` : ""}`}
      data-layout={layout}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <div className="vfx-cta-stage">
            <span className="vfx-cta-glowline" aria-hidden="true" />
            {media ? <div className="vfx-cta-media" aria-hidden="true">{media}</div> : null}
            <div className="vfx-cta-inner">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-cta-title">{title}</h2> : null}
              {description ? <p className="vfx-cta-description">{description}</p> : null}
              {primaryCta || secondaryCta ? (
                <div className="vfx-block-actions vfx-cta-actions">
                  {primaryCta ? <BlockActionButton action={primaryCta} variant="primary" /> : null}
                  {secondaryCta ? <BlockActionButton action={secondaryCta} variant="ghost" /> : null}
                </div>
              ) : null}
              {note ? <p className="vfx-cta-note">{note}</p> : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
