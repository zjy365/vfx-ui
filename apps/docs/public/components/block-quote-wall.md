# Block Quote Wall

Quote wall: many quotes in masonry columns, or one at a time in a rotator with keyboard controls, hover/focus pause and reduced-motion respect.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockQuoteWall } from "@vfx-ui/react";

export function Demo() {
  return <BlockQuoteWall />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `quotes?: readonly WallQuote[]`
- `mode?: "wall" | "rotate"`
- `interval?: number`
- `pauseOnHover?: boolean`
- `previousLabel?: string`
- `nextLabel?: string`
- `carouselLabel?: string`
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
