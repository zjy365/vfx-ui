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
