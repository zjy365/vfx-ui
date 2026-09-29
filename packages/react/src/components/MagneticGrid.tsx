"use client";
import { type CSSProperties, type ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface MagneticGridProps {
  /** Real content floating above the dot lattice. */
  children?: ReactNode;
  /** Lattice columns. */
  columns?: number;
  /** Lattice rows. */
  rows?: number;
  /** Resting dot diameter in pixels. */
  dotSize?: number;
  /** Maximum dot travel in pixels. */
  strength?: number;
  /** Pull radius as a fraction of the grid span. */
  radius?: number;
  /** Whether dots lean toward the pointer or flee it. */
  mode?: "attract" | "repel";
  /** Dot color. */
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A lattice of iron filings for the cursor: each dot feels the pointer's
 * field, slides and swells as it passes, and settles back when it leaves.
 * The dots are decorative only — your content sits above them, fully
 * interactive, and reduced motion leaves a calm, static weave.
 */
export function MagneticGrid({
  children,
  columns = 16,
  rows = 9,
  dotSize = 5,
  strength = 24,
  radius = 0.36,
  mode = "attract",
  color = "#9fb6c2",
  disabled = false,
  className,
  style,
}: MagneticGridProps) {
  const cols = Math.max(1, Math.round(columns));
  const rowCount = Math.max(1, Math.round(rows));
  const dots = cols * rowCount;
  const reach = Math.max(0.05, radius * 2);
  const sign = mode === "repel" ? -1 : 1;

  const ref = usePointerMotion<HTMLDivElement>((el, p) => {
    const lattice = el.querySelector<HTMLElement>("[data-magnetic-lattice]");
    if (!lattice) return;
    Array.from(lattice.children).forEach((child, index) => {
      const dot = child as HTMLElement;
      const column = index % cols;
      const row = Math.floor(index / cols);
      const nx = ((column + 0.5) / cols) * 2 - 1;
      const ny = ((row + 0.5) / rowCount) * 2 - 1;
      const dx = p.x - nx;
      const dy = p.y - ny;
      const distance = Math.hypot(dx, dy);
      const force = Math.exp(-(distance * distance) / (reach * reach)) * p.active;
      if (force < 0.004 || distance < 0.001) {
        dot.style.transform = "";
        dot.style.opacity = "";
        return;
      }
      const travel = force * strength * sign;
      dot.style.transform = `translate3d(${(dx / distance) * travel}px,${
        (dy / distance) * travel
      }px,0) scale(${1 + force * 0.9})`;
      dot.style.opacity = String(0.5 + force * 0.5);
    });
  }, disabled);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <div
        data-magnetic-lattice
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`,
          gridTemplateRows: `repeat(${rowCount},minmax(0,1fr))`,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: dots }, (_, index) => (
          <span
            key={index}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: color,
              opacity: 0.5,
              placeSelf: "center",
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
