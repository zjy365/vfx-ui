# Spotlight Card

A card under a torch: the beam follows the pointer to uncover your content from the dark.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpotlightCard } from "@vfx-ui/react";

export function Demo() {
  return <SpotlightCard />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `darkness?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
