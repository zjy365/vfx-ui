"use client";

import { useRef, type CSSProperties } from "react";
import {
  FooterFrame,
  FooterWordmark,
  type FooterContentProps,
} from "./FooterFrame";
import { FooterArtwork } from "./FooterArtwork";

export interface FooterTidalProps extends FooterContentProps {
  /** Copper light on the tide. */
  color?: string;
  background?: string;
  animate?: boolean;
}

/** Engraved tidal lines pass behind monumental brand lettering. */
export function FooterTidal({
  brand = "AFTER",
  title = "Every ending.\nA new beginning.",
  description,
  color = "#e8b58b",
  background = "#151b20",
  interactive = true,
  animate = true,
  style,
  ...content
}: FooterTidalProps) {
  const surface = useRef<HTMLElement>(null);
  return (
    <FooterFrame
      {...content}
      brand={brand}
      title={title}
      description={description}
      kind="tidal"
      surfaceRef={surface}
      style={
        {
          "--vf-bg": background,
          "--vf-ink": "#f2e9de",
          "--vf-accent": color,
          ...style,
        } as CSSProperties
      }
      artwork={
        <div className="vfx-footer-art vfx-tidal-art">
          <FooterArtwork
            kind="tidal"
            surface={surface}
            color={color}
            interactive={interactive}
            animate={animate}
          />
          <div className="vfx-tidal-brand">
            <FooterWordmark text={brand} />
          </div>
        </div>
      }
    >
      {content.children}
    </FooterFrame>
  );
}
