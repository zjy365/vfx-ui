# Glass Lens

A biconvex glass lens that magnifies and inverts a printed studio scene.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassLens } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><GlassLens interactive /></div>;
}
```

## Props

- `speed?: number`
- `refraction?: number`
- `dispersion?: number`
- `blur?: number`
- `rim?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_LENS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_LENS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.
