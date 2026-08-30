# Web Globe

WebGPU re-creation of shuding/cobe (MIT): a tiny dot-matrix globe.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { WebGlobe } from "@vfx-ui/react";

export function Demo() {
  return <WebGlobe />;
}
```

## Props

(see source)

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
