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
