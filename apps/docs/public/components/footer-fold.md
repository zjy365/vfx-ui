# Footer Fold

Your wordmark becomes a hinged paper screen. Each panel turns toward the passing pointer.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/footer-fold.json
```

```tsx
import { FooterFold } from "@/components/FooterFold";

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
