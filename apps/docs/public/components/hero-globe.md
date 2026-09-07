# Hero Globe

Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.

## Install

```bash
npm install @vfx-ui/react cobe@^2.0.1
```

```tsx
import { HeroGlobe } from "@vfx-ui/react";

export function Demo() {
  return <HeroGlobe title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `spin?: number`
- `mapSamples?: number`
- `baseColor?: [number, number, number]`
- `markerColor?: [number, number, number]`
- `glowColor?: [number, number, number]`
- `markers?: CobeMarker[]`
- `globeProps?: Record<string, unknown>`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Rendered with a third-party runtime (see Install dependencies).
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
