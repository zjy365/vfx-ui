"use client";
import type { CSSProperties, ReactNode } from "react";
import { usePointerMotion } from "../usePointerMotion";

export interface SpectralCardProps {
  children?: ReactNode;
  /** Maximum tilt in degrees. */
  tilt?: number;
  /** Light strength, from 0 to 1. */
  glare?: number;
  radius?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A holographic material around real DOM content. No GPU support required. */
export function SpectralCard({
  children,
  tilt = 12,
  glare = 0.6,
  radius = 24,
  disabled = false,
  className,
  style,
}: SpectralCardProps) {
  const ref = usePointerMotion<HTMLDivElement>((el, p) => {
    const layer = el.firstElementChild as HTMLElement | null;
    if (!layer) return;
    layer.style.transform = `perspective(900px) rotateX(${-p.y * tilt}deg) rotateY(${p.x * tilt}deg)`;
    layer.style.setProperty("--spectral-x", `${50 + p.x * 45}%`);
    layer.style.setProperty("--spectral-y", `${50 + p.y * 45}%`);
    layer.style.setProperty("--spectral-light", String(p.active * glare));
  }, disabled);
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
          minHeight: 240,
          borderRadius: radius,
          overflow: "hidden",
          background: "#14191d",
          color: "#f3f4ef",
          border: "1px solid #ffffff26",
          boxShadow: "0 24px 48px -28px #0008",
          transformStyle: "preserve-3d",
        }}
      >
        {children ?? (
          <div
            style={{
              padding: "clamp(24px,6vw,48px)",
              minHeight: 280,
              display: "flex",
              height: "100%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: ".08em",
                position: "relative",
                zIndex: 1,
              }}
            >
              VFX / MATERIAL STUDY
            </span>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 190,
                height: 190,
                top: 35,
                right: -28,
                transform: "rotate(-26deg)",
                pointerEvents: "none",
              }}
            >
              {[0, 1, 2].map((ring) => (
                <span
                  key={ring}
                  style={{
                    position: "absolute",
                    inset: ring * 23,
                    border: `${16 - ring * 2}px solid ${["#aebdb0", "#becbac", "#e4e5c7"][ring]}`,
                    borderRadius: "50%",
                    transform: `rotateX(${55 - ring * 10}deg) rotateY(${ring * 20}deg)`,
                    boxShadow:
                      "inset 5px 4px 10px #ffffff88,6px 10px 18px #0006",
                  }}
                />
              ))}
            </div>
            <strong
              style={{
                fontSize: "clamp(32px,5vw,60px)",
                letterSpacing: "-.04em",
                lineHeight: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              Light has
              <br />a soft side.
            </strong>
            <span style={{ fontSize: 13, color: "#adb8bd" }}>
              Move across the surface
            </span>
          </div>
        )}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            opacity: "var(--spectral-light, 0)",
            background:
              "radial-gradient(ellipse at var(--spectral-x,50%) var(--spectral-y,50%),#fff9,transparent 65%),repeating-linear-gradient(115deg,#89d9f5 0%,#bcb8f4 18%,#ecbbba 32%,#b9ead5 48%,#89d9f5 64%)",
            mixBlendMode: "color-dodge",
          }}
        />
      </div>
    </div>
  );
}
