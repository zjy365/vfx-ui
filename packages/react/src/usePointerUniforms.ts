"use client";

import { useEffect, useRef, useState } from "react";

export interface PointerUniform {
  x: number;
  y: number;
}

/** Rest position: dead center, so every pointer-driven term is zero at rest. */
export const POINTER_REST: PointerUniform = { x: 0.5, y: 0.5 };

/**
 * Tracks the pointer over a host element and reports it as normalized
 * coordinates, for wiring mouse interaction into shader uniforms.
 *
 * Returns [ref, pointer, active]:
 *  - ref attaches to the component's outer element (the hover surface).
 *  - pointer.x / pointer.y are 0..1 within the element (x right, y DOWN,
 *    matching CSS). Smooth-lerped so the shader doesn't snap; returns to
 *    `rest` on pointerleave.
 *  - active is true only while the pointer is over the element — use it for
 *    effects that must vanish entirely at rest (glare, lens, scrub lines) so
 *    default rendering stays pixel-identical.
 *
 * The rAF loop runs only while the eased value is converging; a resting
 * component never re-renders.
 */
export function usePointerUniforms<T extends HTMLElement>(options?: {
  /** Resting position when the pointer is not over the element. */
  rest?: PointerUniform;
  /** Lerp factor per frame toward the target (0..1). Lower = more smoothing. */
  ease?: number;
}): [React.RefObject<T>, PointerUniform, boolean] {
  const rest = options?.rest ?? POINTER_REST;
  const ease = options?.ease ?? 0.08;
  const ref = useRef<T>(null);
  const [pointer, setPointer] = useState<PointerUniform>(rest);
  const [active, setActive] = useState(false);
  const target = useRef(rest);
  const restRef = useRef(rest);
  restRef.current = rest;
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = () => {
      raf.current = 0;
      setPointer((prev) => {
        const dx = target.current.x - prev.x;
        const dy = target.current.y - prev.y;
        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
          // Converged: snap exactly and stop the loop (renders at most once).
          return prev.x === target.current.x && prev.y === target.current.y
            ? prev
            : target.current;
        }
        raf.current = requestAnimationFrame(tick);
        return { x: prev.x + dx * ease, y: prev.y + dy * ease };
      });
    };
    const kick = () => {
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      target.current = {
        x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
      };
      setActive(true);
      kick();
    };
    const onLeave = () => {
      target.current = restRef.current;
      setActive(false);
      kick();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // rest/ease identity is intentionally stable per call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  return [ref, pointer, active];
}
