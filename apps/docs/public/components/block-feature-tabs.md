# Block Feature Tabs

Feature tabs where the list, copy and illustration switch together. WAI-ARIA tabs pattern with arrow keys; a scrollable strip above the stage on touch layouts.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-feature-tabs.json
```

```tsx
import { BlockFeatureTabs } from "@/components/BlockFeatureTabs";

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
