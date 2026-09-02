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
