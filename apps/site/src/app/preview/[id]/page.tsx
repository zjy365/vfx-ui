import { notFound } from "next/navigation";
import { components } from "@/lib/catalog";
import { ComponentDetail } from "@/components/component-detail";
export function generateStaticParams() {
  return components.map(({ id }) => ({ id }));
}
export const dynamicParams = false;
export const metadata = { robots: { index: false, follow: true } };
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = components.find((x) => x.id === id);
  if (!item) notFound();
  return <ComponentDetail item={item} fullscreen />;
}
