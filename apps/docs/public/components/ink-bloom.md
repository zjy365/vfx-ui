# Ink Bloom

Ink drops blooming and feathering across wet paper — each front is an fbm-perturbed radius, denser at the core and ring-deposited at the edge, paling as it ages. Light paper base.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/ink-bloom.json
```

```tsx
import { InkBloom } from "@/components/InkBloom";

export function Demo() {
  return <InkBloom />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `drops?: number`
- `spread?: number`
- `feather?: number`
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
import { INK_BLOOM_PRESETS } from "@/components/InkBloom";
```

## Shader

WGSL source is exported as `INK_BLOOM_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
