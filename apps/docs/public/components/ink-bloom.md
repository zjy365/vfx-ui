# Ink Bloom

Ink drops blooming and feathering into warm paper on staggered cycles.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { InkBloom } from "@vfx-ui/react";

export function Demo() {
  return <InkBloom />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `drops?: number`
- `spread?: number`
- `feather?: number`
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
import { INK_BLOOM_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `INK_BLOOM_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
