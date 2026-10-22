# Block Testimonials

Testimonials with a featured quote plus a field-note grid. The built-in quotes are fictional and visibly marked — swap in real customers via props and clear the marker.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTestimonials } from "@vfx-ui/react";

export function Voices() {
  return (
    <BlockTestimonials
      title="The teams who ship weekly, talk like this."
      testimonials={[{ quote: "The replay is the status update.", name: "Mara Ellison", role: "Head of Platform, Fieldnote", href: "/customers/fieldnote" }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `testimonials?: readonly Testimonial[]`
- `demoNote?: ReactNode | null`
- `featured?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
