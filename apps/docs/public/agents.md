# VFX UI — agent guide

# VFX UI

> Shader-native visual effect components for React, rendered via WebGPU (vgpu).
> All effects are GPU-only by design: they cannot be reproduced with DOM/CSS.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

## Component catalog

- [Wave Background](https://vfx-ui.dev/components/wave-background.md): Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.
- [Fluid Gradient](https://vfx-ui.dev/components/fluid-gradient.md): Domain-warped fBm noise flowing through a tri-color palette.
- [Aurora](https://vfx-ui.dev/components/aurora.md): Vertical light curtains driven by fBm perturbation and gaussian bands.
- [Starfield](https://vfx-ui.dev/components/starfield.md): Hashed star grid with twinkle and slow parallax drift.
- [Particle Field](https://vfx-ui.dev/components/particle-field.md): Procedural cell-hashed particles with drift and size breathing.
- [Glass Card](https://vfx-ui.dev/components/glass-card.md): Rounded-rect SDF glass card with sweeping inner highlight and edge refraction.
- [Liquid Glass](https://vfx-ui.dev/components/liquid-glass.md): Fullscreen liquid refraction with approximate chromatic dispersion.
- [Mesh Gradient](https://vfx-ui.dev/components/mesh-gradient.md): Voronoi-cell color fields flowing through a curated palette.
- [Iridescent](https://vfx-ui.dev/components/iridescent.md): Silky thin-film interference colors drifting across the surface.
- [Vortex](https://vfx-ui.dev/components/vortex.md): Spiral galaxy swirl with star speckles and trailing arms.
- [Web Globe](https://vfx-ui.dev/components/web-globe.md): WebGPU re-creation of shuding/cobe (MIT): a tiny dot-matrix globe.
- [Live Chart](https://vfx-ui.dev/components/live-chart.md): Real-time streaming line chart rendered entirely on the GPU.
- [Energy Orb](https://vfx-ui.dev/components/energy-orb.md): Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT, Copyright 2026 Meng To).
- [Ribbon Field](https://vfx-ui.dev/components/ribbon-field.md): Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).
- [Fiber Flow](https://vfx-ui.dev/components/fiber-flow.md): Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).
- [Timeline Arc](https://vfx-ui.dev/components/timeline-arc.md): Milestone timeline on a tilted 3D dial — procedural ruler disk spins under scroll so the active year stays anchored, hexagon marker and dashed callout (sealos.run/about-us style).

## Per-component docs (machine-readable)

- https://vfx-ui.dev/components/aurora.md
- https://vfx-ui.dev/components/energy-orb.md
- https://vfx-ui.dev/components/fiber-flow.md
- https://vfx-ui.dev/components/fluid-gradient.md
- https://vfx-ui.dev/components/glass-card.md
- https://vfx-ui.dev/components/iridescent.md
- https://vfx-ui.dev/components/liquid-glass.md
- https://vfx-ui.dev/components/live-chart.md
- https://vfx-ui.dev/components/mesh-gradient.md
- https://vfx-ui.dev/components/particle-field.md
- https://vfx-ui.dev/components/ribbon-field.md
- https://vfx-ui.dev/components/starfield.md
- https://vfx-ui.dev/components/timeline-arc.md
- https://vfx-ui.dev/components/vortex.md
- https://vfx-ui.dev/components/wave-background.md
- https://vfx-ui.dev/components/web-globe.md

## Scope guard

This library only ships shader-native effects. Do not request DOM animation,
layout components, or heavy 3D scenes (meshes/lights/cameras) — out of scope by charter.


# Aurora

Vertical light curtains driven by fBm perturbation and gaussian bands.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Aurora } from "@vfx-ui/react";

export function Demo() {
  return <Aurora />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Energy Orb

Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT, Copyright 2026 Meng To).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { EnergyOrb } from "@vfx-ui/react";

export function Demo() {
  return <EnergyOrb />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Fiber Flow

Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FiberFlow } from "@vfx-ui/react";

export function Demo() {
  return <FiberFlow />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Fluid Gradient

Domain-warped fBm noise flowing through a tri-color palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FluidGradient } from "@vfx-ui/react";

export function Demo() {
  return <FluidGradient />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Glass Card

Rounded-rect SDF glass card with sweeping inner highlight and edge refraction.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassCard } from "@vfx-ui/react";

export function Demo() {
  return <GlassCard />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Iridescent

Silky thin-film interference colors drifting across the surface.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Iridescent } from "@vfx-ui/react";

export function Demo() {
  return <Iridescent />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Liquid Glass

Fullscreen liquid refraction with approximate chromatic dispersion.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LiquidGlass } from "@vfx-ui/react";

export function Demo() {
  return <LiquidGlass />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Live Chart

Real-time streaming line chart rendered entirely on the GPU.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LiveChart } from "@vfx-ui/react";

export function Demo() {
  return <LiveChart />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Mesh Gradient

Voronoi-cell color fields flowing through a curated palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { MeshGradient } from "@vfx-ui/react";

export function Demo() {
  return <MeshGradient />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Particle Field

Procedural cell-hashed particles with drift and size breathing.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { ParticleField } from "@vfx-ui/react";

export function Demo() {
  return <ParticleField />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Ribbon Field

Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { RibbonField } from "@vfx-ui/react";

export function Demo() {
  return <RibbonField />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Starfield

Hashed star grid with twinkle and slow parallax drift.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Starfield } from "@vfx-ui/react";

export function Demo() {
  return <Starfield />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Timeline Arc

Milestone timeline on a tilted 3D dial — procedural ruler disk spins under scroll so the active year stays anchored, hexagon marker and dashed callout (sealos.run/about-us style).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { TimelineArc } from "@vfx-ui/react";

export function Demo() {
  return <TimelineArc />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Vortex

Spiral galaxy swirl with star speckles and trailing arms.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Vortex } from "@vfx-ui/react";

export function Demo() {
  return <Vortex />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Wave Background

Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { WaveBackground } from "@vfx-ui/react";

export function Demo() {
  return <WaveBackground />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Web Globe

WebGPU re-creation of shuding/cobe (MIT): a tiny dot-matrix globe.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { WebGlobe } from "@vfx-ui/react";

export function Demo() {
  return <WebGlobe />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
