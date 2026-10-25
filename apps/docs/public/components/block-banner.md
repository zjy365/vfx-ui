# Block Banner

Announcement banner: a slim accent-tinted strip for one important message with an optional action. Dismissible for real — labeled button, Escape works, onDismiss persists the choice.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-banner.json
```

```tsx
import { BlockBanner } from "@/components/BlockBanner";

export function Demo() {
  return <BlockBanner />;
}
```

## Props

- `message?: ReactNode`
- `action?: BlockAction | null`
- `dismissible?: boolean`
- `dismissLabel?: string`
- `sticky?: boolean`
- `regionLabel?: string`
- `onDismiss?: () => void`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
