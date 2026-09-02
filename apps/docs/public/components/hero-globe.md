# Hero Globe

Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.

## Install

```bash
npm install @vfx-ui/react cobe@^2.0.1
```

```tsx
import { HeroGlobe } from "@vfx-ui/react";

export function Demo() {
  return <HeroGlobe />;
}
```

## Props

- `eyebrow?: string`
- `title?: string`
- `subtitle?: string`
- `primaryCta?: string`
- `secondaryCta?: string`
- `scheme?: "dark" | "light"`
- `spin?: number`
- `mapSamples?: number`
- `baseColor?: [number, number, number]`
- `markerColor?: [number, number, number]`
- `glowColor?: [number, number, number]`
- `markers?: CobeMarker[]`
- `globeProps?: Record<string, unknown>`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Not a WGSL shader component: the visual is provided by a third-party renderer (see Install deps).
- SSR-safe: the visual mounts client-side only; server output is the inert DOM layer.
- `prefers-reduced-motion` skips animation automatically.
