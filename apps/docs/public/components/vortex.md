# Vortex

Spiral galaxy swirl with star speckles and trailing arms.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Vortex } from "@vfx-ui/react";

export function Demo() {
  return <Vortex />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
