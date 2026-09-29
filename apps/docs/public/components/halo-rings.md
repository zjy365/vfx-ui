# Halo Rings

Concentric rings breathing outward from a luminous core, their edges split into spectral fringes.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HaloRings } from "@vfx-ui/react";

export function Demo() {
  return <HaloRings />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `rings?: number`
- `dispersion?: number`
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
import { HALO_RINGS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `HALO_RINGS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
