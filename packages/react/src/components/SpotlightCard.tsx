"use client";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface SpotlightCardProps {
  children?: ReactNode;
  /** Beam radius in pixels. */
  radius?: number;
  /** How dark the card is outside the beam, from 0 to 1. */
  darkness?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A card played under a torch: a soft pool of light rests at the center,
 * then follows the pointer to uncover what is written there. Keyboard focus
 * widens the beam around the focused element, and reduced motion lifts the
 * darkness entirely.
 */
export function SpotlightCard({
  children,
  radius = 190,
  darkness = 0.86,
  disabled = false,
  className,
  style,
}: SpotlightCardProps) {
  const ref = usePointerMotion<HTMLDivElement>((el, p) => {
    const beam = el.querySelector<HTMLDivElement>("[data-spotlight-beam]");
    if (!beam) return;
    beam.style.setProperty("--spot-x", `${50 + p.x * 46}%`);
    beam.style.setProperty("--spot-y", `${50 + p.y * 46}%`);
    beam.style.setProperty("--spot-r", `${Math.max(60, radius * (0.62 + p.active * 0.38))}px`);
  }, disabled);

  /** Keyboard parity: the beam opens around whichever inner element has focus. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const open = (event: FocusEvent) => {
      const beam = el.querySelector<HTMLDivElement>("[data-spotlight-beam]");
      if (!beam) return;
      const card = el.getBoundingClientRect();
      const spot = (event.target as HTMLElement | null)?.getBoundingClientRect();
      if (!spot || !card.width || !card.height) return;
      beam.style.setProperty(
        "--spot-x",
        `${((spot.left + spot.width / 2 - card.left) / card.width) * 100}%`,
      );
      beam.style.setProperty(
        "--spot-y",
        `${((spot.top + spot.height / 2 - card.top) / card.height) * 100}%`,
      );
      beam.style.setProperty("--spot-r", `${Math.max(160, radius * 1.5)}px`);
    };
    el.addEventListener("focusin", open);
    return () => {
      el.removeEventListener("focusin", open);
    };
  }, [radius, ref]);

  /** Reduced motion: a still card must stay fully readable. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const beam = () =>
      el.querySelector<HTMLDivElement>("[data-spotlight-beam]");
    const sync = () => {
      const layer = beam();
      if (layer)
        layer.style.setProperty("--spot-off", media?.matches ? "1" : "0");
    };
    sync();
    media?.addEventListener?.("change", sync);
    return () => media?.removeEventListener?.("change", sync);
  }, [ref]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    >
      <div
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          minHeight: 280,
          borderRadius: 22,
          background: "linear-gradient(170deg,#14181d,#0b0e12)",
          color: "#e9e4d8",
          border: "1px solid #ffffff14",
          boxShadow: "0 34px 64px -38px #000a",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          {children ?? (
            <div
              style={{
                display: "flex",
                height: "100%",
                minHeight: 260,
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 18,
                padding: "clamp(24px,5vw,48px)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#8b937f",
                }}
              >
                VFX / DARK ROOM
              </span>
              <strong
                style={{
                  fontSize: "clamp(28px,4.4vw,54px)",
                  letterSpacing: "-.03em",
                  lineHeight: 1.04,
                }}
              >
                Some pages keep
                <br />
                their secrets lit.
              </strong>
              <span style={{ fontSize: 13, color: "#9aa18f" }}>
                Sweep the card to bring the copy into the beam.
              </span>
            </div>
          )}
        </div>
        <div
          data-spotlight-beam
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            opacity: "calc(1 - var(--spot-off, 0))",
            background: `radial-gradient(circle var(--spot-r, ${Math.max(60, radius * 0.62)}px) at var(--spot-x, 50%) var(--spot-y, 46%), transparent 0%, transparent 56%, rgba(4,6,10,${darkness}) 78%)`,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            opacity: "calc((1 - var(--spot-off, 0)) * 0.5)",
            background:
              `radial-gradient(circle var(--spot-r, ${Math.max(60, radius * 0.62)}px) at var(--spot-x,50%) var(--spot-y,46%), ` +
              "transparent 64%, rgba(255,214,150,0.14) 72%, transparent 82%)",
          }}
        />
      </div>
    </div>
  );
}
