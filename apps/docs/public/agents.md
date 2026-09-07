# VFX UI — agent guide

# VFX UI

> Shader-native visual effect components for React, rendered via WebGPU (vgpu).
> Expressive hero and footer sections, GPU backgrounds, and focused DOM interactions for your own content.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

## Component catalog

- [Astra Field](https://vfx-ui.com/components/astra-field.md): A rotatable spiral galaxy of glowing stars.
- [Radiant Dots](https://vfx-ui.com/components/radiant-dots.md): Orbital emitters with jump-flooded distance fields and radiance cascades.
- [Footer Tidal](https://vfx-ui.com/components/footer-tidal.md): Copper tidal lines beneath your brand, with pointer-driven currents.
- [Footer Fold](https://vfx-ui.com/components/footer-fold.md): A wordmark printed across hinged paper panels that respond to the pointer.
- [Footer Phosphor](https://vfx-ui.com/components/footer-phosphor.md): A luminous cell wordmark that disperses around your pointer and settles home.
- [Spectral Card](https://vfx-ui.com/components/spectral-card.md): Holographic light and spatial tilt around your own content.
- [Kinetic Text](https://vfx-ui.com/components/kinetic-text.md): A pointer-driven force field lifts your words into a soft wave.
- [Magnetic](https://vfx-ui.com/components/magnetic.md): A gentle magnetic pull for your own buttons, links, and content.
- [Wave Background](https://vfx-ui.com/components/wave-background.md): Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.
- [Fluid Gradient](https://vfx-ui.com/components/fluid-gradient.md): Domain-warped fBm noise flowing through a tri-color palette.
- [Aurora](https://vfx-ui.com/components/aurora.md): Vertical light curtains driven by fBm perturbation and gaussian bands.
- [Starfield](https://vfx-ui.com/components/starfield.md): Hashed star grid with twinkle and slow parallax drift.
- [Particle Field](https://vfx-ui.com/components/particle-field.md): Procedural cell-hashed particles with drift and size breathing.
- [Glass Card](https://vfx-ui.com/components/glass-card.md): Thick-cut optical glass with two-interface refraction and studio reflections.
- [Liquid Glass](https://vfx-ui.com/components/liquid-glass.md): A molten glass annulus with a travelling silhouette and spectral transmission.
- [Glass Lens](https://vfx-ui.com/components/glass-lens.md): A biconvex glass lens that magnifies and inverts a printed studio scene.
- [Black Hole](https://vfx-ui.com/components/black-hole.md): The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).
- [Mesh Gradient](https://vfx-ui.com/components/mesh-gradient.md): Voronoi-cell color fields flowing through a curated palette.
- [Iridescent](https://vfx-ui.com/components/iridescent.md): Silky thin-film interference colors drifting across the surface.
- [Vortex](https://vfx-ui.com/components/vortex.md): Spiral galaxy swirl with star speckles and trailing arms.
- [Ribbon Field](https://vfx-ui.com/components/ribbon-field.md): Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).
- [Fiber Flow](https://vfx-ui.com/components/fiber-flow.md): Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).
- [Light Prism](https://vfx-ui.com/components/light-prism.md): A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.
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

- https://vfx-ui.com/components/astra-field.md
- https://vfx-ui.com/components/aurora.md
- https://vfx-ui.com/components/black-hole.md
- https://vfx-ui.com/components/chroma-flow.md
- https://vfx-ui.com/components/fiber-flow.md
- https://vfx-ui.com/components/fluid-gradient.md
- https://vfx-ui.com/components/footer-fold.md
- https://vfx-ui.com/components/footer-phosphor.md
- https://vfx-ui.com/components/footer-tidal.md
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
- https://vfx-ui.com/components/kinetic-text.md
- https://vfx-ui.com/components/light-prism.md
- https://vfx-ui.com/components/liquid-glass.md
- https://vfx-ui.com/components/magnetic.md
- https://vfx-ui.com/components/mesh-gradient.md
- https://vfx-ui.com/components/particle-field.md
- https://vfx-ui.com/components/radiant-dots.md
- https://vfx-ui.com/components/ribbon-field.md
- https://vfx-ui.com/components/spectral-card.md
- https://vfx-ui.com/components/starfield.md
- https://vfx-ui.com/components/vortex.md
- https://vfx-ui.com/components/wave-background.md

## Scope guard

This library focuses on customizable hero and footer sections, supported by GPU visuals and focused interactions.
Hero sample copy is replaceable. Pass title/subtitle or children and configure CTA href/onClick.
Footer sample copy is replaceable. Configure brand, title, CTA, groups, legal links and copyright. Supply children for your own introduction/navigation layout.
DOM interaction components do not require WebGPU. This is not a general-purpose UI kit.


# Astra Field

A rotatable spiral galaxy of glowing stars.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { AstraField } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><AstraField interactive /></div>;
}
```

## Props

- `shape?: "six" | "galaxy"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `seed?: number`
- `intro?: boolean`
- `introDuration?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { ASTRA_FIELD_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Original WebGL spiral star field inspired by OpenAI Astra. No external assets or Three.js dependency.
- Stars gather from a scattered 3D cloud on mount. intro defaults to true; introDuration defaults to 4.8 seconds, independent of ambient speed. Reduced motion skips assembly.
- Drag or use arrow keys to orbit; Home resets. Place your own copy in a sibling DOM layer.
- Offscreen and hidden tabs pause. Reduced motion freezes ambient movement. Provide a sized parent.

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

# Footer Fold

A wordmark printed across hinged paper panels that respond to the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterFold } from "@vfx-ui/react";

export function Demo() {
  return <FooterFold brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `depth?: number`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Footer Phosphor

A luminous cell wordmark that disperses around your pointer and settles home.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterPhosphor } from "@vfx-ui/react";

export function Demo() {
  return <FooterPhosphor brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Footer Tidal

Copper tidal lines beneath your brand, with pointer-driven currents.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterTidal } from "@vfx-ui/react";

export function Demo() {
  return <FooterTidal brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `animate?: boolean`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Glass Card

Thick-cut optical glass with two-interface refraction and studio reflections.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassCard } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><GlassCard interactive /></div>;
}
```

## Props

- `children?: ReactNode`
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

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Glass Lens

A biconvex glass lens that magnifies and inverts a printed studio scene.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassLens } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><GlassLens interactive /></div>;
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

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Hero Aurora

Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroAurora } from "@vfx-ui/react";

export function Demo() {
  return <HeroAurora title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroBlackHole title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

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
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroChroma title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

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
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroFiber title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

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
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroFluid title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroGlobe title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `spin?: number`
- `mapSamples?: number`
- `baseColor?: [number, number, number]`
- `markerColor?: [number, number, number]`
- `glowColor?: [number, number, number]`
- `markers?: CobeMarker[]`
- `globeProps?: Record<string, unknown>`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Rendered with a third-party runtime (see Install dependencies).
- SSR-safe: content and navigation render on the server; animation starts after mount.
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
  return <HeroIridescent title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `hueShift?: number`
- `saturation?: number`
- `brightness?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroMesh title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroParticles title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroRibbon title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroStarfield title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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
  return <HeroVortex title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

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

# Kinetic Text

A pointer-driven force field lifts your words into a soft wave.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { KineticText } from "@vfx-ui/react";

export function Demo() {
  return <KineticText />;
}
```

## Props

- `text?: string`
- `strength?: number`
- `spread?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Light Prism

A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LightPrism } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><LightPrism interactive /></div>;
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

## Notes for agents

- Complete Vercel VGPU MIT light pipeline, including beveled solid geometry, spectral optics, environment and wall baking, and multiple glass passes.
- Source and license are bundled. No remote assets. Use a sized parent; pointer changes beam incidence and camera orbit.
- LIGHT_PRISM_SHADER, to and accent are deprecated compatibility exports/props. The live component uses a multi-pass pipeline and optical spectral colors.

# Liquid Glass

A molten glass annulus with a travelling silhouette and spectral transmission.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LiquidGlass } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><LiquidGlass interactive /></div>;
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

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Magnetic

A gentle magnetic pull for your own buttons, links, and content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { Magnetic } from "@vfx-ui/react";

export function Demo() {
  return <Magnetic />;
}
```

## Props

- `children?: ReactNode`
- `strength?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

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

# Radiant Dots

Orbital emitters with jump-flooded distance fields and radiance cascades.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { RadiantDots } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><RadiantDots interactive /></div>;
}
```

## Props

- `layout?: "orbit" | "grid"`
- `motion?: "wave" | "chase" | "pulse"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `interactive?: boolean`
- `animate?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { RADIANT_DOTS_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Requires WebGPU. Render a sized parent and provide fallback for unsupported browsers.
- SSR yields an inert decorative canvas; loading/status text belongs in your own DOM.
- Real jump flood, distance field and radiance cascades adapted from Vercel's MIT example, with original orbit/grid arrangements.
- Working field capped at 320px; animation capped at 30fps and suspended offscreen, in hidden tabs and under reduced motion.
- animate=false or speed=0 freezes time; changes to other props still redraw the paused field.

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

# Spectral Card

Holographic light and spatial tilt around your own content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpectralCard } from "@vfx-ui/react";

export function Demo() {
  return <SpectralCard />;
}
```

## Props

- `children?: ReactNode`
- `tilt?: number`
- `glare?: number`
- `radius?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

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
