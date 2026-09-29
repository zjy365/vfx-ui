# Ember Drift

Sparks rising from a bed of coals, cooling from gold to red through shimmering heat.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { EmberDrift } from "@vfx-ui/react";

export function Demo() {
  return <EmberDrift />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `embers?: number`
- `rise?: number`
- `shimmer?: number`
- `from?: string`
- `to?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { EMBER_DRIFT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `EMBER_DRIFT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
