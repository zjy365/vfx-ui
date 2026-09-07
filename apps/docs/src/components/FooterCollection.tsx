import { useState } from "react";
import { FooterFold, FooterPhosphor, FooterTidal } from "@vfx-ui/react";

const ENDINGS = [
  { id: "footer-tidal", label: "Tidal", Component: FooterTidal },
  { id: "footer-fold", label: "Fold", Component: FooterFold },
  { id: "footer-phosphor", label: "Phosphor", Component: FooterPhosphor },
] as const;
const GROUPS = [
  {
    label: "The library",
    links: [
      { label: "Heroes", href: "/heroes" },
      { label: "Footers", href: "/footers" },
      { label: "All components", href: "/components" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Installation", href: "/installation" },
      { label: "GitHub", href: "https://github.com/zjy365/vfx-ui" },
      { label: "For agents", href: "/llms.txt" },
    ],
  },
];

/** The site's own footer is a working specimen of all three exported footers. */
export function FooterCollection() {
  const [selected, setSelected] = useState(0);
  const { id, Component } = ENDINGS[selected]!;
  return (
    <section className="footer-collection" aria-label="Footer collection">
      <div className="footer-collection-heading">
        <h2>The last impression.</h2>
        <div
          className="footer-selector"
          role="group"
          aria-label="Choose a footer"
        >
          {ENDINGS.map((ending, index) => (
            <button
              key={ending.id}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {ending.label}
            </button>
          ))}
        </div>
      </div>
      <Component
        key={id}
        brand="VFX UI"
        title={
          selected === 1
            ? "Make room for\nsomething different."
            : selected === 2
              ? "See you around."
              : "A little atmosphere.\nAll yours."
        }
        cta={{ label: "Use this footer", href: `/footers/${id}` }}
        groups={GROUPS}
        copyright={`© ${new Date().getFullYear()} VFX UI`}
        legal={[
          {
            label: "MIT licensed",
            href: "https://github.com/zjy365/vfx-ui/blob/main/LICENSE",
          },
        ]}
      />
    </section>
  );
}
