# Solar Corona

A blazing sun disk crowned with streaming corona light — a limb-darkened photosphere with boiling granulation, red-shifted rim, fbm streamers and long polar plumes over a star field.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/solar-corona.json
```

```tsx
import { SolarCorona } from "@/components/SolarCorona";

export function Demo() {
  return <SolarCorona />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `rays?: number`
- `corona?: number`
- `granulation?: number`
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
import { SOLAR_CORONA_PRESETS } from "@/components/SolarCorona";
```

## Shader

WGSL source is exported as `SOLAR_CORONA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
