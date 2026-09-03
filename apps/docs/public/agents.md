# VFX UI — agent guide

# VFX UI

> Shader-native visual effect components for React, rendered via WebGPU (vgpu).
> All effects are GPU-only by design: they cannot be reproduced with DOM/CSS.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

## Component catalog

- [Wave Background](https://vfx-ui.com/components/wave-background.md): Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.
- [Fluid Gradient](https://vfx-ui.com/components/fluid-gradient.md): Domain-warped fBm noise flowing through a tri-color palette.
- [Aurora](https://vfx-ui.com/components/aurora.md): Vertical light curtains driven by fBm perturbation and gaussian bands.
- [Starfield](https://vfx-ui.com/components/starfield.md): Hashed star grid with twinkle and slow parallax drift.
- [Particle Field](https://vfx-ui.com/components/particle-field.md): Procedural cell-hashed particles with drift and size breathing.
- [Glass Card](https://vfx-ui.com/components/glass-card.md): Rounded-rect SDF glass card with sweeping inner highlight and edge refraction.
- [Liquid Glass](https://vfx-ui.com/components/liquid-glass.md): Fullscreen liquid refraction with approximate chromatic dispersion.
- [Glass Lens](https://vfx-ui.com/components/glass-lens.md): Floating liquid-glass pill lens over a living color field: cylindrical rim refraction, RGB dispersion, rotating specular sweep.
- [Black Hole](https://vfx-ui.com/components/black-hole.md): The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).
- [Mesh Gradient](https://vfx-ui.com/components/mesh-gradient.md): Voronoi-cell color fields flowing through a curated palette.
- [Iridescent](https://vfx-ui.com/components/iridescent.md): Silky thin-film interference colors drifting across the surface.
- [Vortex](https://vfx-ui.com/components/vortex.md): Spiral galaxy swirl with star speckles and trailing arms.
- [Web Globe](https://vfx-ui.com/components/web-globe.md): WebGPU re-creation of shuding/cobe (MIT): a tiny dot-matrix globe.
- [Live Chart](https://vfx-ui.com/components/live-chart.md): Real-time streaming line chart rendered entirely on the GPU.
- [Energy Orb](https://vfx-ui.com/components/energy-orb.md): Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT, Copyright 2026 Meng To).
- [Ribbon Field](https://vfx-ui.com/components/ribbon-field.md): Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).
- [Fiber Flow](https://vfx-ui.com/components/fiber-flow.md): Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).
- [Light Prism](https://vfx-ui.com/components/light-prism.md): Frosted glass prism on warm paper with a light beam bending through it — SDF triangle glass, cast shadow, and RGB dispersion (pointer tilt opt-in).
- [Hero Fluid](https://vfx-ui.com/components/hero-fluid.md): Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.
- [Hero Aurora](https://vfx-ui.com/components/hero-aurora.md): Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.
- [Hero Fiber](https://vfx-ui.com/components/hero-fiber.md): Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.
- [Hero Globe](https://vfx-ui.com/components/hero-globe.md): Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.
- [Hero Mesh](https://vfx-ui.com/components/hero-mesh.md): Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.
- [Hero Iridescent](https://vfx-ui.com/components/hero-iridescent.md): Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.
- [Hero Vortex](https://vfx-ui.com/components/hero-vortex.md): Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.
- [Hero Ribbon](https://vfx-ui.com/components/hero-ribbon.md): Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.
- [Hero Particles](https://vfx-ui.com/components/hero-particles.md): Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.
- [Hero Starfield](https://vfx-ui.com/components/hero-starfield.md): Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.
- [Hero Black Hole](https://vfx-ui.com/components/hero-black-hole.md): Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.
- [Chroma Flow](https://vfx-ui.com/components/chroma-flow.md): Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.
- [Hero Chroma](https://vfx-ui.com/components/hero-chroma.md): Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.

## Per-component docs (machine-readable)

- https://vfx-ui.com/components/aurora.md
- https://vfx-ui.com/components/black-hole.md
- https://vfx-ui.com/components/chroma-flow.md
- https://vfx-ui.com/components/energy-orb.md
- https://vfx-ui.com/components/fiber-flow.md
- https://vfx-ui.com/components/fluid-gradient.md
- https://vfx-ui.com/components/glass-card.md
- https://vfx-ui.com/components/glass-lens.md
- https://vfx-ui.com/components/hero-aurora.md
- https://vfx-ui.com/components/hero-black-hole.md
- https://vfx-ui.com/components/hero-chroma.md
- https://vfx-ui.com/components/hero-fiber.md
- https://vfx-ui.com/components/hero-fluid.md
- https://vfx-ui.com/components/hero-globe.md
- https://vfx-ui.com/components/hero-iridescent.md
- https://vfx-ui.com/components/hero-mesh.md
- https://vfx-ui.com/components/hero-particles.md
- https://vfx-ui.com/components/hero-ribbon.md
- https://vfx-ui.com/components/hero-starfield.md
- https://vfx-ui.com/components/hero-vortex.md
- https://vfx-ui.com/components/iridescent.md
- https://vfx-ui.com/components/light-prism.md
- https://vfx-ui.com/components/liquid-glass.md
- https://vfx-ui.com/components/live-chart.md
- https://vfx-ui.com/components/mesh-gradient.md
- https://vfx-ui.com/components/particle-field.md
- https://vfx-ui.com/components/ribbon-field.md
- https://vfx-ui.com/components/starfield.md
- https://vfx-ui.com/components/vortex.md
- https://vfx-ui.com/components/wave-background.md
- https://vfx-ui.com/components/web-globe.md

## Scope guard

This library ships GPU-only visuals and drop-in hero sections.
Do not request standalone DOM animation widgets, carousels/counters, layout components,
full-page templates, or heavy 3D scenes (meshes/lights/cameras) — out of scope by charter.


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

- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { AURORA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Black Hole

The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { BlackHole } from "@vfx-ui/react";

export function Demo() {
  return <BlackHole />;
}
```

## Props

- `speed?: number`
- `brightness?: number`
- `distance?: number`
- `diskRadius?: number`
- `fov?: number`
- `tilt?: number`
- `centerX?: number`
- `centerY?: number`
- `roll?: number`
- `turbulence?: number`
- `density?: number`
- `doppler?: number`
- `stars?: number`
- `centerFade?: number`
- `bloom?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { BLACK_HOLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Chroma Flow

Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { ChromaFlow } from "@vfx-ui/react";

export function Demo() {
  return <ChromaFlow />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { CHROMA_FLOW_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `smokeScale?: number`
- `smokeStrength?: number`
- `smokeSpeed?: number`
- `hue?: number`
- `saturation?: number`
- `glow?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { ENERGY_ORB_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `ENERGY_ORB_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { FIBER_FLOW_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { FLUID_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

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

- `radius?: number`
- `borderGlow?: number`
- `shine?: number`
- `cardScale?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_CARD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_CARD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Glass Lens

Floating liquid-glass pill lens over a living color field: cylindrical rim refraction, RGB dispersion, rotating specular sweep.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassLens } from "@vfx-ui/react";

export function Demo() {
  return <GlassLens />;
}
```

## Props

- `speed?: number`
- `refraction?: number`
- `dispersion?: number`
- `blur?: number`
- `rim?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_LENS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_LENS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Aurora

Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroAurora } from "@vfx-ui/react";

export function Demo() {
  return <HeroAurora />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_AURORA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Black Hole

Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroBlackHole } from "@vfx-ui/react";

export function Demo() {
  return <HeroBlackHole />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `distance?: number`
- `diskRadius?: number`
- `tilt?: number`
- `brightness?: number`
- `doppler?: number`
- `stars?: number`
- `centerX?: number`
- `centerY?: number`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_BLACK_HOLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Chroma

Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroChroma } from "@vfx-ui/react";

export function Demo() {
  return <HeroChroma />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `interactive?: boolean`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_CHROMA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Fiber

Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroFiber } from "@vfx-ui/react";

export function Demo() {
  return <HeroFiber />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FIBER_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Fluid

Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroFluid } from "@vfx-ui/react";

export function Demo() {
  return <HeroFluid />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FLUID_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Globe

Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.

## Install

```bash
npm install @vfx-ui/react cobe@^2.0.1
```

```tsx
import { HeroGlobe } from "@vfx-ui/react";

export function Demo() {
  return <HeroGlobe />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `spin?: number`
- `mapSamples?: number`
- `baseColor?: [number, number, number]`
- `markerColor?: [number, number, number]`
- `glowColor?: [number, number, number]`
- `markers?: CobeMarker[]`
- `globeProps?: Record<string, unknown>`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Not a WGSL shader component: the visual is provided by a third-party renderer (see Install deps).
- SSR-safe: the visual mounts client-side only; server output is the inert DOM layer.
- `prefers-reduced-motion` skips animation automatically.

# Hero Iridescent

Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroIridescent } from "@vfx-ui/react";

export function Demo() {
  return <HeroIridescent />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `hueShift?: number`
- `saturation?: number`
- `brightness?: number`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_IRIDESCENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `IRIDESCENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Mesh

Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroMesh } from "@vfx-ui/react";

export function Demo() {
  return <HeroMesh />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_MESH_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `MESH_GRADIENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Particles

Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroParticles } from "@vfx-ui/react";

export function Demo() {
  return <HeroParticles />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_PARTICLES_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Ribbon

Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroRibbon } from "@vfx-ui/react";

export function Demo() {
  return <HeroRibbon />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_RIBBON_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `RIBBON_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Starfield

Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroStarfield } from "@vfx-ui/react";

export function Demo() {
  return <HeroStarfield />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_STARFIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STARFIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Vortex

Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroVortex } from "@vfx-ui/react";

export function Demo() {
  return <HeroVortex />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_VORTEX_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `VORTEX_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `scale?: number`
- `hueShift?: number`
- `saturation?: number`
- `brightness?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { IRIDESCENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `IRIDESCENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Light Prism

Frosted glass prism on warm paper with a light beam bending through it — SDF triangle glass, cast shadow, and RGB dispersion (pointer tilt opt-in).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LightPrism } from "@vfx-ui/react";

export function Demo() {
  return <LightPrism />;
}
```

## Props

- `speed?: number`
- `prismSize?: number`
- `beamWidth?: number`
- `refraction?: number`
- `dispersion?: number`
- `shadow?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIGHT_PRISM_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `LIGHT_PRISM_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `distortion?: number`
- `chromatic?: number`
- `scale?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIQUID_GLASS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `LIQUID_GLASS_SHADER` — read it to learn how the effect works.

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

- `data?: number[]`
- `lineWidth?: number`
- `glow?: number`
- `fill?: number`
- `color?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIVE_CHART_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `LIVE_CHART_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { MESH_GRADIENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `MESH_GRADIENT_SHADER` — read it to learn how the effect works.

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

- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { PARTICLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { RIBBON_FIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `RIBBON_FIELD_SHADER` — read it to learn how the effect works.

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

- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { STARFIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STARFIELD_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { VORTEX_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `VORTEX_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `amplitude?: number`
- `frequency?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Shader

WGSL source is exported as `WAVE_SHADER` — read it to learn how the effect works.

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

- `speed?: number`
- `phi?: number`
- `theta?: number`
- `dots?: number`
- `dotScale?: number`
- `diffuse?: number`
- `dark?: number`
- `atmosphere?: number`
- `seaLevel?: number`
- `globeScale?: number`
- `color?: string`
- `emission?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { WEB_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `WEB_GLOBE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
