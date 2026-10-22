import { Shell } from "@/components/shell";
import { Catalog } from "@/components/catalog";
import { components } from "@/lib/catalog";
export const metadata = {
  title: "Free React components",
  description:
    "Browse free, open source shaders, heroes, headers, footers and expressive React components.",
};
export default function Components() {
  return (
    <Shell>
      <main id="main" className="catalog-page page-width">
        <div className="page-intro gallery-intro">
          <div>
            <p className="eyebrow">THE FREE LIBRARY · MIT LICENSED</p>
            <h1>
              Good parts.
              <br />
              Better websites.
            </h1>
          </div>
          <p>
            Start with a first impression. Pick a component, play with it, make
            it your own.
          </p>
        </div>
        <Catalog
          items={components
            .filter((x) => x.visible)
            .map(
              ({
                id,
                title,
                description,
                category,
                path,
                thumbnail,
                tags,
                runtime,
              }) => ({
                id,
                title,
                description,
                category,
                path,
                thumbnail,
                tags,
                runtime,
              }),
            )}
        />
      </main>
    </Shell>
  );
}
