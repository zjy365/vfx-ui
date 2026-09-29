# Dust Motes

Dust motes drifting through slanted Tyndall beams in a dark room.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { DustMotes } from "@vfx-ui/react";

export function Demo() {
  return <DustMotes />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `motes?: number`
- `beams?: number`
- `beamWidth?: number`
- `drift?: number`
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
import { DUST_MOTES_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `DUST_MOTES_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
