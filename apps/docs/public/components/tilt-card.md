# Tilt Card

A porcelain card on a gimbal: the surface tilts in space while a specular highlight tracks the pointer across it.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/tilt-card.json
```

```tsx
import { TiltCard } from "@/components/TiltCard";

export function Demo() {
  return <TiltCard />;
}
```

## Props

- `children?: ReactNode`
- `tilt?: number`
- `glare?: number`
- `radius?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
