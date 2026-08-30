# Particle Field

Procedural cell-hashed particles with drift and size breathing.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { ParticleField } from "@vfx-ui/react";

export function Demo() {
  return <ParticleField />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
