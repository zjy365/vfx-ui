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
