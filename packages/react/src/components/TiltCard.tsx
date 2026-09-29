"use client";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface TiltCardProps {
  children?: ReactNode;
  /** Maximum tilt in degrees. */
  tilt?: number;
  /** Specular highlight strength, from 0 to 1. */
  glare?: number;
  /** Card corner radius in pixels. */
  radius?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A porcelain card on a gimbal: the surface tilts in space while a specular
 * highlight (and its soft counter-shade) tracks the pointer across it. Real
 * DOM content rides a raised layer for parallax; keyboard focus brings the
 * same highlight home, and reduced motion leaves a flat, fully readable card.
 */
export function TiltCard({
  children,
  tilt = 10,
  glare = 0.55,
  radius = 20,
  disabled = false,
  className,
  style,
}: TiltCardProps) {
  const ref = usePointerMotion<HTMLDivElement>((el, p) => {
    const layer = el.firstElementChild as HTMLElement | null;
    if (!layer) return;
    layer.style.transform = `perspective(1000px) rotateX(${-p.y * tilt}deg) rotateY(${p.x * tilt}deg)`;
    layer.style.setProperty("--tilt-x", `${50 + p.x * 48}%`);
    layer.style.setProperty("--tilt-y", `${50 + p.y * 48}%`);
    layer.style.setProperty("--tilt-light", String(p.active * glare));
  }, disabled);

  /** Keyboard parity: the highlight finds whichever inner element has focus. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const aim = (event: FocusEvent) => {
      const layer = el.firstElementChild as HTMLElement | null;
      if (!layer) return;
      const target = event.target as HTMLElement | null;
      const card = layer.getBoundingClientRect();
      const spot = target?.getBoundingClientRect();
      if (!spot || !card.width || !card.height) return;
      layer.style.setProperty(
        "--tilt-x",
        `${((spot.left + spot.width / 2 - card.left) / card.width) * 100}%`,
      );
      layer.style.setProperty(
        "--tilt-y",
        `${((spot.top + spot.height / 2 - card.top) / card.height) * 100}%`,
      );
      layer.style.setProperty("--tilt-light", String(glare * 0.8));
    };
    const dim = () => {
      const layer = el.firstElementChild as HTMLElement | null;
      layer?.style.setProperty("--tilt-light", "0");
    };
    el.addEventListener("focusin", aim);
    el.addEventListener("focusout", dim);
    return () => {
      el.removeEventListener("focusin", aim);
      el.removeEventListener("focusout", dim);
    };
  }, [glare, ref]);

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
          width: "100%",
          height: "100%",
          minHeight: 260,
          borderRadius: radius,
          overflow: "hidden",
          background: "linear-gradient(178deg,#f1f2ec,#e2e5dd)",
          color: "#1b1f1d",
          border: "1px solid #00000014",
          boxShadow: "0 30px 60px -34px #0007",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            transform: "translateZ(34px)",
            padding: "clamp(22px,5vw,44px)",
          }}
        >
          {children ?? (
            <div
              style={{
                display: "flex",
                height: "100%",
                minHeight: 220,
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#5c6460",
                }}
              >
                VFX / SURFACE STUDY
              </span>
              <strong
                style={{
                  fontSize: "clamp(30px,4.6vw,56px)",
                  letterSpacing: "-.03em",
                  lineHeight: 1.02,
                }}
              >
                Porcelain
                <br />
                under studio light.
              </strong>
              <span style={{ fontSize: 13, color: "#5c6460" }}>
                Tilt me — the glare follows your hand.
              </span>
            </div>
          )}
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            opacity: "var(--tilt-light, 0)",
            background:
              "radial-gradient(340px circle at var(--tilt-x,50%) var(--tilt-y,50%),#ffffffe6,transparent 62%),linear-gradient(155deg,#00000000 42%,#0000001f 100%)",
          }}
        />
      </div>
    </div>
  );
}
