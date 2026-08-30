# Mesh Gradient

Voronoi-cell color fields flowing through a curated palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { MeshGradient } from "@vfx-ui/react";

export function Demo() {
  return <MeshGradient />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
