# Block Comparison

Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockComparison } from "@vfx-ui/react";

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
