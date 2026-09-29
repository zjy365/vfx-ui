# Block Timeline

Company or product timeline: a rail that draws itself in on scroll, dots lighting up in sequence, alternating sides on wide screens.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTimeline } from "@vfx-ui/react";

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
