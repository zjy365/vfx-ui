# Footer Fold

A wordmark printed across hinged paper panels that respond to the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterFold } from "@vfx-ui/react";

export function Demo() {
  return <FooterFold brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `depth?: number`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
