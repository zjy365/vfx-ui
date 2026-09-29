# Block Feature Grid

Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFeatureGrid } from "@vfx-ui/react";

export function Features() {
  return (
    <BlockFeatureGrid
      title="Built for the way teams ship."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry on every flag." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly FeatureGridItem[]`
- `layout?: "bento" | "even"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
