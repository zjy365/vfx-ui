# Block Newsletter

Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockNewsletter } from "@vfx-ui/react";

export function Demo() {
  return <BlockNewsletter />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `emailLabel?: string`
- `placeholder?: string`
- `submitLabel?: string`
- `invalidEmailMessage?: ReactNode`
- `successTitle?: ReactNode`
- `successNote?: ReactNode`
- `resetLabel?: string`
- `onSubscribe?: (email: string) => void | Promise<void>`
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
