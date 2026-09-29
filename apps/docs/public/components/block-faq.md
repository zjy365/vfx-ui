# Block FAQ

FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFaq } from "@vfx-ui/react";

export function Answers() {
  return (
    <BlockFaq
      title="Questions engineers actually ask."
      items={[{ question: "How long does setup take?", answer: "Most teams see their first graph within ten minutes." }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly FaqItem[]`
- `multiple?: boolean`
- `contact?: { text: ReactNode; action: { label: string; href: string } } | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
