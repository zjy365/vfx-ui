import Link from "next/link";
import { accountUrl, product } from "@/lib/catalog";
export function ProOffer() {
  return (
    <aside className="pro-offer">
      <p className="eyebrow">COLLECTION 01 · SOLO LICENSE</p>
      <h2>Make it your own.</h2>
      <p className="offer-price">
        ${product.price}
        <span> once · all five templates</span>
      </p>
      <ul>
        <li>5 complete, editable projects</li>
        <li>Responsive pages & VFX UI components</li>
        <li>Unlimited commercial and client projects</li>
        <li>12 months of updates to this collection</li>
        <li>Permanent use of delivered versions</li>
      </ul>
      {accountUrl ? (
        <a className="button" href={accountUrl + "/buy/" + product.id}>
          Get the collection ↗
        </a>
      ) : (
        <div className="availability">
          <strong>Live previews available</strong>
          <span>
            Purchasing opens after the store completes its payment and delivery
            checks.
          </span>
        </div>
      )}
      <p className="license-note">
        Single-user source license. No template resale or source redistribution.
        Backend services are connected separately.
      </p>
      <Link className="text-link" href="/docs/license/">
        Read the license ↗
      </Link>
    </aside>
  );
}
