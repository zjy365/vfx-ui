"use client";

import { useEffect, useRef, type RefObject } from "react";

/** One bounded canvas, asleep offscreen and under reduced motion. */
export function FooterArtwork({
  kind,
  surface,
  brand = "",
  color,
  interactive,
  animate = false,
}: {
  kind: "tidal" | "phosphor";
  surface: RefObject<HTMLElement>;
  brand?: string;
  color: string;
  interactive: boolean;
  animate?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const host = surface.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1,
      height = 1,
      frame = 0,
      last = 0,
      time = 0,
      visible = true,
      disposed = false;
    let x = 0.55,
      y = 0.5,
      tx = 0.55,
      ty = 0.5,
      active = 0,
      ta = 0;
    let dots: { x: number; y: number; phase: number }[] = [];
    let spacing = 5;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      if (kind === "phosphor") {
        const radius = Math.min(width * 0.2, 150);
        for (const dot of dots) {
          const dx = dot.x - x * width,
            dy = dot.y - y * height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force =
            Math.pow(Math.max(0, 1 - distance / radius), 2) * active;
          const driftX = (dx / (distance || 1)) * force * 65;
          const driftY = (dy / (distance || 1)) * force * 65;
          ctx.globalAlpha = 0.76 + 0.24 * (1 - dot.x / width);
          ctx.fillRect(
            dot.x + driftX,
            dot.y + driftY,
            spacing * 0.61,
            spacing * 0.61,
          );
        }
        ctx.globalAlpha = 1;
        return;
      }
      const horizon = height * 0.1;
      const lines = 58;
      for (let row = 0; row < lines; row++) {
        const depth = row / (lines - 1);
        const spread = Math.pow(depth, 1.75);
        ctx.beginPath();
        for (let col = 0; col <= 150; col++) {
          const u = col / 150;
          const wave =
            Math.sin(u * 8.5 + depth * 5 - time * 0.22) * 0.58 +
            Math.sin(u * 15 - depth * 3 + time * 0.17) * 0.2;
          const envelope = Math.sin(u * Math.PI) ** 0.65;
          const dx = u - x;
          const pull = Math.exp(-dx * dx * 30) * active * (y - 0.35) * 100;
          const yy =
            horizon +
            spread * height * 0.75 +
            wave * envelope * height * 0.25 * (0.2 + depth) +
            pull * depth;
          if (col === 0) ctx.moveTo(0, yy);
          else ctx.lineTo(u * width, yy);
        }
        ctx.lineWidth = 0.55 + depth * 0.35;
        ctx.globalAlpha = 0.09 + depth * 0.62;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || disposed) return;
      const dt = Math.min(64, now - (last || now - 16));
      last = now;
      const ease = 1 - Math.exp(-dt / 100);
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      active += (ta - active) * ease;
      if (!reduced.matches && animate) time += dt / 1000;
      draw();
      const moving =
        Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ta - active) > 0.0005;
      if (!reduced.matches && (animate || moving))
        frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible && !disposed) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (kind === "phosphor") {
        const mask = document.createElement("canvas");
        mask.width = Math.ceil(width);
        mask.height = Math.ceil(height);
        const m = mask.getContext("2d", { willReadFrequently: true });
        dots = [];
        if (m && brand.trim()) {
          const family =
            getComputedStyle(host)
              .getPropertyValue("--vfx-footer-display")
              .trim() || getComputedStyle(host).fontFamily;
          m.font = `900 ${height * 0.95}px ${family}`;
          const measured = Math.max(1, m.measureText(brand).width);
          const scaleX = (width * 0.95) / measured;
          m.setTransform(scaleX, 0, 0, 1, 0, 0);
          m.textAlign = "center";
          m.textBaseline = "middle";
          m.fillStyle = "white";
          m.fillText(brand, width / (2 * scaleX), height * 0.51);
          const data = m.getImageData(0, 0, mask.width, mask.height).data;
          spacing = Math.max(3, width / 205);
          for (let py = 0; py < height; py += spacing)
            for (let px = 0; px < width; px += spacing) {
              if (
                (data[(Math.floor(py) * mask.width + Math.floor(px)) * 4 + 3] ??
                  0) > 100
              )
                dots.push({ x: px, y: py, phase: px * 0.047 + py * 0.031 });
            }
        }
      }
      draw();
      canvas.dataset.ready = "true";
      wake();
    };
    const move = (event: PointerEvent) => {
      if (!interactive || reduced.matches || event.pointerType === "touch")
        return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      ty = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      ta = 1;
      wake();
    };
    const leave = () => {
      ta = 0;
      wake();
    };
    const preference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      active = ta = 0;
      x = tx = 0.55;
      y = ty = 0.5;
      draw();
      if (!reduced.matches) wake();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const visibility =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            if (visible) wake();
            else {
              cancelAnimationFrame(frame);
              frame = 0;
            }
          });
    visibility?.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    reduced.addEventListener("change", preference);
    resize();
    document.fonts?.ready.then(() => {
      if (!disposed) resize();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility?.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      reduced.removeEventListener("change", preference);
    };
  }, [kind, brand, color, interactive, animate, surface]);
  return <canvas ref={ref} aria-hidden="true" />;
}
