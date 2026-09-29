"use client";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface PointerGlowProps {
  /** Real content lit by the wandering source. */
  children?: ReactNode;
  /** Light reach in pixels. */
  radius?: number;
  /** Light strength, from 0 to 1. */
  intensity?: number;
  /** How dark the room is away from the pointer, from 0 to 1. */
  dim?: number;
  /** Light color. */
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A handheld light for layouts: the region dims slightly and a warm source
 * follows the pointer, brightening whatever it rests on. Keyboard focus
 * carries the light to the focused control; reduced motion keeps the room
 * fully lit and untouched.
 */
export function PointerGlow({
  children,
  radius = 300,
  intensity = 0.5,
  dim = 0.32,
  color = "#ffdfae",
  disabled = false,
  className,
  style,
}: PointerGlowProps) {
  const ref = usePointerMotion<HTMLDivElement>((el, p) => {
    const light = el.querySelector<HTMLDivElement>("[data-pointer-glow-light]");
    const veil = el.querySelector<HTMLDivElement>("[data-pointer-glow-veil]");
    if (!light || !veil) return;
    const x = `${50 + p.x * 50}%`;
    const y = `${50 + p.y * 50}%`;
    light.style.setProperty("--glow-x", x);
    light.style.setProperty("--glow-y", y);
    veil.style.setProperty("--glow-x", x);
    veil.style.setProperty("--glow-y", y);
    light.style.setProperty("--glow-on", String(p.active));
    veil.style.setProperty("--glow-on", String(p.active));
  }, disabled);

  /** Keyboard parity: the light finds whichever inner element has focus. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const aim = (event: FocusEvent) => {
      const light = el.querySelector<HTMLDivElement>("[data-pointer-glow-light]");
      const veil = el.querySelector<HTMLDivElement>("[data-pointer-glow-veil]");
      if (!light || !veil) return;
      const room = el.getBoundingClientRect();
      const spot = (event.target as HTMLElement | null)?.getBoundingClientRect();
      if (!spot || !room.width || !room.height) return;
      const x = `${((spot.left + spot.width / 2 - room.left) / room.width) * 100}%`;
      const y = `${((spot.top + spot.height / 2 - room.top) / room.height) * 100}%`;
      for (const layer of [light, veil]) {
        layer.style.setProperty("--glow-x", x);
        layer.style.setProperty("--glow-y", y);
        layer.style.setProperty("--glow-on", "1");
      }
    };
    const settle = () => {
      const light = el.querySelector<HTMLDivElement>("[data-pointer-glow-light]");
      const veil = el.querySelector<HTMLDivElement>("[data-pointer-glow-veil]");
      light?.style.setProperty("--glow-on", "0");
      veil?.style.setProperty("--glow-on", "0");
    };
    el.addEventListener("focusin", aim);
    el.addEventListener("focusout", settle);
    return () => {
      el.removeEventListener("focusin", aim);
      el.removeEventListener("focusout", settle);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      <div
        data-pointer-glow-veil
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: "var(--glow-on, 0)",
          background: `radial-gradient(circle ${radius}px at var(--glow-x,50%) var(--glow-y,50%), transparent 0%, transparent 52%, rgba(6,9,14,${dim}) 100%)`,
        }}
      />
      <div
        data-pointer-glow-light
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          mixBlendMode: "screen",
          background: `radial-gradient(circle ${radius}px at var(--glow-x,50%) var(--glow-y,50%), ${color}, transparent 68%)`,
          opacity: `calc(var(--glow-on, 0) * ${intensity})`,
        }}
      />
    </div>
  );
}
