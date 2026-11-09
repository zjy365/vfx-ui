import { Shell } from "@/components/shell";
import { Catalog } from "@/components/catalog";
import Link from "next/link";
import { components, categories } from "@/lib/catalog";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbs, categoryContent, collectionData, pageMetadata, routeSegment } from "@/lib/seo";
import styles from "@/components/catalog-gallery.module.css";

export const metadata = pageMetadata({
  title: "Free React components",
  description:
    "Browse free React hero sections, animated backgrounds, footers, text effects and interactive cards. Try live previews and install editable MIT source.",
  path: "/components/",
});
export default function Components() {
  return (
    <Shell>
      <main id="main" className={styles.page}>
        <StructuredData data={[
          breadcrumbs([{ name: "Free React components", path: "/components/" }]),
          collectionData("Free React components", "Editable MIT components for React and Next.js.", "/components/", components.filter(item => item.visible)),
        ]} />
        <Catalog
          heading
          items={components
            .filter((item) => item.visible)
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
        <nav className="topic-links" aria-label="Component categories">
          {categories.map(category => <Link key={category} href={`/${routeSegment(category)}/`}>{categoryContent[category].title}</Link>)}
        </nav>
      </main>
    </Shell>
  );
}
