"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";
import { BLOCK_BASE_CSS, BlockActionButton, blockAccentStyle, type BlockAction } from "./blockShared";

export interface BlockShowcaseProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  primaryCta?: BlockAction | null;
  secondaryCta?: BlockAction | null;
  /**
   * The screen content. Defaults to a built-in demo product UI drawn in CSS —
   * pass an <img>, <video>, or any node to show your real screenshot.
   */
  media?: ReactNode;
  /** Accessible description of the media when you supply your own. */
  mediaAlt?: string;
  /** Frame caption under the stage (e.g. version or availability note). */
  caption?: ReactNode;
  /** Pointer tilt on the frame; touch and reduced motion stay still. */
  interactive?: boolean;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-showcase{padding-block:clamp(64px,9cqw,112px);overflow:clip}
.vfx-showcase .vfx-block-head{margin-bottom:48px}.vfx-showcase .vfx-block-title{max-width:17ch}
.vfx-showcase-stage{perspective:1600px;position:relative;padding:28px 28px 0;border:1px solid var(--vb-border);border-radius:12px;background:var(--vb-card)}
.vfx-showcase-frame{position:relative;border:1px solid var(--vb-border);border-bottom:0;border-radius:8px 8px 0 0;background:var(--vb-bg);box-shadow:0 16px 40px #00000020;transform:rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg));overflow:hidden}
.vfx-showcase-chrome{display:flex;align-items:center;gap:5px;padding:12px 16px;border-bottom:1px solid var(--vb-border);background:var(--vb-raised)}
.vfx-showcase-dot{width:6px;height:6px;border-radius:50%;background:var(--vb-faint);opacity:.5}
.vfx-showcase-url{flex:1;text-align:center;color:var(--vb-faint);font:9px ui-monospace,monospace}
.vfx-showcase-screen{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--vb-bg)}
.vfx-showcase-screen>*{position:absolute;inset:0}.vfx-showcase-screen img,.vfx-showcase-screen video{width:100%;height:100%;object-fit:cover}
.vfx-showcase-caption{margin-top:18px;text-align:center;font:10px/1.6 ui-monospace,monospace;color:var(--vb-faint)!important}
.vfx-showcase-demo{display:grid;grid-template-columns:150px 1fr;font-family:var(--vb-font);color:var(--vb-fg);background:var(--vb-bg)}
.vfx-showcase-rail{display:flex;flex-direction:column;gap:5px;border-right:1px solid var(--vb-border);padding:20px 12px;background:var(--vb-card)}
.vfx-showcase-rail-brand{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;letter-spacing:-.04em;padding:0 10px 24px}
.vfx-showcase-rail-dot{width:15px;height:15px;border:3px double var(--vb-fg);border-radius:50%}
.vfx-showcase-rail-item{padding:9px 10px;font-size:10px;border-radius:5px;color:var(--vb-muted);display:flex;gap:10px}.vfx-showcase-rail-item[data-on="true"]{color:var(--vb-fg);background:var(--vb-border)}
.vfx-showcase-rail-foot{margin-top:auto;padding:12px 10px 0;border-top:1px solid var(--vb-border);font-size:9px;color:var(--vb-faint)}
.vfx-showcase-body{display:flex;flex-direction:column;gap:22px;padding:28px;min-width:0;overflow:hidden}
.vfx-showcase-apphead{display:flex;justify-content:space-between;align-items:center;gap:12px}.vfx-showcase-apphead h3{font-size:20px;font-weight:500;letter-spacing:-.045em}.vfx-showcase-apphead p{font-size:10px;color:var(--vb-faint);margin-top:6px}
.vfx-showcase-apphead>span{padding:7px 10px;border:1px solid var(--vb-border);border-radius:5px;font-size:9px}
.vfx-showcase-stats{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--vb-border);padding:18px 0}
.vfx-showcase-stat{padding:0 18px;border-left:1px solid var(--vb-border);min-width:0}.vfx-showcase-stat:first-child{border:0;padding-left:0}.vfx-showcase-stat i{display:block;font-style:normal;font-size:28px;font-weight:400;letter-spacing:-.06em;margin-top:10px}.vfx-showcase-stat span{font-size:9px;color:var(--vb-muted)}.vfx-showcase-stat small{font-size:9px;letter-spacing:0;color:var(--vb-accent);margin-left:6px}
.vfx-showcase-release{display:flex;align-items:center;gap:10px;font-size:10px;padding-bottom:10px}.vfx-showcase-release>span{margin-left:auto;font-size:9px;color:var(--vb-accent)}
.vfx-showcase-release-dot{width:6px;height:6px;background:var(--vb-accent);border-radius:50%}
.vfx-showcase-chart{position:relative;flex:1;min-height:80px;display:flex;align-items:flex-end;gap:6px;border-bottom:1px solid var(--vb-border);padding:0 4px;background:repeating-linear-gradient(0deg,transparent 0 32px,var(--vb-border) 32px 33px)}
.vfx-showcase-bar{flex:1;min-width:2px;background:color-mix(in srgb,var(--vb-accent) 65%,var(--vb-bg));border-radius:2px 2px 0 0}.vfx-showcase-bar:nth-child(3n){background:var(--vb-accent)}
.vfx-showcase-chart-labels{display:flex;justify-content:space-between;font:8px ui-monospace,monospace;color:var(--vb-faint);margin-top:-14px}
@container(max-width:760px){.vfx-showcase-stage{padding:14px 14px 0}.vfx-showcase-demo{grid-template-columns:112px 1fr}.vfx-showcase-body{padding:18px;gap:16px}.vfx-showcase-stat i{font-size:22px}.vfx-showcase-screen{aspect-ratio:4/3}.vfx-showcase-stat{padding:0 10px}.vfx-showcase-stat small{display:none}}
@container(max-width:500px){.vfx-showcase-rail{display:none}.vfx-showcase-demo{grid-template-columns:1fr}.vfx-showcase-stage{padding:10px 10px 0}.vfx-showcase-apphead h3{font-size:17px}.vfx-showcase-body{padding:16px;gap:14px}.vfx-showcase-chart-labels{margin-top:-8px}.vfx-showcase-stats{padding:12px 0}}
`;

/** Fictional analytics UI used as the default screen content. */
function DemoScreen() {
  return <div className="vfx-showcase-demo" aria-hidden="true">
    <div className="vfx-showcase-rail">
      <div className="vfx-showcase-rail-brand"><span className="vfx-showcase-rail-dot" />orbit</div>
      {["Overview", "Releases", "Environments", "Activity", "Settings"].map((name, i) => <div className="vfx-showcase-rail-item" data-on={i === 0} key={name}><span>{["◫", "⑂", "◎", "≋", "⊙"][i]}</span>{name}</div>)}
      <div className="vfx-showcase-rail-foot">Lumen workspace ↗</div>
    </div>
    <div className="vfx-showcase-body">
      <div className="vfx-showcase-apphead"><div><h3>Release overview</h3><p>Your week, looking good.</p></div><span>Last 7 days ⌄</span></div>
      <div className="vfx-showcase-stats">
        <div className="vfx-showcase-stat"><span>Deployments</span><i>142<small>↗ 18.2%</small></i></div>
        <div className="vfx-showcase-stat"><span>Success rate</span><i>99.8<small>%</small></i></div>
        <div className="vfx-showcase-stat"><span>Avg. build time</span><i>1m 24<small>s</small></i></div>
      </div>
      <div className="vfx-showcase-release"><i className="vfx-showcase-release-dot" />Deployment activity<span>All systems operational</span></div>
      <div className="vfx-showcase-chart">{[32,45,38,50,43,65,54,72,61,56,75,68,84,73,62,81,76,90,78,92,86,96,85,90].map((height,i)=><span className="vfx-showcase-bar" style={{height:`${height}%`}} key={i}/>)}</div>
      <div className="vfx-showcase-chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
    </div>
  </div>;
}

/**
 * Product showcase: headline, actions, and a browser-chrome stage holding a
 * replaceable screenshot, video, or any node. The default screen is a
 * fictional demo UI drawn in CSS — no assets to license or load.
 */
export function BlockShowcase({
  eyebrow = "Product tour",
  title = "Every launch, in one orbit.",
  description = "From the first commit to the Friday review. A clear view of everything your team is shipping.",
  primaryCta = { label: "Start free", href: "#start" },
  secondaryCta = { label: "Book a demo", href: "#demo" },
  media,
  mediaAlt,
  caption = "Orbit workspace · Interactive product demo",
  interactive = true,
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockShowcaseProps) {
  const frameRef = usePointerMotion<HTMLDivElement>((el, p) => {
    el.style.setProperty("--tilt-x", `${(-p.y * 3.2).toFixed(3)}deg`);
    el.style.setProperty("--tilt-y", `${(p.x * 4.2).toFixed(3)}deg`);
    el.style.setProperty("--tilt-z", p.active.toFixed(3));
  }, !interactive);

  return (
    <section
      className={`vfx-block vfx-showcase${className ? ` ${className}` : ""}`}
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
              {primaryCta || secondaryCta ? (
                <div className="vfx-block-actions" style={{ justifyContent: "center", marginTop: 6 }}>
                  {primaryCta ? <BlockActionButton action={primaryCta} variant="primary" /> : null}
                  {secondaryCta ? <BlockActionButton action={secondaryCta} variant="ghost" /> : null}
                </div>
              ) : null}
            </header>
            <div className="vfx-showcase-stage">
              <div className="vfx-showcase-frame" ref={frameRef}>
                <div className="vfx-showcase-chrome" aria-hidden="true">
                  <span className="vfx-showcase-dot" />
                  <span className="vfx-showcase-dot" />
                  <span className="vfx-showcase-dot" />
                  <span className="vfx-showcase-url">app.lumenlabs.example</span>
                  <span style={{ width: 34 }} aria-hidden="true" />
                </div>
                <div
                  className="vfx-showcase-screen"
                  role={media ? undefined : "img"}
                  aria-label={media ? undefined : mediaAlt ?? "Fictional product interface used as demo content"}
                >
                  {media ?? <DemoScreen />}
                </div>
              </div>
            </div>
            {caption ? <p className="vfx-showcase-caption">{caption}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
