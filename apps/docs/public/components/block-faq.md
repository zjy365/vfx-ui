# Block FAQ

FAQ accordion with real disclosure semantics: buttons + aria-expanded/controls, arrow-key traversal, CSS grid-rows height animation, long answers with links and lists welcome.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-faq.json
```

```tsx
import { BlockFaq } from "@/components/BlockFaq";

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
