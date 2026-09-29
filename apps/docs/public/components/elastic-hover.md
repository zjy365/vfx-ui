# Elastic Hover

Rubber around anything you wrap: hover swells, press squashes, and an under-damped spring wobbles it home.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ElasticHover } from "@vfx-ui/react";

export function Demo() {
  return <ElasticHover />;
}
```

## Props

- `children?: ReactNode`
- `grow?: number`
- `squash?: number`
- `stiffness?: number`
- `damping?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
