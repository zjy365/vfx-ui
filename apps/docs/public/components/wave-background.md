# Wave Background

Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { WaveBackground } from "@vfx-ui/react";

export function Demo() {
  return <WaveBackground />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
