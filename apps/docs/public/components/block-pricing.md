# Block Pricing

Pricing plans with a working monthly/annual switch: amounts, billing basis and the savings pill all render from data, so the toggle can never lie. No payment backend.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-pricing.json
```

```tsx
import { BlockPricing } from "@/components/BlockPricing";

export function Plans() {
  return (
    <BlockPricing
      title="Start free. Scale when the graph does."
      plans={[
        { name: "Solo", priceMonthly: 0, basis: "month", features: ["1 release graph"], cta: { label: "Start free", href: "/start" } },
        { name: "Team", priceMonthly: 24, priceAnnual: 20, featured: true, cta: { label: "Start trial", href: "/trial" } },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `plans?: readonly PricingPlan[]`
- `periodToggle?: boolean`
- `defaultPeriod?: "monthly" | "annual"`
- `annualNote?: string`
- `footnote?: ReactNode`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
