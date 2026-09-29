# Block CTA

Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default).

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockCta, WaveBackground } from "@vfx-ui/react";

export function Closing() {
  return (
    <BlockCta
      title="Your next release could feel like this."
      primaryCta={{ label: "Get started free", href: "/start" }}
      secondaryCta={{ label: "See the docs", href: "/docs" }}
      media={<WaveBackground speed={0.55} interactive={false} />}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `primaryCta?: BlockAction | null`
- `secondaryCta?: BlockAction | null`
- `media?: ReactNode`
- `note?: ReactNode`
- `layout?: "panel" | "banner"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
