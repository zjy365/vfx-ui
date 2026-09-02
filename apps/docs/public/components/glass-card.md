# Glass Card

Rounded-rect SDF glass card with sweeping inner highlight and edge refraction.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassCard } from "@vfx-ui/react";

export function Demo() {
  return <GlassCard />;
}
```

## Props

- `radius?: number`
- `borderGlow?: number`
- `shine?: number`
- `cardScale?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_CARD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_CARD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
