# Block Banner

Announcement banner: a slim accent strip with an optional action, a labeled dismiss control, Escape handling and sticky-top positioning.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockBanner } from "@vfx-ui/react";

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
