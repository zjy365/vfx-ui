# Block Quote Wall

Quote wall: many quotes as a masonry wall, or one at a time in a keyboard-friendly rotator (real prev/next controls, focus and hover pause, reduced motion disables auto-advance).

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-quote-wall.json
```

```tsx
import { BlockQuoteWall } from "@/components/BlockQuoteWall";

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
