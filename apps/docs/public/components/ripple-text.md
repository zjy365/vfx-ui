# Ripple Text

Type you can touch: a click (or tap) drops a ripple that travels outward through the letters, and a resting pointer leaves a soft dimple.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { RippleText } from "@vfx-ui/react";

export function Demo() {
  return <RippleText />;
}
```

## Props

- `text?: string`
- `amplitude?: number`
- `speed?: number`
- `width?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
