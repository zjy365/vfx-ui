# Block Feature Tabs

Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFeatureTabs } from "@vfx-ui/react";

export function Surfaces() {
  return (
    <BlockFeatureTabs
      title="One graph. Three ways to look at it."
      tabs={[
        { label: "Plan", description: "Sketch the release as a graph." },
        { label: "Ship", description: "Flags with staged rollouts." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `tabs?: readonly FeatureTab[]`
- `action?: BlockAction | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
