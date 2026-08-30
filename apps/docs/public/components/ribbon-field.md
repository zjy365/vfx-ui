# Ribbon Field

Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { RibbonField } from "@vfx-ui/react";

export function Demo() {
  return <RibbonField />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
