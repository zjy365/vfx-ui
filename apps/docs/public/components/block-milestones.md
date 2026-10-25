# Block Milestones

Milestone progress: a roadmap strip whose completed steps light up in sequence on scroll-in, the current step breathes, and upcoming steps stay dimmed. Which steps are done is pure data.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-milestones.json
```

```tsx
import { BlockMilestones } from "@/components/BlockMilestones";

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
