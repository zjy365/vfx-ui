import { notFound } from "next/navigation";
import { components } from "@/lib/catalog";
import { ComponentDetail } from "@/components/component-detail";
import { componentTitle, pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return [{ slug: "launch" }, { slug: "studio" }];
}
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = components.find(x => x.id === "example-" + slug);
  if (!item) notFound();
  return pageMetadata({ title: componentTitle(item), description: item.description, path: item.path, image: item.thumbnail, index: false });
}
export default async function Example({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = components.find((x) => x.id === "example-" + slug);
  if (!item) notFound();
  return <ComponentDetail item={item} fullscreen />;
}
