# Ripple Text

Type you can touch: a click (or tap) drops a ripple that travels outward through the letters, and a resting pointer leaves a soft dimple.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/ripple-text.json
```

```tsx
import { RippleText } from "@/components/RippleText";

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
