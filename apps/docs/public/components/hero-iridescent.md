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
