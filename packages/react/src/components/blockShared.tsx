"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEventHandler } from "react";

/** Shared action shape across blocks: a real link by default, or a button. */
export type BlockAction = {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function resolveBlockAction(action: BlockAction | string | null | undefined): BlockAction | undefined {
  return typeof action === "string" ? (action ? { label: action } : undefined) : action ?? undefined;
}

export function BlockActionButton({ action, variant }: { action: BlockAction; variant: "primary" | "accent" | "ghost" }) {
  const className = `vfx-block-btn vfx-block-btn--${variant}`;
  return action.href
    ? <a className={className} href={action.href}>{action.label}</a>
    : <button type="button" className={className} onClick={action.onClick}>{action.label}</button>;
}

/**
 * Shared design tokens for vfx-ui blocks.
 *
 * Every block is a self-contained copy-paste component (its own <style> tag),
 * so this module is a build-time convenience for the npm package only — the
 * registry build inlines it into each item as components/vfx/blockShared.tsx.
 * Blocks share one visual language: dark editorial surfaces, an accent color,
 * compact buttons and a generous typographic measure. Components layer their own layout
 * tokens on top of these.
 */
export const BLOCK_BASE_CSS = `
.vfx-block{--vb-bg:#111210;--vb-fg:#f2f3ed;--vb-muted:color-mix(in srgb,var(--vb-fg) 65%,var(--vb-bg));--vb-faint:color-mix(in srgb,var(--vb-fg) 49%,var(--vb-bg));--vb-card:color-mix(in srgb,var(--vb-fg) 4%,var(--vb-bg));--vb-raised:color-mix(in srgb,var(--vb-fg) 7%,var(--vb-bg));--vb-border:color-mix(in srgb,var(--vb-fg) 13%,var(--vb-bg));--vb-accent:#d5ed9a;--vb-accent-ink:#202719;--vb-radius:12px;--vb-font:"Geist","Helvetica Neue",Arial,sans-serif;position:relative;isolation:isolate;box-sizing:border-box;container-type:inline-size;width:100%;background:var(--vb-bg);color:var(--vb-fg);font-family:var(--vb-font);-webkit-font-smoothing:antialiased}
.vfx-block[data-scheme="light"]{--vb-bg:#f7f7f2;--vb-fg:#22251f;--vb-card:#eeefe8;--vb-raised:#fff;--vb-accent:#416237;--vb-accent-ink:#172211}
.vfx-block *,.vfx-block *::before,.vfx-block *::after{box-sizing:border-box}
.vfx-block :where(a){color:inherit;text-decoration:none}
.vfx-block :is(a,button,input,[tabindex]):focus-visible{outline:2px solid var(--vb-accent);outline-offset:4px}
.vfx-block :where(img,svg,video){display:block;max-width:100%}
.vfx-block :where(h1,h2,h3,p,figure){margin:0}
.vfx-block :is(h1,h2,h3,h4,h5,p,li,blockquote,figcaption){color:inherit}
.vfx-block-container{width:100%;max-width:var(--vb-container,1200px);margin-inline:auto;padding-inline:clamp(24px,5cqw,64px)}
.vfx-block .vfx-block-eyebrow{display:flex;align-items:center;gap:9px;font:500 11px/1.4 ui-monospace,"SFMono-Regular",monospace;letter-spacing:.09em;text-transform:uppercase;color:var(--vb-muted)}
.vfx-block-eyebrow::before{content:"";width:6px;height:6px;border:1px solid currentColor;border-radius:1px;flex:none}
.vfx-block .vfx-block-title{font-size:clamp(32px,4.4cqw,54px);font-weight:500;letter-spacing:-.055em;line-height:1.08;text-wrap:balance;max-width:19ch}
.vfx-block .vfx-block-lede{color:var(--vb-muted);font-size:clamp(14px,1.45cqw,16px);line-height:1.7;max-width:53ch;text-wrap:pretty}
.vfx-block-head{display:flex;flex-direction:column;gap:20px;max-width:780px}
.vfx-block-head--center{align-items:center;text-align:center;margin-inline:auto}
.vfx-block-head--center .vfx-block-lede{margin-inline:auto}
.vfx-block-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px}
.vfx-block .vfx-block-btn{display:inline-flex;align-items:center;justify-content:center;gap:18px;min-height:44px;padding:12px 18px;border-radius:7px;border:1px solid transparent;font:500 13px/1.2 var(--vb-font);cursor:pointer;transition:background-color 180ms ease,transform 180ms ease,border-color 180ms ease;text-decoration:none;white-space:normal;text-align:center}
.vfx-block-btn::after{content:"↗";font-size:16px;font-weight:400}
.vfx-block .vfx-block-btn--primary{background:var(--vb-fg);color:var(--vb-bg)}
.vfx-block .vfx-block-btn--accent{background:var(--vb-accent);color:var(--vb-accent-ink)}
.vfx-block .vfx-block-btn--ghost{color:var(--vb-fg);border-color:var(--vb-border);background:transparent}
.vfx-block-btn:hover{transform:translateY(-2px);filter:brightness(.94)}
.vfx-block-btn:active{transform:translateY(0)}
.vfx-block .vfx-block-btn--sm{min-height:36px;padding:9px 14px;font-size:12px}
.vfx-block-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:4px;border:1px solid var(--vb-border);color:var(--vb-muted);font-size:11px}
.vfx-block-card{background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius)}
.vfx-block .vfx-block-subtle{color:var(--vb-faint);font-size:11px;line-height:1.6}
/* Product vignettes are local, asset-free illustrations, shared by the blocks. */
.vfx-scene{position:relative;display:flex;flex-direction:column;width:100%;height:100%;min-height:220px;padding:24px;color:var(--vb-fg);background:var(--vb-card);font-family:var(--vb-font);overflow:hidden}
.vfx-scene-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:22px;font:10px/1.4 ui-monospace,monospace;color:var(--vb-muted)}
.vfx-scene-status{display:flex;align-items:center;gap:6px}
.vfx-scene-status::before{content:"";width:5px;height:5px;background:var(--vb-accent);border-radius:50%}
.vfx-scene-canvas{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px;background-image:radial-gradient(var(--vb-border) .7px,transparent .7px);background-size:16px 16px;padding:16px}
.vfx-scene-node{position:relative;display:flex;align-items:center;gap:12px;max-width:240px;width:85%;margin-inline:auto;padding:13px 16px;border:1px solid var(--vb-border);border-radius:8px;background:var(--vb-raised);box-shadow:0 4px 12px #0000000d;font-size:12px;text-align:left}
.vfx-scene-node+ .vfx-scene-node::before{content:"";position:absolute;left:50%;bottom:100%;height:21px;width:1px;background:var(--vb-accent)}
.vfx-scene-node b{font-size:12px;font-weight:500;display:block}.vfx-scene-node small{display:block;color:var(--vb-faint);font-size:9px;margin-top:3px}.vfx-scene-node em{margin-left:auto;color:var(--vb-accent);font-style:normal}
.vfx-scene-symbol{width:28px;height:28px;display:grid;place-items:center;border:1px solid var(--vb-border);border-radius:6px;color:var(--vb-muted);flex:none}
.vfx-scene-bottom{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--vb-border);margin-top:18px;padding-top:12px;font:9px/1.5 ui-monospace,monospace;color:var(--vb-faint)}
.vfx-scene-meter{display:flex;align-items:center;justify-content:center;flex:1;padding:12px}
.vfx-scene-dial{width:min(190px,65%);aspect-ratio:1;border-radius:50%;padding:10px;background:conic-gradient(var(--vb-accent) 0 76%,var(--vb-border) 76% 100%);transform:rotate(-136deg)}
.vfx-scene-dial>div{display:flex;align-items:center;justify-content:center;flex-direction:column;width:100%;height:100%;border-radius:50%;background:var(--vb-card);transform:rotate(136deg)}
.vfx-scene-dial strong{font-size:clamp(32px,4cqw,50px);font-weight:400;letter-spacing:-.06em}.vfx-scene-dial small{font:9px ui-monospace,monospace;color:var(--vb-muted);margin-top:5px}
.vfx-scene-log{flex:1;display:flex;flex-direction:column;justify-content:center;gap:0}.vfx-scene-event{display:grid;grid-template-columns:20px 1fr auto;align-items:center;gap:10px;border-bottom:1px solid var(--vb-border);padding:16px 0;font-size:11px}.vfx-scene-event>i{font-style:normal;color:var(--vb-accent)}.vfx-scene-event time{font:9px ui-monospace,monospace;color:var(--vb-faint)}
.vfx-scene-chart{flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px}.vfx-scene-chart strong{font-size:42px;letter-spacing:-.06em;font-weight:400}.vfx-scene-chart strong small{font-size:10px;letter-spacing:0;color:var(--vb-muted);margin-left:12px}.vfx-scene-chart svg{width:100%;height:100px;color:var(--vb-accent);overflow:visible}
@media(prefers-reduced-motion:reduce){.vfx-block *,.vfx-block *::before,.vfx-block *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.vfx-block .vfx-block-btn:hover{transform:none}}
`;

/** Small product illustrations. All values are fictional demonstration data. */
export function BlockScene({ variant = 0, label }: { variant?: number; label?: string }) {
  const mode = variant % 4;
  return <div className="vfx-scene" aria-hidden="true">
    <div className="vfx-scene-top"><span>{label ?? ["RELEASE / 024", "ROLLOUT / LIVE", "ACTIVITY / THIS WEEK", "PERFORMANCE / 7 DAYS"][mode]}</span><span className="vfx-scene-status">Connected</span></div>
    {mode === 0 ? <div className="vfx-scene-canvas">{["Push to main", "Build & verify", "Production"].map((name, i) => <div className="vfx-scene-node" key={name}><span className="vfx-scene-symbol">{["⑂", "◎", "↗"][i]}</span><span><b>{name}</b><small>{["orbit / web-app", "All checks passed", "Ready to deploy"][i]}</small></span><em>✓</em></div>)}</div>
      : mode === 1 ? <div className="vfx-scene-meter"><div className="vfx-scene-dial"><div><strong>76<span style={{ fontSize: "0.45em" }}>%</span></strong><small>TRAFFIC RELEASED</small></div></div></div>
      : mode === 2 ? <div className="vfx-scene-log">{["Release v2.4 deployed", "Canary checks passed", "Review approved", "Build completed"].map((name, i) => <div className="vfx-scene-event" key={name}><i>✓</i><span>{name}</span><time>{["Just now", "2m ago", "8m ago", "12m ago"][i]}</time></div>)}</div>
      : <div className="vfx-scene-chart"><strong>128<small>ms · p95 latency</small></strong><svg viewBox="0 0 360 100" fill="none" preserveAspectRatio="none"><path d="M0 25H360M0 60H360M0 95H360" stroke="currentColor" opacity=".1"/><path d="M0 72 25 68 45 74 66 50 83 55 106 48 128 56 150 29 177 34 200 20 225 30 248 22 270 30 295 12 320 22 340 13 360 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg></div>}
    <div className="vfx-scene-bottom"><span>orbit / production</span><span>All systems operational ↗</span></div>
  </div>;
}

/** Convenience prop type for blocks that theme via the accent custom property. */
export type BlockAccentStyle = {
  accent?: string;
  className?: string;
  style?: CSSProperties;
};

export function blockAccentStyle(accent?: string, style?: CSSProperties): CSSProperties {
  return { ...(accent ? ({ "--vb-accent": accent } as CSSProperties) : null), ...style };
}

/**
 * One-shot in-view flag for entrance motion, built fail-open: content is
 * revealed by default (SSR, no-JS, throttled renderers all see it) and the
 * hidden pre-entrance state is only armed after an IntersectionObserver
 * callback confirms the element starts below the fold. Blocks use it purely
 * to toggle a CSS class, so reduced-motion visitors simply see the settled
 * state via their own media-query overrides.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    let armed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        } else if (!armed) {
          armed = true;
          setRevealed(false);
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);
  return { ref, revealed };
}
