"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Download } from "lucide-react";
import { accountUrl, product, templates } from "@/lib/catalog";
import { templateCover } from "./pro-storefront";
import styles from "./pro-storefront.module.css";

export function ProProductSelector() {
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const selected = templates.find((template) => template.id === selectedId)!;
  return (
    <section
      className={styles.productSelector}
      aria-label="Explore the templates included in Pro Lifetime"
    >
      <div className={styles.previewPanel}>
        <div className={styles.previewToolbar}>
          <div>
            <h2>{selected.brand}</h2>
            <span>{selected.title} template</span>
          </div>
          <Link href={`/templates/${selected.id}/`}>
            View template <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <Link
          className={styles.selectedPreview}
          href={`/templates/${selected.id}/`}
          aria-label={`Explore ${selected.brand}`}
        >
          <img
            src={templateCover(selected)}
            alt={`${selected.brand} homepage design`}
            width={1440}
            height={1000}
            fetchPriority="high"
          />
        </Link>
        <div
          className={styles.templateChoices}
          aria-label="Choose a template preview"
        >
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              aria-label={`Preview ${template.title}`}
              aria-pressed={template.id === selected.id}
              onClick={() => setSelectedId(template.id)}
            >
              <img
                src={templateCover(template)}
                alt=""
                width={144}
                height={100}
              />
              <span>{template.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.licenseSelector}>
        <h2>Pro Lifetime</h2>
        <div className={styles.selectionSummary}>
          <p className={styles.selectorPrice}>
            ${product.price}
            <span>USD once</span>
          </p>
          <p>All {templates.length} templates, plus future Pro releases.</p>
        </div>
        {accountUrl ? (
          <a
            className={styles.selectorCta}
            href={`${accountUrl}/buy/${product.id}`}
          >
            Get Pro Lifetime · ${product.price}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <p className={styles.selectorUnavailable}>
            Purchases open when the account service is connected.
          </p>
        )}
        <ul className={styles.selectionFeatures}>
          {[
            "Editable Next.js application source",
            "Lifetime use and source updates",
            "Unlimited personal and client projects",
            "Single-user commercial license",
          ].map((feature) => (
            <li key={feature}>
              <Check size={16} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        {accountUrl && (
          <a
            className={styles.selectorAccount}
            href={`${accountUrl}/purchases`}
          >
            <Download size={15} aria-hidden="true" />
            My purchases & downloads
          </a>
        )}
        <p className={styles.selectorNote}>
          Source delivery is being prepared. Review your license before checkout
          opens. Configure and host your own services.
        </p>
      </div>
    </section>
  );
}
