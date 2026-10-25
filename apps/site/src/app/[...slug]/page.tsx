import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/shell";
import { ComponentDetail } from "@/components/component-detail";
import { Catalog } from "@/components/catalog";
import { components, categories } from "@/lib/catalog";
const segment = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.js\b/g, "-js")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const tags = [...new Set(components.flatMap((x) => x.tags))];
function selection(path: string) {
  for (const item of components) {
    if (item.path === path) return { item };
    const variant = item.variants?.find((v) => item.path + "/" + v.id === path);
    if (variant) return { item, variant };
  }
  return null;
}
export function generateStaticParams() {
  return [
    ...components.flatMap((item) => [
      { slug: item.path.slice(1).split("/") },
      ...(item.variants || []).map((v) => ({
        slug: [...item.path.slice(1).split("/"), v.id],
      })),
    ]),
    ...categories.map((x) => ({ slug: [segment(x)] })),
    ...tags.map((x) => ({ slug: ["components", "tag", segment(x)] })),
  ];
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const selected = selection("/" + slug.join("/"));
  return selected
    ? {
        title: selected.item.title,
        description: selected.item.description,
        alternates: { canonical: selected.item.path + "/" },
        openGraph: { images: [selected.item.thumbnail] },
      }
    : { title: "Free component collection" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const selected = selection(path);
  const category = categories.find(
    (x) => segment(x) === slug[0] && slug.length === 1,
  );
  const tag =
    slug[0] === "components" && slug[1] === "tag"
      ? tags.find((x) => segment(x) === slug[2])
      : undefined;
  if (!selected && !category && !tag) notFound();
  return (
    <>
      <Header />
      {selected ? (
        <div className="component-product page-width">
          <main id="main" className="component-detail">
            <p className="eyebrow breadcrumb">
              <Link href="/components/">← THE FREE LIBRARY</Link> /{" "}
              <Link href={"/" + segment(selected.item.category) + "/"}>
                {selected.item.category.toUpperCase()}
              </Link>{" "}
              / FREE · MIT
            </p>
            <ComponentDetail
              key={selected.item.id + ":" + (selected.variant?.id || "default")}
              item={selected.item}
              variantId={selected.variant?.id}
            />
          </main>
        </div>
      ) : (
        <main id="main" className="catalog-page page-width">
          <div className="page-intro">
            <p className="eyebrow">THE FREE LIBRARY</p>
            <h1>{category || tag}</h1>
            <p>Editable React components, free for commercial projects.</p>
          </div>
          <Catalog
            key={category || tag || "all"}
            initialCategory={category}
            initialQuery={tag}
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
      )}
      <Footer />
    </>
  );
}
