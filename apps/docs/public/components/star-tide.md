# Star Tide

Stars carried on slow luminous waves, flaring as the tide crests.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { StarTide } from "@vfx-ui/react";

export function Demo() {
  return <StarTide />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `density?: number`
- `waveAmp?: number`
- `waveFreq?: number`
- `twinkle?: number`
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
import { STAR_TIDE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STAR_TIDE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
