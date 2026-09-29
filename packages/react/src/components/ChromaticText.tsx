"use client";
import type { CSSProperties } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface ChromaticTextProps {
  text?: string;
  /** Maximum red/blue channel separation in pixels. */
  separation?: number;
  /** Dispersion field width as a fraction of the text run. */
  spread?: number;
  /** Rainbow span in degrees across the whole text. */
  spectrum?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Spectral dispersion for type: the pointer is the prism. Letters near the
 * cursor split into red and blue fringes while the rainbow underneath slides
 * with it; the phrase is exposed to assistive technology as one labelled
 * image (role="img" + aria-label), each animated letter hidden from AT.
 */
export function ChromaticText({
  text = "Split the light.",
  separation = 5,
  spread = 0.3,
  spectrum = 280,
  disabled = false,
  className,
  style,
}: ChromaticTextProps) {
  const letters = Array.from(text);
  const ref = usePointerMotion<HTMLSpanElement>((el, p) => {
    const cursor = (p.x + 1) / 2;
    const width = Math.max(0.05, spread);
    const count = Math.max(1, letters.length);
    Array.from(el.children).forEach((child, index) => {
      const letter = child as HTMLElement;
      const position = (index + 0.5) / count;
      const distance = position - cursor;
      const force =
        Math.exp(-(distance * distance) / (width * width)) * p.active;
      const hue =
        (index / count) * spectrum + cursor * spectrum * 0.5 + p.active * 24;
      letter.style.color = `hsl(${hue} 72% ${64 - force * 8}%)`;
      letter.style.textShadow =
        `${force * separation}px 0 rgba(255,64,96,${0.85 * force}),` +
        `${-force * separation}px 0 rgba(64,150,255,${0.85 * force})`;
    });
  }, disabled);
  return (
    <span
      ref={ref}
      role="img"
      aria-label={text}
      className={className}
      style={{ display: "inline-block", paddingBlock: 6, ...style }}
    >
      {letters.map((letter, index) => (
        <span
          key={`${index}-${letter}`}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
