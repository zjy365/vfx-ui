# Block Logos

Customer logo wall: a hairline grid of brand tiles that sit desaturated until hover. Real marks via logo (img or inline svg) or styled wordmarks — no assets required.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-logos.json
```

```tsx
import { BlockLogos } from "@/components/BlockLogos";

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
