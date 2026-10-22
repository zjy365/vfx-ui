"use client";
import Link from "next/link";
import { useState } from "react";
type Card = {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  thumbnail: string;
  tags: string[];
  runtime: string;
};
const featured = [
  "hero-contour",
  "footer-vinyl",
  "fluid-gradient",
  "hero-eclipse",
  "spectral-card",
  "magnetic",
];
const categoryNames: Record<string, string> = {
  Heroes: "Heroes & headers",
  Backgrounds: "Shaders",
  All: "All",
};
export function Catalog({
  items,
  initialCategory = "All",
  initialQuery = "",
}: {
  items: Card[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery),
    [category, setCategory] = useState(initialCategory),
    [active, setActive] = useState<string | null>(null);
  const categories = [
    "All",
    "Heroes",
    "Footers",
    "Backgrounds",
    "Interactions",
    "Text",
    "Glass",
    "Blocks",
  ].filter((x) => x === "All" || items.some((item) => item.category === x));
  const visible = items
    .filter(
      (x) =>
        (category === "All" || x.category === category) &&
        `${x.title} ${x.description} ${x.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      const ai = featured.indexOf(a.id),
        bi = featured.indexOf(b.id);
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
    });
  const editorial = category === "All" && !query;
  return (
    <div className="gallery">
      <div className="gallery-toolbar">
        <div className="gallery-categories" aria-label="Categories">
          {categories.map((x) => (
            <button
              key={x}
              onClick={() => {
                setCategory(x);
                setActive(null);
              }}
              aria-pressed={x === category}
            >
              {categoryNames[x] || x}
              {x === "All" && <small>{items.length}</small>}
            </button>
          ))}
        </div>
        <label className="gallery-search">
          <span aria-hidden>⌕</span>
          <input
            type="search"
            aria-label="Search components"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(null);
            }}
            placeholder="Search components"
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {visible.length} free components{" "}
        <span>React · Editable source · MIT</span>
      </p>
      {visible.length ? (
        <div className={"gallery-grid " + (editorial ? "editorial" : "")}>
          {visible.map((item) => (
            <article
              className={
                "gallery-item " +
                (item.category === "Footers" ? "gallery-footer" : "")
              }
              key={item.id}
            >
              <div className="gallery-art">
                {active === item.id ? (
                  <>
                    <iframe
                      title={item.title + " interactive preview"}
                      src={
                        "/preview-runtime/index.html?component=" +
                        item.id +
                        "&scheme=light"
                      }
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <button
                      className="gallery-stop"
                      onClick={() => setActive(null)}
                      aria-label={"Stop " + item.title + " preview"}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={item.path + "/"}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img
                        src={item.thumbnail}
                        alt=""
                        width="800"
                        height="450"
                        loading="lazy"
                      />
                    </Link>
                    <button
                      className="gallery-play"
                      onClick={() => setActive(item.id)}
                      aria-label={"Try " + item.title + " live"}
                    >
                      ↗ Try it
                    </button>
                  </>
                )}
              </div>
              <div className="gallery-caption">
                <h2>
                  <Link href={item.path + "/"}>{item.title}</Link>
                </h2>
                <span>{item.category.toUpperCase()} / FREE</span>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No components match yet.</h2>
          <p>Try a broader search, or reset the filters.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
