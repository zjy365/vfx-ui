# Pointer Glow

A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { PointerGlow } from "@vfx-ui/react";

export function Demo() {
  return <PointerGlow />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `intensity?: number`
- `dim?: number`
- `color?: string`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
