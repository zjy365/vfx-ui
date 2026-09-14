"use client";

import { useId, type CSSProperties } from "react";
import { usePointerMotion } from "../usePointerMotion";
import type { HeroContentProps } from "./HeroShell";
import { StudioHeroFrame } from "./StudioHeroFrame";

export interface HeroEclipseProps extends HeroContentProps {
  color?: string;
  background?: string;
  /** How far the occulting disc moves, from 0 to 1. */
  parallax?: number;
}

const CSS = `
.vfx-eclipse-instrument{position:absolute;width:64%;height:100%;right:-5%;top:0}.vfx-eclipse-instrument svg{overflow:visible}.vfx-studio-eclipse .vfx-studio-title{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.06em}.vfx-studio-eclipse .vfx-studio-subtitle{color:#d1c6b9}.vfx-eclipse-disc{transform:translate(var(--eclipse-x,18px),var(--eclipse-y,-12px))}.vfx-eclipse-hands{transform:rotate(var(--eclipse-angle,-24deg));transform-origin:350px 350px}
@container(max-width:640px){.vfx-eclipse-instrument{width:100%;height:370px;right:-8%;top:-18px}}
`;

/** An engraved astronomical instrument, with a pointer-controlled eclipse. */
export function HeroEclipse({
  eyebrow = "A study in celestial motion", title = "A rare\nalignment.",
  subtitle = "For ideas that only come around once. Make this moment yours.",
  color = "#e9ad73", background = "#171916", parallax = .7, interactive = false, style, ...content
}: HeroEclipseProps) {
  const id = useId().replace(/:/g, "");
  const surface = usePointerMotion<HTMLElement>((element, point) => {
    const strength = Number.isFinite(parallax) ? Math.max(0, Math.min(1, parallax)) : .7;
    element.style.setProperty("--eclipse-x", `${18 + point.x * 65 * strength}px`);
    element.style.setProperty("--eclipse-y", `${-12 + point.y * 45 * strength}px`);
    element.style.setProperty("--eclipse-angle", `${-24 + point.x * 65 * strength}deg`);
  }, !interactive);
  return <StudioHeroFrame {...content} eyebrow={eyebrow} title={title} subtitle={subtitle} kind="eclipse" surfaceRef={surface}
    style={{ "--studio-paper": background, "--studio-ink": "#f2e9da", "--studio-accent": color, ...style } as CSSProperties}
    artwork={<><style>{CSS}</style><div className="vfx-eclipse-instrument"><svg viewBox="0 0 700 700" fill="none">
      <defs>
        <radialGradient id={`${id}-sun`}><stop stopColor="#fff3d0"/><stop offset=".75" stopColor={color}/><stop offset="1" stopColor={color} stopOpacity=".6"/></radialGradient>
        <radialGradient id={`${id}-halo`}><stop offset=".45" stopColor={color} stopOpacity=".2"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="350" cy="350" r="300" fill={`url(#${id}-halo)`}/>
      {[300, 282, 246, 217].map((r, i) => <circle key={r} cx="350" cy="350" r={r} stroke={color} strokeOpacity={i === 1 ? .55 : .23} strokeWidth=".7"/>)}
      {Array.from({ length: 120 }, (_, i) => <path key={i} d={`M350 68v${i % 10 === 0 ? 19 : i % 5 === 0 ? 12 : 5}`} transform={`rotate(${i * 3} 350 350)`} stroke={color} strokeOpacity={i % 5 === 0 ? .85 : .35} strokeWidth={i % 10 === 0 ? 1.4 : .7}/>)}
      {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <text key={i} x={350 + Math.cos(a) * 260} y={354 + Math.sin(a) * 260} textAnchor="middle" fill={color} fontFamily="monospace" fontSize="9" opacity=".8">{String(i * 30).padStart(3, "0")}</text>; })}
      <path d="M25 350h650M350 25v650" stroke={color} strokeOpacity=".16" strokeDasharray="3 7"/>
      <circle cx="350" cy="350" r="174" fill={`url(#${id}-sun)`}/>
      <circle className="vfx-eclipse-disc" cx="350" cy="350" r="163" fill={background} stroke={color} strokeWidth=".6"/>
      <g className="vfx-eclipse-hands" stroke={color}><path d="M350 47v72M343 54l7-7 7 7M350 581v72"/><circle cx="350" cy="138" r="4" fill={color}/><path d="M343 350h14m-7-7v14" strokeOpacity=".6"/></g>
      <text x="350" y="685" textAnchor="middle" fill={color} fontSize="9" fontFamily="monospace" letterSpacing="4">S O L  /  L U N A</text>
    </svg></div></>}/>
}
