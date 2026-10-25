# Hero Eclipse

An astronomical instrument in warm copper. Move the pointer to shift the eclipse and rotate its engraved dial.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/hero-eclipse.json
```

```tsx
import { HeroEclipse } from "@/components/HeroEclipse";

export function Demo() {
  return <HeroEclipse title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `color?: string`
- `background?: string`
- `parallax?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
