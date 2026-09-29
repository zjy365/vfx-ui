# Block Contact

Contact section: a direct-channels list beside a configurable form skeleton — labeled fields, native validation, and a confirmation state on submit.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockContact } from "@vfx-ui/react";

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
