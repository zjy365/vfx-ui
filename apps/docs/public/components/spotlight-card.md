# Spotlight Card

A card played under a torch: a soft pool of light rests at the center, then follows the pointer to uncover what is written there.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/spotlight-card.json
```

```tsx
import { SpotlightCard } from "@/components/SpotlightCard";

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
