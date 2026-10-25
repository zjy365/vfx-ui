import { notFound } from "next/navigation";
import { components } from "@/lib/catalog";
import { ComponentDetail } from "@/components/component-detail";
export function generateStaticParams() {
  return [{ slug: "launch" }, { slug: "studio" }];
}
export const dynamicParams = false;
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
