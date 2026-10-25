import { Shell } from "@/components/shell";
import { Catalog } from "@/components/catalog";
import { components } from "@/lib/catalog";
import styles from "@/components/catalog-gallery.module.css";

export const metadata = {
  title: "Free React components",
  description:
    "Browse free, open source shaders, heroes, headers, footers and expressive React components.",
};
export default function Components() {
  return (
    <Shell>
      <main id="main" className={styles.page}>
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
      </main>
    </Shell>
  );
}
