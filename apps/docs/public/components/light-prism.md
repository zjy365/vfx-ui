# Light Prism

A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LightPrism } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><LightPrism interactive /></div>;
}
```

## Props

- `speed?: number`
- `prismSize?: number`
- `beamWidth?: number`
- `refraction?: number`
- `dispersion?: number`
- `shadow?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIGHT_PRISM_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Complete Vercel VGPU MIT light pipeline, including beveled solid geometry, spectral optics, environment and wall baking, and multiple glass passes.
- Source and license are bundled. No remote assets. Use a sized parent; pointer changes beam incidence and camera orbit.
- LIGHT_PRISM_SHADER, to and accent are deprecated compatibility exports/props. The live component uses a multi-pass pipeline and optical spectral colors.
