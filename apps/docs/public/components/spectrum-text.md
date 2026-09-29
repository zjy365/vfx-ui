# Spectrum Text

A spectral light band flows continuously through your words and leans toward the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpectrumText } from "@vfx-ui/react";

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
