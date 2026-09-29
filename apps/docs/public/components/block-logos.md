# Block Logos

Customer logo wall: brand tiles that sit desaturated and colorize on hover, as real links with styled wordmarks when no image assets exist.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockLogos } from "@vfx-ui/react";

export function Demo() {
  return <BlockLogos />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `logos?: readonly LogoItem[]`
- `columns?: 3 | 4 | 5 | 6`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
