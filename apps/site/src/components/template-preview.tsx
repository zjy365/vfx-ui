import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Template } from "@/lib/catalog";
import { templateCover, templateSummary } from "./pro-storefront";
import styles from "./pro-storefront.module.css";

export function TemplatePreview({ template }: { template: Template }) {
  return (
    <figure className={styles.preview}>
      <img
        src={templateCover(template)}
        alt={`${template.brand} homepage design`}
        width={1440}
        height={1000}
        fetchPriority="high"
        className={styles.previewImage}
      />
      <figcaption>
        Homepage preview · Application demo in preparation
      </figcaption>
    </figure>
  );
}

export function TemplateCard({
  template,
  priority = false,
}: {
  template: Template;
  priority?: boolean;
}) {
  return (
    <article className={styles.card}>
      <Link
        href={`/templates/${template.id}/`}
        className={styles.cardLink}
        aria-label={`Explore ${template.brand}, ${template.title} template`}
      >
        <div className={styles.cardImageFrame}>
          <img
            src={templateCover(template)}
            alt={`${template.brand} homepage`}
            width={1440}
            height={1000}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            className={styles.cardImage}
          />
          <span className={styles.cardAction}>
            View template <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
        <div className={styles.cardCaption}>
          <div className={styles.cardName}>
            <h3>{template.brand}</h3>
            <span>{template.title}</span>
          </div>
          <span className={styles.cardPrice}>
            Included
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </div>
        <p className={styles.cardDescription}>{templateSummary(template)}</p>
      </Link>
    </article>
  );
}
