"use client";

import { useMemo, type CSSProperties } from "react";
import { usePointerMotion } from "../usePointerMotion";
import type { HeroContentProps } from "./HeroShell";
import { StudioHeroFrame } from "./StudioHeroFrame";

export interface HeroContourProps extends HeroContentProps {
  color?: string;
  background?: string;
  /** A stable integer changes the landscape, without hydration randomness. */
  seed?: number;
  relief?: number;
}

const CSS = `
.vfx-contour-landscape{position:absolute;inset:0 0 0 36%;transform:translate(var(--contour-x,0px),var(--contour-y,0px));transform-origin:75% 70%}.vfx-contour-landscape svg{overflow:visible}.vfx-studio-contour .vfx-studio-copy{justify-content:flex-start;padding-top:70px}.vfx-studio-contour .vfx-studio-title{font-weight:650}.vfx-contour-sun{position:absolute;width:120px;height:120px;right:12%;top:12%;background:var(--studio-accent);border-radius:50%;transform:translate(var(--contour-sun-x,0px),0)}
@container(max-width:640px){.vfx-contour-landscape{inset:-65px -30% -40px -20%}.vfx-contour-sun{width:65px;height:65px;top:-10px;right:15%}.vfx-studio-contour .vfx-studio-copy{padding-top:38px}}
`;

/** A deterministic topographic print with a pointer-lifted paper landscape. */
export function HeroContour({
  eyebrow = "Independent by nature", title = "Find your\nown way.",
  subtitle = "A different perspective changes everything. Step off the familiar path.",
  color = "#ed5b31", background = "#eeeade", seed = 17, relief = 1, interactive = false, style, ...content
}: HeroContourProps) {
  const phase = Number.isFinite(seed) ? seed % 997 : 17;
  const height = Number.isFinite(relief) ? Math.max(.3, Math.min(1.6, relief)) : 1;
  const paths = useMemo(() => Array.from({ length: 48 }, (_, row) => {
    const points = Array.from({ length: 101 }, (_, col) => {
      const x = col * 9;
      const ridge = Math.exp(-Math.pow((x - 455 - row * 2) / 170, 2)) * 255
        + Math.exp(-Math.pow((x - 770) / 130, 2)) * 130;
      const y = 350 + row * 9 - ridge * height * Math.sin((row / 65 + .2) * Math.PI)
        + Math.sin(x / 65 + row * .14 + phase * .3) * 9
        + Math.exp(-x / 115) * 470;
      return `${col ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `${points} L900,850 L0,850 Z`;
  }), [phase, height]);
  const surface = usePointerMotion<HTMLElement>((element, point) => {
    element.style.setProperty("--contour-x", `${point.x * -16}px`);
    element.style.setProperty("--contour-y", `${point.y * -12}px`);
    element.style.setProperty("--contour-sun-x", `${point.x * 22}px`);
    element.querySelectorAll<SVGGElement>("[data-contour-band]").forEach((band, i) => {
      const lift = Math.exp(-Math.pow(i / 8 * 2 - 1 - point.x, 2) * 3) * point.active * 16;
      band.style.transform = `translateY(${-lift}px)`;
    });
  }, !interactive);
  return <StudioHeroFrame {...content} eyebrow={eyebrow} title={title} subtitle={subtitle} kind="contour" surfaceRef={surface}
    style={{ "--studio-paper": background, "--studio-ink": "#27362a", "--studio-accent": color, ...style } as CSSProperties}
    artwork={<><style>{CSS}</style><div className="vfx-contour-sun"/><div className="vfx-contour-landscape"><svg viewBox="0 0 900 800" preserveAspectRatio="xMidYMax slice" fill="none">
      {Array.from({ length: 8 }, (_, band) => <g data-contour-band key={band}>{paths.slice(band * 6, band * 6 + 6).map((d, i) => <path key={i} d={d} fill={background} stroke={(band * 6 + i) % 8 === 0 ? color : "#53634f"} strokeWidth={(band * 6 + i) % 8 === 0 ? 1.8 : .8}/>)}</g>)}
    </svg></div></>}/>
}
