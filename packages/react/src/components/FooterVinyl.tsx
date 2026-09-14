"use client";

import type { CSSProperties } from "react";
import { usePointerMotion } from "../usePointerMotion";
import { FooterFrame, type FooterContentProps } from "./FooterFrame";

export interface FooterVinylProps extends FooterContentProps {
  color?: string;
  background?: string;
  labelColor?: string;
}

const CSS = `
.vfx-vinyl-art{position:relative;height:clamp(290px,40cqw,490px);overflow:hidden;border-bottom:1px solid color-mix(in srgb,var(--vf-ink) 25%,transparent)}.vfx-vinyl-heading{position:absolute;top:12%;left:5%;width:48%;z-index:1}.vfx-vinyl-kicker{display:block;font:10px/1.5 ui-monospace,monospace;letter-spacing:.17em;margin-bottom:26px}.vfx-vinyl-brand{display:block;font-size:clamp(52px,10cqw,150px);font-weight:800;line-height:.87;letter-spacing:-.075em;overflow-wrap:anywhere;max-width:8ch}.vfx-vinyl-edition{display:block;margin-top:26px;font:10px/1.5 ui-monospace,monospace;letter-spacing:.12em}
.vfx-vinyl-record{position:absolute;width:57%;aspect-ratio:1;right:-5%;top:8%;border-radius:50%;background:repeating-radial-gradient(circle at center,#252725 0px,#252725 1px,#121512 2px,#121512 4px);box-shadow:-18px 18px 35px #0003;transform:rotate(var(--vinyl-turn,-24deg));border:9px solid #171a17}.vfx-vinyl-record:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 30deg,transparent 0deg,#f8f1d823 38deg,transparent 75deg,transparent 180deg,#f8f1d827 220deg,transparent 255deg)}.vfx-vinyl-label{position:absolute;inset:33%;border-radius:50%;background:var(--vinyl-label);color:#181b17;display:flex;align-items:center;justify-content:center;text-align:center;flex-direction:column;gap:8%;padding:12px;overflow:hidden}.vfx-vinyl-label strong{font-size:clamp(10px,2.3cqw,32px);letter-spacing:-.055em;max-width:100%;overflow-wrap:anywhere;line-height:1}.vfx-vinyl-hole{width:10px;height:10px;border-radius:50%;background:var(--vf-bg);box-shadow:0 0 0 4px #0002;flex-shrink:0}.vfx-vinyl-label small{font:8px/1.4 ui-monospace,monospace;letter-spacing:.1em}.vfx-footer-vinyl .vfx-footer-title{font-size:clamp(28px,3.5cqw,46px)}
@container(max-width:600px){.vfx-vinyl-art{height:300px}.vfx-vinyl-heading{top:12%;width:55%}.vfx-vinyl-brand{font-size:15cqw}.vfx-vinyl-record{width:76%;right:-28%;top:27%}.vfx-vinyl-kicker{font-size:8px;margin-bottom:22px}.vfx-vinyl-edition{font-size:8px}.vfx-vinyl-label strong{font-size:15px}.vfx-vinyl-label small{font-size:6px}}
`;

/** Your closing credits as a record sleeve. The record follows the pointer. */
export function FooterVinyl({ brand = "SIDE B", title = "Good things\nstay on repeat.", color = "#252a20", background = "#e8a0ae", labelColor = "#ef623b", interactive = true, style, ...content }: FooterVinylProps) {
  const surface = usePointerMotion<HTMLElement>((element, point) => {
    element.style.setProperty("--vinyl-turn", `${-24 + point.x * 80 + point.y * 15}deg`);
  }, !interactive);
  return <FooterFrame {...content} brand={brand} title={title} kind="vinyl" before surfaceRef={surface}
    style={{ "--vf-bg": background, "--vf-ink": color, "--vf-accent": color, "--vinyl-label": labelColor, ...style } as CSSProperties}
    artwork={<><style>{CSS}</style><div className="vfx-footer-art vfx-vinyl-art" aria-hidden="true">
      <div className="vfx-vinyl-heading"><span className="vfx-vinyl-kicker">THE END IS A BEGINNING</span><span className="vfx-vinyl-brand">{brand}</span><span className="vfx-vinyl-edition">LONG PLAY / GOOD COMPANY</span></div>
      <div className="vfx-vinyl-record"><div className="vfx-vinyl-label"><strong>{brand}</strong><span className="vfx-vinyl-hole"/><small>SIDE B · 33⅓ RPM</small></div></div>
    </div></>}/>
}
