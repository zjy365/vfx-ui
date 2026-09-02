# Energy Orb

Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT, Copyright 2026 Meng To).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { EnergyOrb } from "@vfx-ui/react";

export function Demo() {
  return <EnergyOrb />;
}
```

## Props

- `speed?: number`
- `smokeScale?: number`
- `smokeStrength?: number`
- `smokeSpeed?: number`
- `hue?: number`
- `saturation?: number`
- `glow?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { ENERGY_ORB_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `ENERGY_ORB_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
