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
