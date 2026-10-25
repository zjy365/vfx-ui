# Spectrum Text

A ribbon of daylight sliding through the words: one spectral gradient flows continuously across the type and leans toward the pointer.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/spectrum-text.json
```

```tsx
import { SpectrumText } from "@/components/SpectrumText";

export function Demo() {
  return <SpectrumText />;
}
```

## Props

- `text?: string`
- `speed?: number`
- `bandWidth?: number`
- `colors?: readonly [string, string, string, string]`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
