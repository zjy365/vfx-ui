# Radiant Dots

A constellation of light. Each dot emits and occludes, sending soft illumination through a real radiance-cascade field.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/radiant-dots.json
```

```tsx
import { RadiantDots } from "@/components/RadiantDots";

export function Demo() {
  return <div style={{ height: 520 }}><RadiantDots interactive /></div>;
}
```

## Props

- `layout?: "orbit" | "grid"`
- `motion?: "wave" | "chase" | "pulse"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `interactive?: boolean`
- `animate?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { RADIANT_DOTS_PRESETS } from "@/components/RadiantDots";
```

## Notes for agents

- Requires WebGPU. Render a sized parent and provide fallback for unsupported browsers.
- SSR yields an inert decorative canvas; loading/status text belongs in your own DOM.
- Real jump flood, distance field and radiance cascades adapted from Vercel's MIT example, with original orbit/grid arrangements.
- Working field capped at 320px; animation capped at 30fps and suspended offscreen, in hidden tabs and under reduced motion.
- animate=false or speed=0 freezes time; changes to other props still redraw the paused field.
