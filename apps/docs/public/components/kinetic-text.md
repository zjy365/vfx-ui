# Kinetic Text

Letters lift into a soft wave as your cursor passes through.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { KineticText } from "@vfx-ui/react";

export function Demo() {
  return <KineticText />;
}
```

## Props

- `text?: string`
- `strength?: number`
- `spread?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
