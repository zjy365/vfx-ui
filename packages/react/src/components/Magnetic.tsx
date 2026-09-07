"use client";
import type { CSSProperties, ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface MagneticProps {
  children?: ReactNode;
  /** Maximum travel in pixels. */
  strength?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A stable hit area with a movable content layer. Links keep native semantics. */
export function Magnetic({
  children,
  strength = 18,
  disabled = false,
  className,
  style,
}: MagneticProps) {
  const ref = usePointerMotion<HTMLSpanElement>((el, p) => {
    const content = el.firstElementChild as HTMLElement | null;
    if (content)
      content.style.transform = `translate3d(${p.x * strength}px,${p.y * strength}px,0)`;
  }, disabled);
  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", padding: 18, ...style }}
    >
      <span style={{ display: "inline-flex" }}>
        {children ?? (
          <button
            type="button"
            style={{
              padding: "18px 30px",
              borderRadius: 99,
              border: 0,
              background: "#e9efef",
              color: "#111",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Move closer
          </button>
        )}
      </span>
    </span>
  );
}
