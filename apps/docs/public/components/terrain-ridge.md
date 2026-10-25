# Terrain Ridge

Layered ridged-fbm mountain silhouettes in parallax drift — ridgelines recede into haze, each scrolling at its own speed, under a low sun that rims the nearest crest.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/terrain-ridge.json
```

```tsx
import { TerrainRidge } from "@/components/TerrainRidge";

export function Demo() {
  return <TerrainRidge />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `layers?: number`
- `ruggedness?: number`
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
import { TERRAIN_RIDGE_PRESETS } from "@/components/TerrainRidge";
```

## Shader

WGSL source is exported as `TERRAIN_RIDGE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
