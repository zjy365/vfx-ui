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
