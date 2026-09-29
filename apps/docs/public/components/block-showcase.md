# Block Showcase

Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockShowcase } from "@vfx-ui/react";

export function Tour() {
  return (
    <BlockShowcase
      eyebrow="Product tour"
      title="Every launch, in one orbit."
      primaryCta={{ label: "Start free", href: "/start" }}
      media={<img src="/app-screenshot.png" alt="Orbit release dashboard" />}
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
- `mediaAlt?: string`
- `caption?: ReactNode`
- `interactive?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
