# Fiber Flow

Luminous silk fibers streaming through the dark — a domain-warped fbm ridge field with strands that ebb and flow, pointer parallax and a soft cursor glow. Original vfx-ui design.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FiberFlow } from "@vfx-ui/react";

export function Demo() {
  return <FiberFlow />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
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
import { FIBER_FLOW_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
