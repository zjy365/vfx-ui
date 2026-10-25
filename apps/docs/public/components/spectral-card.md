# Spectral Card

A touch of iridescence. Real content, spatial tilt, and light that follows you.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/spectral-card.json
```

```tsx
import { SpectralCard } from "@/components/SpectralCard";

export function Demo() {
  return <SpectralCard />;
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
