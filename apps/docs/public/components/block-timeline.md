# Block Timeline

Company or product timeline: a vertical rail that draws itself in on scroll, alternating left/right on wide screens and collapsing to one rail on small ones.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-timeline.json
```

```tsx
import { BlockTimeline } from "@/components/BlockTimeline";

export function Demo() {
  return <BlockTimeline />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `events?: readonly TimelineEvent[]`
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
