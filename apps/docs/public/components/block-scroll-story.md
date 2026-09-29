# Block Scroll Story

Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockScrollStory } from "@vfx-ui/react";

export function Story() {
  return (
    <BlockScrollStory
      title="A release week, told in three scenes."
      steps={[
        { eyebrow: "Monday", title: "Sketch the week.", text: "Drop deploys onto one canvas." },
        { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Orbit pauses drift for you." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `steps?: readonly StoryStep[]`
- `flip?: boolean`
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
