# Black Hole

The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { BlackHole } from "@vfx-ui/react";

export function Demo() {
  return <BlackHole />;
}
```

## Props

- `speed?: number`
- `brightness?: number`
- `distance?: number`
- `diskRadius?: number`
- `fov?: number`
- `tilt?: number`
- `centerX?: number`
- `centerY?: number`
- `roll?: number`
- `turbulence?: number`
- `density?: number`
- `doppler?: number`
- `stars?: number`
- `centerFade?: number`
- `bloom?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { BLACK_HOLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
