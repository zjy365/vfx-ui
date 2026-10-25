# Fluid Gradient

Domain-warped fBm noise flowing through a curated palette — organic liquid color, zero video.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/fluid-gradient.json
```

```tsx
import { FluidGradient } from "@/components/FluidGradient";

export function Demo() {
  return <FluidGradient />;
}
```

## Props

- `speed?: number`
- `warp?: number`
- `scale?: number`
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
import { FLUID_PRESETS } from "@/components/FluidGradient";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
