"use client";

import { type CSSProperties } from "react";
import { usePointerMotion } from "../usePointerMotion";
import {
  FooterFrame,
  FooterWordmark,
  type FooterContentProps,
} from "./FooterFrame";

export interface FooterFoldProps extends FooterContentProps {
  color?: string;
  background?: string;
  /** Maximum fold rotation in degrees. */
  depth?: number;
}

/** One wordmark printed across a responsive, hinged paper screen. */
export function FooterFold({
  brand = "FORM",
  title = "Leave it\nwide open.",
  color = "#292454",
  background = "#e5e0f0",
  depth = 32,
  interactive = true,
  style,
  ...content
}: FooterFoldProps) {
  const surface = usePointerMotion<HTMLElement>((element, point) => {
    const panels = element.querySelectorAll<HTMLElement>(".vfx-fold-panel");
    panels.forEach((panel, index) => {
      const center = ((index + 0.5) / panels.length) * 2 - 1;
      const influence =
        Math.exp(-Math.pow(center - point.x, 2) * 4) * point.active;
      const turn = (index % 2 ? -1 : 1) * (0.72 + influence * 0.28);
      panel.style.setProperty("--fold-turn", `${turn}deg`);
    });
  }, !interactive);
  return (
    <FooterFrame
      {...content}
      brand={brand}
      title={title}
      kind="fold"
      surfaceRef={surface}
      before
      style={
        {
          "--vf-bg": background,
          "--vf-ink": color,
          "--vf-accent": color,
          "--vf-depth": Math.min(55, Math.max(0, depth)),
          ...style,
        } as CSSProperties
      }
      artwork={
        <div className="vfx-footer-art vfx-fold-art">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              className="vfx-fold-panel"
              key={index}
              style={
                { "--fold-shade": index % 2 ? ".23" : ".055" } as CSSProperties
              }
            >
              <div
                className="vfx-fold-print"
                style={{ width: "800%", marginLeft: `${index * -100}%` }}
              >
                <FooterWordmark text={brand} />
              </div>
            </div>
          ))}
        </div>
      }
    >
      {content.children}
    </FooterFrame>
  );
}
