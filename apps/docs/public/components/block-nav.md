# Block Nav

Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockNav } from "@vfx-ui/react";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Northwind"
      links={[{ label: "Product", href: "#product" }, { label: "Pricing", href: "#pricing" }]}
      action={{ label: "Get started", href: "/start" }}
      sticky
    />
  );
}
```

## Props

- `brand?: string`
- `brandHref?: string`
- `links?: readonly NavLink[]`
- `action?: NavAction | null`
- `secondaryAction?: NavAction | null`
- `sticky?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
