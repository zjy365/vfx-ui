# Magnetic Grid

A lattice of dots that feel the pointer's field — sliding, swelling and settling like iron filings.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { MagneticGrid } from "@vfx-ui/react";

export function Demo() {
  return <MagneticGrid />;
}
```

## Props

- `children?: ReactNode`
- `columns?: number`
- `rows?: number`
- `dotSize?: number`
- `strength?: number`
- `radius?: number`
- `mode?: "attract" | "repel"`
- `color?: string`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
