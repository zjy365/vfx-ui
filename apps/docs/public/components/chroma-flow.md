# Chroma Flow

Four-edge liquid color field on a midnight base — the palette sloshes from the edges in whichever direction the cursor sweeps. Original vfx-ui design.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/chroma-flow.json
```

```tsx
import { ChromaFlow } from "@/components/ChromaFlow";

export function Demo() {
  return <ChromaFlow />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { CHROMA_FLOW_PRESETS } from "@/components/ChromaFlow";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
