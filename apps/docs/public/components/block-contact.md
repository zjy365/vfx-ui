# Block Contact

Contact section: a direct-channels list (email, phone, office — real links) beside a configurable form skeleton with labels wired to inputs and native validation intact.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-contact.json
```

```tsx
import { BlockContact } from "@/components/BlockContact";

export function Demo() {
  return <BlockContact />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `channels?: readonly ContactChannel[]`
- `fields?: readonly ContactField[]`
- `submitLabel?: string`
- `successNote?: ReactNode`
- `resetLabel?: string`
- `onSubmit?: (values: Record<string, string>) => void | Promise<void>`
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
