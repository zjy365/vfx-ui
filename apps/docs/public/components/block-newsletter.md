# Block Newsletter

Newsletter signup that is a working form, not a mockup: client-side validation with inline announced errors, and a confirmation panel on success. Wire onSubscribe; without it, demo mode says so on screen.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-newsletter.json
```

```tsx
import { BlockNewsletter } from "@/components/BlockNewsletter";

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
