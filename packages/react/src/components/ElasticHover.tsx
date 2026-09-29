"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface ElasticHoverProps {
  children?: ReactNode;
  /** Hover grow amount (scale fraction). */
  grow?: number;
  /** Press squash amount (scale fraction). */
  squash?: number;
  /** Spring stiffness in radians per second. */
  stiffness?: number;
  /** Damping ratio; below 1 the settle overshoots like real rubber. */
  damping?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Rubber around whatever you wrap: hovering swells it, pressing squashes it
 * wide, and an under-damped spring snaps it back with a wobble. The inner
 * element keeps its own semantics — buttons stay buttons, links stay links —
 * and reduced motion leaves the content perfectly still and usable.
 */
export function ElasticHover({
  children,
  grow = 0.05,
  squash = 0.12,
  stiffness = 190,
  damping = 0.55,
  disabled = false,
  className,
  style,
}: ElasticHoverProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return;
    const content = el.firstElementChild as HTMLElement | null;
    if (!content) return;

    // Two under-damped springs: x = hover swell, y = press squash.
    const state = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let raf = 0;
    let previous = 0;
    const omega = Math.max(30, stiffness);
    const zeta = Math.min(0.95, Math.max(0.15, damping));
    const paint = () => {
      const scaleX = 1 + state.x * grow + state.y * squash * 0.72;
      const scaleY = 1 + state.x * grow * 0.6 - state.y * squash;
      content.style.transform =
        state.x === 0 && state.y === 0 && state.tx === 0 && state.ty === 0
          ? ""
          : `scale(${scaleX.toFixed(4)},${scaleY.toFixed(4)})`;
    };
    const tick = (time: number) => {
      const dt = Math.min(0.04, (time - (previous || time - 16)) / 1000);
      previous = time;
      const ax = omega * omega * (state.tx - state.x) -
        2 * zeta * omega * state.vx;
      const ay = omega * omega * (state.ty - state.y) -
        2 * zeta * omega * state.vy;
      state.vx += ax * dt;
      state.vy += ay * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      const settled =
        Math.abs(state.tx - state.x) + Math.abs(state.vx) +
        Math.abs(state.ty - state.y) + Math.abs(state.vy) < 0.0004;
      if (settled) {
        state.x = state.tx;
        state.y = state.ty;
        state.vx = 0;
        state.vy = 0;
      }
      paint();
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        previous = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => {
      state.tx = 1;
      kick();
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      kick();
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      state.ty = 1;
      kick();
    };
    const onUp = () => {
      state.ty = 0;
      kick();
    };
    const onKeyIn = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== " " && event.key !== "Enter")) return;
      state.ty = 1;
      kick();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      state.ty = 0;
      kick();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("keydown", onKeyIn);
    el.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("keydown", onKeyIn);
      el.removeEventListener("keyup", onKeyUp);
    };
  }, [grow, squash, stiffness, damping, disabled]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", padding: 14, ...style }}
    >
      <span
        style={{
          display: "inline-flex",
          willChange: "transform",
          transformOrigin: "50% 50%",
        }}
      >
        {children ?? (
          <button
            type="button"
            style={{
              padding: "16px 30px",
              borderRadius: 14,
              border: 0,
              background: "#e9efef",
              color: "#111",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Give it a squeeze
          </button>
        )}
      </span>
    </span>
  );
}
