# Chromatic Text

The pointer is the prism: nearby letters split into red and blue fringes over a sliding rainbow.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ChromaticText } from "@vfx-ui/react";

export function Demo() {
  return <ChromaticText />;
}
```

## Props

- `text?: string`
- `separation?: number`
- `spread?: number`
- `spectrum?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
