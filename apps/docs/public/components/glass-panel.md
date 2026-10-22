# Glass Panel

An original ray-marched optical slab built to carry content: beveled edges split light while the solid tilts toward your pointer, and real DOM content rides above it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassPanel } from "@vfx-ui/react";

export function Demo() {
  return <GlassPanel />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `borderGlow?: number`
- `shine?: number`
- `panelScale?: number`
- `tint?: string`
- `contentWidth?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_PANEL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_PANEL_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
