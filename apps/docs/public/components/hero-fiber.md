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
