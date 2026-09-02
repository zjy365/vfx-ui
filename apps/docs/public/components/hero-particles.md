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
