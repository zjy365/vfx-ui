# Caustics Field

Sunlit pool-floor caustics dancing over deep water — a jittered-grid Voronoi net of focused light in three stacked octaves, with drifting silt motes.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/caustics-field.json
```

```tsx
import { CausticsField } from "@/components/CausticsField";

export function Demo() {
  return <CausticsField />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `sharpness?: number`
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
import { CAUSTICS_FIELD_PRESETS } from "@/components/CausticsField";
```

## Shader

WGSL source is exported as `CAUSTICS_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
