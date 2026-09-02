"use client";

import { useEffect, useRef } from "react";
import { HeroShell } from "./HeroShell";

/**
 * cobe (MIT, Copyright 2026 Shu Ding) — the dot-matrix globe behind
 * vercel.com. Loaded client-side via dynamic import so SSR renders an inert
 * canvas; cobe@2's public API is update()/destroy() (update performs a full
 * render), so rotation is driven by our own rAF loop — version-proof against
 * the onRender API that only exists on cobe's unreleased main branch.
 */
type CobeGlobe = { update: (state: Record<string, unknown>) => void; destroy: () => void };
type CobeMarker = { location: [number, number]; size: number; color?: [number, number, number] };

const DEFAULT_MARKERS: CobeMarker[] = [
  { location: [37.7749, -122.4194], size: 0.04 }, // SF
  { location: [40.7128, -74.006], size: 0.04 }, // NYC
  { location: [51.5074, -0.1278], size: 0.04 }, // London
  { location: [48.8566, 2.3522], size: 0.03 }, // Paris
  { location: [52.52, 13.405], size: 0.03 }, // Berlin
  { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
  { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
  { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
  { location: [19.076, 72.8777], size: 0.03 }, // Mumbai
  { location: [-23.5505, -46.6333], size: 0.03 }, // São Paulo
];

/**
 * cobe 2.0.1 renders any marker that is front-facing OR projects outside the
 * disk, and a marker's round sprite (size*2) centered on the rim pokes half
 * outside the planet outline — dots appear to float. Pre-cull to markers
 * that are front-facing (matching cobe's own O() camera math) AND whose
 * projected center sits well inside the disk (radius < 0.7 of the 0.8 globe,
 * leaving room for the sprite), so every visible dot stays on the planet.
 */
function frontMarkers(markers: CobeMarker[], phi: number, theta: number): CobeMarker[] {
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  return markers.filter((marker) => {
    const lat = (marker.location[0] * Math.PI) / 180;
    const lng = (marker.location[1] * Math.PI) / 180 - Math.PI;
    const cl = Math.cos(lat);
    const x = -cl * Math.cos(lng);
    const y = Math.sin(lat);
    const z = cl * Math.sin(lng);
    const px = cosP * x + sinP * z;
    const py = sinP * sinT * x + cosT * y - cosP * sinT * z;
    const pz = -sinP * cosT * x + sinT * y + cosP * cosT * z;
    return pz > 0.02 && px * px + py * py < 0.49;
  });
}

export interface HeroGlobeProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  scheme?: "dark" | "light";
  /** Spin speed in radians/second; 0 holds the authored framing. */
  spin?: number;
  /** Dot density on the landmasses. */
  mapSamples?: number;
  /** Ocean/base dot color, 0-1 rgb. */
  baseColor?: [number, number, number];
  /** Marker dot color, 0-1 rgb. */
  markerColor?: [number, number, number];
  /** Atmosphere glow color, 0-1 rgb. */
  glowColor?: [number, number, number];
  /** Node markers (defaults to ten major cities). */
  markers?: CobeMarker[];
  /** Escape hatch merged into cobe's update() on every frame. */
  globeProps?: Record<string, unknown>;
}

/** Split layout: copy on the left, a glowing dot-matrix cobe planet on the right. */
export function HeroGlobe({
  eyebrow = "Global by default",
  title = "One network.\nEvery continent.",
  subtitle = "Edge nodes in 34 regions, a dot-matrix planet rendered live with cobe — the globe behind vercel.com. The split layout keeps your copy readable while the planet does the talking.",
  primaryCta = "See the map",
  secondaryCta = "Pricing",
  scheme = "dark",
  spin = 0.12,
  mapSamples = 16000,
  baseColor = [0.3, 0.3, 0.35],
  markerColor = [1, 0.5, 1],
  glowColor = [0.4, 0.6, 1],
  markers = DEFAULT_MARKERS,
  globeProps,
}: HeroGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  // Latest props for the mount-only rAF loop; re-running the effect would
  // tear down and re-create the WebGL context on every parent render.
  const optsRef = useRef({ spin, mapSamples, baseColor, markerColor, glowColor, markers, globeProps });
  optsRef.current = { spin, mapSamples, baseColor, markerColor, glowColor, markers, globeProps };

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let disposed = false;
    let globe: CobeGlobe | null = null;
    let raf = 0;
    let phi = 3.94; // authored framing: four city markers on the facing hemisphere
    let last = 0;
    let width = 0;
    let height = 0;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
    };
    measure();

    const buildState = (): Record<string, unknown> => {
      const { mapSamples: samples, baseColor: base, markerColor: marker, glowColor: glow, markers: nodes, globeProps: extra } = optsRef.current;
      const theta = 0.4;
      return {
        width,
        height,
        devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
        phi,
        theta,
        dark: 0.9,
        diffuse: 1.2,
        scale: 1,
        mapSamples: samples,
        mapBrightness: 6,
        baseColor: base,
        markerColor: marker,
        glowColor: glow,
        offset: [0, 0],
        markerElevation: 0,
        markers: frontMarkers(nodes, phi, theta),
        ...extra,
      };
    };

    const renderFrame = (now: number) => {
      if (!globe) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      phi += optsRef.current.spin * dt;
      globe.update(buildState());
    };

    const loop = (now: number) => {
      if (disposed) return;
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    };

    import("cobe").then((m) => {
      if (disposed) return;
      const create = m.default as unknown as (el: HTMLCanvasElement, opts: Record<string, unknown>) => CobeGlobe;
      globe = create(canvas, buildState());
      if (reduced || optsRef.current.spin <= 0) {
        renderFrame(performance.now());
      } else {
        raf = requestAnimationFrame(loop);
      }
    });

    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      globe?.destroy();
    };
  }, []);

  return (
    <HeroShell
      layout="split"
      scheme={scheme}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={{ label: primaryCta }}
      secondaryCta={{ label: secondaryCta }}
      accent="#7da7fc"
      background={
        // Shift the planet into the right half so the split scrim never slices
        // the sphere — it reads as a planet rising behind the copy column.
        <div ref={stageRef} style={{ position: "absolute", inset: 0, transform: "translateX(22%)" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      }
    />
  );
}

export const HERO_GLOBE_PRESETS = {
  azure: { glowColor: [0.4, 0.6, 1], markerColor: [1, 0.5, 1] },
  teal: { glowColor: [0.2, 0.85, 0.75], markerColor: [0.6, 1, 0.9] },
  ember: { glowColor: [1, 0.55, 0.25], markerColor: [1, 0.8, 0.4], spin: 0.08 },
};
