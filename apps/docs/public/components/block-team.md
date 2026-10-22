# Block Team

Team grid: cards with an avatar (your image node or an auto-generated initials badge), name, role and profile links. Names can link out.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTeam } from "@vfx-ui/react";

export function Demo() {
  return <BlockTeam />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `members?: readonly TeamMember[]`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
