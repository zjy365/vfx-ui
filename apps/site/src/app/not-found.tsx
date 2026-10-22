import Link from "next/link";
import { Shell } from "@/components/shell";
export default function NotFound() {
  return (
    <Shell>
      <main id="main" className="empty-state">
        <p className="eyebrow">404 / OUT OF FRAME</p>
        <h1>This page stepped out.</h1>
        <p>The component library is a good place to start again.</p>
        <Link className="button" href="/components/">
          Explore free components ↗
        </Link>
      </main>
    </Shell>
  );
}
