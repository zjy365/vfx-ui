# Fluid Gradient

Domain-warped fBm noise flowing through a tri-color palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FluidGradient } from "@vfx-ui/react";

export function Demo() {
  return <FluidGradient />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
