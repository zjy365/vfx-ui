# Block Gallery

Work gallery: a responsive grid of tiles that lift on hover, with an optional lightbox — a real dialog (focus moves in, Escape closes, arrows navigate, Tab stays trapped, focus returns).

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-gallery.json
```

```tsx
import { BlockGallery } from "@/components/BlockGallery";

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
