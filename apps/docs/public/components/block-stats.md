# Block Stats

Stats band where every number counts up from zero on scroll-in, with a settled, screen-reader-friendly final value always present. Prefixes, suffixes and formatting are props.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-stats.json
```

```tsx
import { BlockStats } from "@/components/BlockStats";

export function Demo() {
  return <BlockStats />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `stats?: readonly StatItem[]`
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
