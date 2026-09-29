"use client";
import { useEffect, useRef, type CSSProperties } from "react";

export interface SpectrumTextProps {
  text?: string;
  /** Band travel speed in band-widths per second. */
  speed?: number;
  /** Width of one full spectral cycle in pixels. */
  bandWidth?: number;
  /** Spectral stops, cycled seamlessly (last wraps to first). */
  colors?: readonly [string, string, string, string];
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A ribbon of daylight sliding through the words: one spectral gradient
 * flows continuously across the type and leans toward the pointer. The text
 * stays a real, selectable label; under reduced motion it rests as a still
 * spectrum.
 */
export function SpectrumText({
  text = "Everything is light.",
  speed = 0.55,
  bandWidth = 220,
  colors = ["#ff5f6d", "#ffc371", "#7ae7c7", "#5b8cff"],
  disabled = false,
  className,
  style,
}: SpectrumTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return;

    const period = Math.max(40, bandWidth * 2);
    let phase = 0;
    let bias = 0;
    let target = 0;
    let raf = 0;
    let previous = 0;
    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - (previous || time - 16)) / 1000);
      previous = time;
      phase += dt * speed * period;
      bias += (target - bias) * Math.min(1, dt * 6);
      const position = ((phase + bias) % period + period) % period;
      el.style.backgroundPositionX = `${position}px`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      target = ((event.clientX - rect.left) / rect.width - 0.5) * period * 0.5;
    };
    const onLeave = () => {
      target = 0;
    };
    raf = requestAnimationFrame(tick);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [speed, bandWidth, disabled, text]);

  const stops = [...colors, colors[0] ?? "#ffffff"];
  return (
    <span
      ref={ref}
      role="img"
      aria-label={text}
      className={className}
      style={{
        display: "inline-block",
        paddingBlock: 4,
        backgroundImage: `linear-gradient(93deg, ${stops.join(", ")})`,
        backgroundSize: `${Math.max(40, bandWidth * 2)}px 100%`,
        backgroundRepeat: "repeat-x",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        ...style,
      }}
    >
      {text}
    </span>
  );
}
