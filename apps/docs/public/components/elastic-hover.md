# Elastic Hover

Rubber around whatever you wrap: hovering swells it, pressing squashes it wide, and an under-damped spring snaps it back with a wobble.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/elastic-hover.json
```

```tsx
import { ElasticHover } from "@/components/ElasticHover";

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
