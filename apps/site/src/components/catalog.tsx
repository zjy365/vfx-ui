"use client";

import Link from "next/link";
import { ArrowUpRight, LoaderCircle, Play, Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "./catalog-gallery.module.css";

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
  "fluid-gradient",
  "footer-vinyl",
  "hero-eclipse",
  "spectral-card",
  "iridescent",
];
const categoryNames: Record<string, string> = {
  Heroes: "Heroes & headers",
  Backgrounds: "Shaders",
  All: "All",
};
const categoryOrder = [
  "All",
  "Heroes",
  "Footers",
  "Backgrounds",
  "Interactions",
  "Text",
  "Glass",
  "Blocks",
];
const presentation: Record<
  string,
  { background: string; width?: number; height?: number }
> = {
  "hero-contour": { background: "#eeeade", width: 1120, height: 640 },
  "hero-eclipse": { background: "#171916", width: 1120, height: 640 },
  "footer-vinyl": { background: "#e8a0ae", width: 1120, height: 733 },
  "footer-tidal": { background: "#151b20", width: 1280, height: 676 },
  "footer-fold": { background: "#e5e0f0", width: 1280, height: 641 },
  "footer-phosphor": { background: "#17201b", width: 1280, height: 644 },
  "spectral-card": { background: "#dfe2dc", width: 1280, height: 720 },
};

function LivePreview({
  item,
  width,
  height,
  fit,
  onReady,
  onError,
}: {
  item: Card;
  width: number;
  height: number;
  fit: "contain" | "cover";
  onReady: () => void;
  onError: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const handshake = useCallback(() => {
    const props =
      item.category === "Backgrounds"
        ? {
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              minHeight: 0,
            },
          }
        : item.id === "spectral-card"
          ? { style: { width: 520, height: 640 } }
          : {};
    frame.current?.contentWindow?.postMessage(
      { type: "vfx:preview", scheme: "light", props },
      location.origin,
    );
  }, [item.category, item.id]);
  useEffect(() => {
    const element = bounds.current;
    if (!element) return;
    const resize = () => {
      const ratio = [
        element.clientWidth / width,
        element.clientHeight / height,
      ];
      setScale(fit === "cover" ? Math.max(...ratio) : Math.min(...ratio));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, height, fit]);
  useEffect(() => {
    let ready = false;
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        !event.data ||
        event.data.id !== item.id
      )
        return;
      if (event.data.type === "vfx:preview-ready") {
        ready = true;
        onReady();
      } else if (event.data.type === "vfx:preview-error") onError();
    };
    addEventListener("message", receive);
    const timer = setTimeout(() => {
      if (!ready) onError();
    }, 15000);
    handshake();
    return () => {
      removeEventListener("message", receive);
      clearTimeout(timer);
    };
  }, [item.id, handshake, onReady, onError]);
  return (
    <div ref={bounds} className={styles.liveBounds}>
      <iframe
        ref={frame}
        title={`${item.title} interactive preview`}
        src={`/preview-runtime/index.html?component=${encodeURIComponent(item.id)}&scheme=light`}
        sandbox="allow-scripts allow-same-origin"
        onLoad={handshake}
        onError={onError}
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    </div>
  );
}

function GalleryCard({
  item,
  active,
  onActivate,
  onStop,
  priority,
}: {
  item: Card;
  active: boolean;
  onActivate: () => void;
  onStop: () => void;
  priority: boolean;
}) {
  const art = presentation[item.id];
  const [size, setSize] = useState({
    width: art?.width ?? 1280,
    height: art?.height ?? 720,
  });
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const ready = useCallback(() => setState("ready"), []);
  const error = useCallback(() => setState("error"), []);
  const fit = item.category === "Backgrounds" ? "cover" : "contain";
  const href = item.path.replace(/\/$/, "") + "/";
  return (
    <article className={styles.card}>
      <div
        className={styles.art}
        data-playing={active && state === "ready"}
        style={
          {
            "--catalog-art": art?.background ?? "var(--exhibit-surface, #fff)",
          } as CSSProperties
        }
      >
        <Link
          className={styles.poster}
          href={href}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={item.thumbnail}
            alt=""
            width={size.width}
            height={size.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={{ objectFit: fit }}
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalWidth && image.naturalHeight)
                setSize({
                  width: image.naturalWidth,
                  height: image.naturalHeight,
                });
            }}
          />
        </Link>
        {active && (
          <div className={styles.live} data-ready={state === "ready"}>
            <LivePreview
              item={item}
              width={size.width}
              height={size.height}
              fit={fit}
              onReady={ready}
              onError={error}
            />
          </div>
        )}
        {active && state === "error" && (
          <p className={styles.previewError}>
            Preview unavailable.{" "}
            <Link href={href}>
              Open component <ArrowUpRight size={12} aria-hidden />
            </Link>
          </p>
        )}
        <button
          type="button"
          className={styles.play}
          data-active={active}
          aria-label={
            active ? `Stop ${item.title} preview` : `Try ${item.title} live`
          }
          onClick={() => {
            if (active) onStop();
            else {
              setState("loading");
              onActivate();
            }
          }}
        >
          {active ? (
            state === "loading" ? (
              <LoaderCircle className={styles.spinner} size={13} aria-hidden />
            ) : (
              <X size={13} aria-hidden />
            )
          ) : (
            <Play size={12} aria-hidden />
          )}
          {active ? (state === "loading" ? "Starting" : "Stop") : "Try live"}
        </button>
      </div>
      <div className={styles.caption}>
        <h2>
          <Link href={href}>{item.title}</Link>
        </h2>
        <span>
          {categoryNames[item.category] || item.category}
          <ArrowUpRight size={12} aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function Catalog({
  items,
  initialCategory = "All",
  initialQuery = "",
  heading = false,
}: {
  items: Card[];
  initialCategory?: string;
  initialQuery?: string;
  heading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<string | null>(null);
  const typing = useRef(false);
  const scoped = useMemo(
    () =>
      items.filter(
        (item) =>
          (initialCategory === "All" || item.category === initialCategory) &&
          (!initialQuery ||
            item.tags.some(
              (tag) => tag.toLowerCase() === initialQuery.toLowerCase(),
            )),
      ),
    [items, initialCategory, initialQuery],
  );
  const categories = categoryOrder.filter(
    (name) => name === "All" || scoped.some((item) => item.category === name),
  );
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search);
      const selection = params.get("category") || "All";
      setCategory(
        categoryOrder.includes(selection) &&
          scoped.some((item) => item.category === selection)
          ? selection
          : "All",
      );
      setQuery(params.get("q") || "");
      setActive(null);
      typing.current = false;
    };
    restore();
    addEventListener("popstate", restore);
    return () => removeEventListener("popstate", restore);
  }, [scoped]);
  function change(
    nextCategory: string,
    nextQuery: string,
    typingQuery = false,
  ) {
    setCategory(nextCategory);
    setQuery(nextQuery);
    setActive(null);
    const url = new URL(location.href);
    if (nextCategory === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", nextCategory);
    if (nextQuery) url.searchParams.set("q", nextQuery);
    else url.searchParams.delete("q");
    if (url.href !== location.href) {
      const method =
        typingQuery && typing.current ? "replaceState" : "pushState";
      history[method](null, "", url.pathname + url.search + url.hash);
    }
    typing.current = typingQuery;
  }
  const visible = scoped
    .filter(
      (item) =>
        (category === "All" || item.category === category) &&
        `${item.title} ${item.description} ${item.tags.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        (featured.includes(a.id) ? featured.indexOf(a.id) : 999) -
        (featured.includes(b.id) ? featured.indexOf(b.id) : 999),
    );
  const search = (
    <label className={styles.search}>
      <Search size={15} aria-hidden />
      <input
        type="search"
        aria-label="Search components"
        placeholder="Search components…"
        value={query}
        onBlur={() => {
          typing.current = false;
        }}
        onChange={(event) => change(category, event.target.value, true)}
      />
    </label>
  );
  return (
    <div className={styles.catalog}>
      {heading && (
        <div className={styles.intro}>
          <div>
            <h1>Find your next signature.</h1>
            <p>
              Shaders, page sections, and the interactions in between. All free.
              All yours.
            </p>
          </div>
          {search}
        </div>
      )}
      <div className={styles.toolbar}>
        <div
          className={styles.categories}
          role="group"
          aria-label="Filter components by category"
        >
          {categories.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => change(name, query)}
              aria-pressed={name === category}
            >
              {categoryNames[name] || name}
              <small>
                {name === "All"
                  ? scoped.length
                  : scoped.filter((item) => item.category === name).length}
              </small>
            </button>
          ))}
        </div>
        {!heading && search}
      </div>
      <p className={styles.status} role="status">
        {visible.length} free components{query && ` matching “${query}”`}
      </p>
      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              active={active === item.id}
              onActivate={() => setActive(item.id)}
              onStop={() => setActive(null)}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Search size={28} strokeWidth={1.25} aria-hidden />
          <h2>No components found.</h2>
          <p>
            Try another search or clear the filters to explore this collection.
          </p>
          <button type="button" onClick={() => change("All", "")}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
