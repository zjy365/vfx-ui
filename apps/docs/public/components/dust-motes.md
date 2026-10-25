# Dust Motes

Dust motes drifting through slanted Tyndall light beams — parallel volumetric shafts whose width and brightness breathe with fbm, over a shadowed room.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/dust-motes.json
```

```tsx
import { DustMotes } from "@/components/DustMotes";

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
import { DUST_MOTES_PRESETS } from "@/components/DustMotes";
```

## Shader

WGSL source is exported as `DUST_MOTES_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
