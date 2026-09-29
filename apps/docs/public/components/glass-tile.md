# Glass Tile

A wall of glass bricks where one shared biconvex lens travels to the hovered tile and bulges through it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassTile } from "@vfx-ui/react";

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
