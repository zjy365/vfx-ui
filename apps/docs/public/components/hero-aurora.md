# Hero Aurora

Drop-in hero: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/hero-aurora.json
```

```tsx
import { HeroAurora } from "@/components/HeroAurora";

export function Demo() {
  return <HeroAurora title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
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
import { HERO_AURORA_PRESETS } from "@/components/HeroAurora";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
