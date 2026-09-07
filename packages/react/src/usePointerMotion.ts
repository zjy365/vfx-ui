"use client";

import { useEffect, useRef } from "react";

export type MotionPoint = { x: number; y: number; active: number };

/** Pointer motion stays off React's render path. Sleeps when settled. */
export function usePointerMotion<T extends HTMLElement>(
  paint: (element: T, point: MotionPoint) => void,
  disabled = false,
) {
  const ref = useRef<T>(null);
  const paintRef = useRef(paint);
  paintRef.current = paint;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let previous = 0;
    let point: MotionPoint = { x: 0, y: 0, active: 0 };
    let target = { ...point };
    const tick = (time: number) => {
      const step =
        1 - Math.exp(-Math.min(time - (previous || time - 16), 64) / 80);
      previous = time;
      point = {
        x: point.x + (target.x - point.x) * step,
        y: point.y + (target.y - point.y) * step,
        active: point.active + (target.active - point.active) * step,
      };
      const distance =
        Math.abs(target.x - point.x) +
        Math.abs(target.y - point.y) +
        Math.abs(target.active - point.active);
      if (distance < 0.001) point = { ...target };
      paintRef.current(element, point);
      raf = distance < 0.001 ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        previous = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const move = (event: PointerEvent) => {
      if (disabled || media?.matches || event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target = {
        x: Math.max(
          -1,
          Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
        ),
        y: Math.max(
          -1,
          Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
        ),
        active: 1,
      };
      kick();
    };
    const reset = () => {
      target = { x: 0, y: 0, active: 0 };
      kick();
    };
    const preference = () => {
      if (media?.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        point = target = { x: 0, y: 0, active: 0 };
        paintRef.current(element, point);
      }
    };
    paintRef.current(element, point);
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", reset);
    element.addEventListener("pointercancel", reset);
    media?.addEventListener?.("change", preference);
    return () => {
      cancelAnimationFrame(raf);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      element.removeEventListener("pointercancel", reset);
      media?.removeEventListener?.("change", preference);
    };
  }, [disabled]);
  return ref;
}
