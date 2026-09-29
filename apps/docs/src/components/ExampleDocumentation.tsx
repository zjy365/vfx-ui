import { lazy, Suspense, useState } from "react";
import type { ComponentType } from "react";
import { CheckIcon, CopyIcon } from "./icons";

const ExampleLaunch = lazy(() =>
  import("@vfx-ui/react").then((m) => ({ default: (m as unknown as Record<string, ComponentType>).ExampleLaunch })),
);
const ExampleStudio = lazy(() =>
  import("@vfx-ui/react").then((m) => ({ default: (m as unknown as Record<string, ComponentType>).ExampleStudio })),
);

export type ExampleSlug = "launch" | "studio";

const EXAMPLE_META: Record<ExampleSlug, {
  title: string;
  blurb: string;
  install: string;
  sections: readonly string[];
  component: ComponentType;
}> = {
  launch: {
    title: "Example — Product launch page",
    blurb: 'The complete fictional launch page for "Orbit" by Lumen Labs. Every section below is a separately installable vfx-ui block; every string is demo content.',
    install: "npx shadcn@latest add https://vfx-ui.com/r/example-launch.json",
    sections: ["Block Nav", "Block Showcase", "Block Feature Grid", "Block Feature Tabs", "Block Scroll Story", "Block Integrations", "Block Pricing", "Block Testimonials", "Block FAQ", "Block CTA"],
    component: ExampleLaunch,
  },
  studio: {
    title: "Example — Design studio page",
    blurb: 'The complete fictional page for "Atelier North", a two-person design studio. Same block collection as the launch example — different composition, daylight palette and content.',
    install: "npx shadcn@latest add https://vfx-ui.com/r/example-studio.json",
    sections: ["Block Nav", "Block Process Steps", "Block Showcase", "Block Comparison", "Block Feature Grid", "Block Pricing", "Block Testimonials", "Block FAQ", "Block CTA"],
    component: ExampleStudio,
  },
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

/**
 * Full-bleed rendering of an installable example page plus a floating
 * toolbar: install command, section manifest, and the honesty note that all
 * content is fictional demo copy.
 */
export function ExampleDocumentation({ slug }: { slug: ExampleSlug }) {
  const meta = EXAMPLE_META[slug];
  const Page = meta.component;
  const [copied, setCopied] = useState(false);
  const [manifestOpen, setManifestOpen] = useState(false);

  const copyInstall = async () => {
    try {
      await copyText(meta.install);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      console.error("copy unavailable");
    }
  };

  return (
    <div className="example-page" data-example={slug}>
      <aside className="example-toolbar" aria-label={`About the ${meta.title} example`}>
        <div className="example-toolbar-info">
          <strong>{meta.title}</strong>
          <span>{meta.blurb}</span>
        </div>
        <div className="example-toolbar-actions">
          <button type="button" className="example-toolbar-btn" aria-expanded={manifestOpen} onClick={() => setManifestOpen((open) => !open)}>
            {meta.sections.length} sections
          </button>
          <button type="button" className="example-toolbar-btn example-toolbar-btn--primary" onClick={copyInstall}>
            {copied ? <><CheckIcon />Copied</> : <><CopyIcon />Install</>}
          </button>
        </div>
        {manifestOpen ? (
          <div className="example-manifest card">
            <code className="example-manifest-command">{meta.install}</code>
            <ul>
              {meta.sections.map((section) => <li key={section}>{section}</li>)}
            </ul>
            <p>Import it as a single component instead:</p>
            <code>{`import { Example${slug === "launch" ? "Launch" : "Studio"} } from "@vfx-ui/react";`}</code>
          </div>
        ) : null}
      </aside>
      <main aria-label={`${meta.title} demo`}>
        <Suspense fallback={<div className="preview-loading" role="status">Loading example…</div>}>
          <Page />
        </Suspense>
      </main>
    </div>
  );
}
