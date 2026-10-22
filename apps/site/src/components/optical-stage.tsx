"use client";
import { useRef } from "react";
export function OpticalStage() {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: React.PointerEvent) {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !ref.current
    )
      return;
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--pointer-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 14}px`,
    );
    ref.current.style.setProperty(
      "--pointer-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 14}px`,
    );
  }
  function reset() {
    ref.current?.style.setProperty("--pointer-x", "0px");
    ref.current?.style.setProperty("--pointer-y", "0px");
  }
  return (
    <div
      ref={ref}
      className="optical-stage"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <span className="stage-label">VFX MATERIAL STUDIES / 001</span>
      <a href="/heroes/hero-contour/" className="optical-poster">
        <span className="eyebrow">OPTICAL / 01</span>
        <svg viewBox="0 0 224 220" aria-hidden="true">
          <g fill="none" stroke="currentColor">
            {[96, 78, 54, 26].map((rx) => (
              <ellipse key={rx} cx="112" cy="112" rx={rx} ry="82" />
            ))}
            <path d="M16 112h192M30 72h164M30 152h164" />
          </g>
        </svg>
        <span className="poster-caption">
          Orbital study <span>↗</span>
        </span>
      </a>
      <a
        className="magnetic-card"
        href="/interactions/magnetic/"
        onFocus={reset}
      >
        <span className="eyebrow">MOVE TO INTERACT</span>
        <span className="magnetic-dot">↗</span>
        <strong>A little magnetic.</strong>
      </a>
      <div className="stage-caption">
        <p>
          Your content.
          <br />
          Our expressive layer.
        </p>
        <span className="stage-swatches" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
