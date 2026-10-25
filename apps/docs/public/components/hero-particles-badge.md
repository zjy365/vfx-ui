# Hero Particles Badge

Drop-in hero: the badge-first cut — trust chips lead the stack at the very top on their own frosted backing, then a centered headline over the drifting particle field.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/hero-particles-badge.json
```

```tsx
import { HeroParticlesBadge } from "@/components/HeroParticlesBadge";

export function Demo() {
  return <HeroParticlesBadge title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
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
import { HERO_PARTICLES_BADGE_PRESETS } from "@/components/HeroParticlesBadge";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
