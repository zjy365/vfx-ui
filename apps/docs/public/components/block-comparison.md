# Block Comparison

Before/after comparison with a draggable reveal handle — keyboard (arrow keys, Home/End), touch and screen readers all work because the handle is a real range input.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-comparison.json
```

```tsx
import { BlockComparison } from "@/components/BlockComparison";

export function BeforeAfter() {
  return (
    <BlockComparison
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Before" />}
      after={<img src="/after.png" alt="After" />}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `before?: ReactNode`
- `after?: ReactNode`
- `beforeLabel?: string`
- `afterLabel?: string`
- `defaultPosition?: number`
- `caption?: string`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
