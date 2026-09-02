# Light Prism

Frosted glass prism on warm paper with a light beam bending through it — SDF triangle glass, cast shadow, and RGB dispersion (pointer tilt opt-in).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LightPrism } from "@vfx-ui/react";

export function Demo() {
  return <LightPrism />;
}
```

## Props

- `speed?: number`
- `prismSize?: number`
- `beamWidth?: number`
- `refraction?: number`
- `dispersion?: number`
- `shadow?: number`
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
import { LIGHT_PRISM_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `LIGHT_PRISM_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
