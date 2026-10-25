# Block Integrations

Integrations hub: your product at the center of two connection rings of rebrandable tool tiles, with an always-available link grid below and on touch layouts.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-integrations.json
```

```tsx
import { BlockIntegrations } from "@/components/BlockIntegrations";

export function Stack() {
  return (
    <BlockIntegrations
      brand="Orbit"
      title="Plugs into the tools you already trust."
      integrations={[{ name: "GitHub", href: "/integrations/github" }, { name: "Linear", href: "/integrations/linear" }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `brand?: string`
- `logo?: ReactNode`
- `integrations?: readonly Integration[]`
- `action?: BlockAction | null`
- `layout?: "orbit" | "grid"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
