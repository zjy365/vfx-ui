# Block Gallery

Work gallery grid with hover lift and an optional lightbox — a real dialog with Escape, arrow keys, focus trap and focus restore; generated CSS artwork by default.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockGallery } from "@vfx-ui/react";

export function Demo() {
  return <BlockGallery />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly GalleryItem[]`
- `lightbox?: boolean`
- `closeLabel?: string`
- `previousLabel?: string`
- `nextLabel?: string`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
