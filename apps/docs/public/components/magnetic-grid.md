# Magnetic Grid

A lattice of iron filings for the cursor: each dot feels the pointer's field, slides and swells as it passes, and settles back when it leaves.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/magnetic-grid.json
```

```tsx
import { MagneticGrid } from "@/components/MagneticGrid";

export function Demo() {
  return <MagneticGrid />;
}
```

## Props

- `children?: ReactNode`
- `columns?: number`
- `rows?: number`
- `dotSize?: number`
- `strength?: number`
- `radius?: number`
- `mode?: "attract" | "repel"`
- `color?: string`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
