"use client";
import { useEffect, useRef, type CSSProperties } from "react";

export interface RippleTextProps {
  text?: string;
  /** Peak letter displacement in pixels. */
  amplitude?: number;
  /** Wavefront travel speed in text-widths per second. */
  speed?: number;
  /** Ring thickness as a fraction of the text width. */
  width?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Ripple {
  x: number;
  y: number;
  start: number;
}

/**
 * Type you can touch: a click (or tap) drops a ripple that travels outward
 * through the letters, and a resting pointer leaves a soft dimple. The words
 * remain one accessible label; reduced-motion readers get still, plain text.
 */
export function RippleText({
  text = "Drop a stone.",
  amplitude = 15,
  speed = 0.9,
  width = 0.22,
  disabled = false,
  className,
  style,
}: RippleTextProps) {
  const letters = Array.from(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return;

    const ripples: Ripple[] = [];
    const pointer = { x: 0, y: 0, on: false };
    let centers: { x: number; y: number }[] = [];
    let raf = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      centers = Array.from(el.children).map((child) => {
        const r = (child as HTMLElement).getBoundingClientRect();
        return {
          x: r.left - rect.left + r.width / 2,
          y: r.top - rect.top + r.height / 2,
        };
      });
    };
    const local = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };
    const tick = (time: number) => {
      raf = 0;
      if (!centers.length || centers.length !== el.children.length) measure();
      const span = Math.max(1, el.getBoundingClientRect().width);
      const speedPx = Math.max(24, speed * span);
      const widthPx = Math.max(8, width * span);
      const now = time / 1000;
      let peak = 0;
      Array.from(el.children).forEach((child, index) => {
        const center = centers[index];
        if (!center) return;
        let dx = 0;
        let dy = 0;
        for (const ripple of ripples) {
          const ox = center.x - ripple.x;
          const oy = center.y - ripple.y;
          const dist = Math.hypot(ox, oy);
          const age = now - ripple.start;
          if (age < 0) continue;
          const ring = Math.exp(
            -Math.pow((dist - speedPx * age) / widthPx, 2),
          );
          const push =
            amplitude * ring * Math.exp(-age * 1.5) * Math.min(1, age * 12);
          if (push < 0.05 || dist < 0.5) continue;
          dx += (ox / dist) * push;
          dy += (oy / dist) * push;
          peak = Math.max(peak, push);
        }
        if (pointer.on) {
          const ox = center.x - pointer.x;
          const oy = center.y - pointer.y;
          const dist = Math.hypot(ox, oy);
          const near = Math.exp(-Math.pow(dist / (widthPx * 0.8), 2));
          const push = amplitude * 0.4 * near;
          if (dist > 0.5 && push > 0.05) {
            dx += (ox / dist) * push;
            dy += (oy / dist) * push;
            peak = Math.max(peak, push);
          }
        }
        (child as HTMLElement).style.transform =
          dx || dy ? `translate3d(${dx}px,${dy}px,0)` : "";
      });
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - (ripples[i]?.start ?? 0) > 3) ripples.splice(i, 1);
      }
      if (peak > 0.1 || pointer.on) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const at = local(event);
      pointer.x = at.x;
      pointer.y = at.y;
      pointer.on = true;
      kick();
    };
    const onDown = (event: PointerEvent) => {
      const at = local(event);
      ripples.push({ x: at.x, y: at.y, start: performance.now() / 1000 });
      if (ripples.length > 8) ripples.shift();
      kick();
    };
    const onLeave = () => {
      pointer.on = false;
      kick();
    };

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            centers = [];
          });
    observer?.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, [amplitude, speed, width, disabled, text]);

  return (
    <span
      ref={ref}
      role="img"
      aria-label={text}
      className={className}
      style={{
        display: "inline-block",
        padding: `${Math.max(0, amplitude)}px ${Math.max(4, amplitude)}px`,
        cursor: "default",
        touchAction: "manipulation",
        ...style,
      }}
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
