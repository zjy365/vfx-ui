# Magnetic

Give a button, link, or any small piece of content a gentle pull.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { Magnetic } from "@vfx-ui/react";

export function Demo() {
  return <Magnetic />;
}
```

## Props

- `children?: ReactNode`
- `strength?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
