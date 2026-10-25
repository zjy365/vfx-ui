# Glass Tile

A wall of glass bricks on the shared optical pipeline: one biconvex lens lives in a layer that travels to the hovered brick and bulges through it — a single renderer, however many bricks.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/glass-tile.json
```

```tsx
import { GlassTile } from "@/components/GlassTile";

export function Demo() {
  return <GlassTile />;
}
```

## Props

- `tiles?: readonly ReactNode[]`
- `columns?: number`
- `gap?: number`
- `tileHeight?: number`
- `tint?: string`
- `refraction?: number`
- `dispersion?: number`
- `rim?: number`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: VfxCanvasProps["fallback"]`

## Shader

WGSL source is exported as `GLASS_TILE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
