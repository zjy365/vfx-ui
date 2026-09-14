"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { resolveHeroCta, type HeroContentProps } from "./HeroShell";

const CSS = `
.vfx-studio-hero{position:relative;isolation:isolate;container-type:inline-size;width:100%;min-height:560px;height:100%;overflow:hidden;box-sizing:border-box;background:var(--studio-paper);color:var(--studio-ink);font-family:inherit}
.vfx-studio-hero *{box-sizing:border-box}.vfx-studio-copy{position:relative;z-index:2;padding:64px 6%;width:55%;min-height:560px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.vfx-studio-eyebrow{font:11px/1.6 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;margin:0 0 34px;display:flex;align-items:center;gap:12px}.vfx-studio-eyebrow:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--studio-accent)}
.vfx-studio-title{font-size:clamp(44px,7.5cqw,108px);line-height:.96;font-weight:500;letter-spacing:-.065em;white-space:pre-line;margin:0;max-width:10ch;overflow-wrap:anywhere;text-wrap:balance}
.vfx-studio-subtitle{font-size:14px;line-height:1.7;max-width:31ch;margin:26px 0 0;opacity:.75}.vfx-studio-actions{display:flex;gap:20px;flex-wrap:wrap;margin-top:32px;align-items:center}.vfx-studio-action{font-family:inherit;font-size:12px;font-weight:500;line-height:1.5;color:inherit;border:0;border-bottom:1px solid currentColor;padding:10px 0;text-decoration:none;background:transparent;cursor:pointer}.vfx-studio-action:first-child{border:1px solid currentColor;padding:12px 20px;border-radius:2px}.vfx-studio-action:hover{background:color-mix(in srgb,currentColor 8%,transparent)}.vfx-studio-action:focus-visible{outline:2px solid currentColor;outline-offset:5px}
.vfx-studio-art{position:absolute;inset:0;z-index:0;pointer-events:none}.vfx-studio-art svg{display:block;width:100%;height:100%}
@container(max-width:640px){.vfx-studio-copy{width:100%;min-height:650px;padding:38px 7% 310px;justify-content:flex-start}.vfx-studio-title{font-size:clamp(48px,12cqw,76px);max-width:12ch}.vfx-studio-eyebrow{margin-bottom:20px}.vfx-studio-subtitle{font-size:13px;margin-top:20px;max-width:34ch}.vfx-studio-actions{margin-top:20px}.vfx-studio-art{top:auto;bottom:0;height:330px}}
`;

/** DOM-only editorial shell: content remains native text, links and buttons. */
export function StudioHeroFrame({ eyebrow, title, subtitle, primaryCta, secondaryCta, children, className = "", style, artwork, surfaceRef, kind }: HeroContentProps & {
  artwork: ReactNode;
  surfaceRef: RefObject<HTMLElement>;
  kind: string;
  style?: CSSProperties;
}) {
  const actions = [resolveHeroCta(primaryCta), resolveHeroCta(secondaryCta)].filter((action) => action != null);
  return <section ref={surfaceRef} className={`vfx-studio-hero vfx-studio-${kind} ${className}`} style={style}>
    <style>{CSS}</style>
    <div className="vfx-studio-art" aria-hidden="true">{artwork}</div>
    <div className="vfx-studio-copy">{children ?? <>
      {eyebrow && <p className="vfx-studio-eyebrow">{eyebrow}</p>}
      {title != null && <h1 className="vfx-studio-title">{title}</h1>}
      {subtitle && <p className="vfx-studio-subtitle">{subtitle}</p>}
      {actions.length > 0 && <div className="vfx-studio-actions">{actions.map((action, index) => action.href
        ? <a className="vfx-studio-action" key={index} href={action.href}>{action.label}</a>
        : <button className="vfx-studio-action" key={index} type="button" onClick={action.onClick}>{action.label}</button>)}</div>}
    </>}</div>
  </section>;
}
