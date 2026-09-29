# Tilt Card

A porcelain card that tilts in space while its specular highlight tracks the pointer across the surface.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { TiltCard } from "@vfx-ui/react";

export function Demo() {
  return <TiltCard />;
}
```

## Props

- `children?: ReactNode`
- `tilt?: number`
- `glare?: number`
- `radius?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
