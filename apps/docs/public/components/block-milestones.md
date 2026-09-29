# Block Milestones

Milestone progress: completed steps light up in sequence on scroll, the current step breathes, and upcoming steps stay dimmed — all driven by one index.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockMilestones } from "@vfx-ui/react";

export function Demo() {
  return <BlockMilestones />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `milestones?: readonly Milestone[]`
- `current?: number`
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
