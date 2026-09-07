# Astra Field

A rotatable spiral galaxy of glowing stars.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { AstraField } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><AstraField interactive /></div>;
}
```

## Props

- `shape?: "six" | "galaxy"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `seed?: number`
- `intro?: boolean`
- `introDuration?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { ASTRA_FIELD_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Original WebGL spiral star field inspired by OpenAI Astra. No external assets or Three.js dependency.
- Stars gather from a scattered 3D cloud on mount. intro defaults to true; introDuration defaults to 4.8 seconds, independent of ambient speed. Reduced motion skips assembly.
- Drag or use arrow keys to orbit; Home resets. Place your own copy in a sibling DOM layer.
- Offscreen and hidden tabs pause. Reduced motion freezes ambient movement. Provide a sized parent.
