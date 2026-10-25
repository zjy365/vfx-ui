import React, {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import catalog from "../../../catalog/preview.json";
import "./preview.css";

const loaders = import.meta.glob<Record<string, React.ComponentType<any>>>(
  "../../../packages/react/src/components/*.tsx",
);

function content(value: unknown): any {
  if (Array.isArray(value)) return value.map(content);
  if (value && typeof value === "object") {
    const element = value as {
      type?: unknown;
      props?: Record<string, unknown>;
    };
    if (typeof element.type === "string" && element.props) {
      const { children, ...props } = element.props;
      return React.createElement(element.type, props, content(children));
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, content(entry)]),
    );
  }
  return value;
}

class PreviewError extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {
    parent.postMessage(
      { type: "vfx:preview-error", id: item?.id },
      location.origin,
    );
  }
  render() {
    return this.state.error ? (
      <div className="preview-state" role="alert">
        <h1>This preview could not start.</h1>
        <p>
          Try reloading, or use the installation example in your own project.
        </p>
        <button onClick={() => location.reload()}>Reload preview</button>
      </div>
    ) : (
      this.props.children
    );
  }
}

const params = new URLSearchParams(location.search);
const item = catalog.components.find(
  (entry: any) => entry.id === params.get("component"),
);
const loader = item
  ? loaders[`../../../packages/react/src/components/${item.componentName}.tsx`]
  : undefined;
const Preview =
  loader && item
    ? lazy(async () => ({ default: (await loader())[item.componentName]! }))
    : null;

function Mounted({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

function App() {
  const [props, setProps] = useState<Record<string, unknown>>(() => ({
    ...content(item?.previewProps ?? {}),
    interactive: true,
  }));
  const [scheme, setScheme] = useState(
    params.get("scheme") === "light" ? "light" : "dark",
  );
  const mounted = useRef(false);
  const measuredHeight = useRef(0);
  const stage = useRef<HTMLElement>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const ready = useCallback(() => {
    mounted.current = true;
    setPreviewReady(true);
    parent.postMessage(
      { type: "vfx:preview-ready", id: item?.id },
      location.origin,
    );
  }, []);
  useEffect(() => {
    if (
      !previewReady ||
      params.get("resize") !== "content" ||
      !["Heroes", "Footers"].includes(item?.category || "")
    )
      return;
    // Observe the real component, never main/body: their 100vh minimum follows
    // the iframe and could feed its newly assigned height back to the parent.
    const component = stage.current?.firstElementChild;
    if (!(component instanceof HTMLElement)) return;
    let lastHeight = 0;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.ceil(component.getBoundingClientRect().height);
        if (
          !Number.isFinite(height) ||
          height < 100 ||
          height > 3000 ||
          Math.abs(height - lastHeight) <= 2
        )
          return;
        lastHeight = height;
        measuredHeight.current = height;
        parent.postMessage(
          { type: "vfx:preview-size", id: item?.id, height },
          location.origin,
        );
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(component);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [previewReady]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        !event.data ||
        event.data.type !== "vfx:preview"
      )
        return;
      const componentScheme = event.data.props?.scheme;
      const nextScheme = componentScheme === "light" || componentScheme === "dark"
        ? componentScheme : event.data.scheme;
      if (nextScheme === "light" || nextScheme === "dark")
        setScheme(nextScheme);
      if (
        event.data.props &&
        typeof event.data.props === "object" &&
        !Array.isArray(event.data.props)
      )
        // Each message is a complete override snapshot, not an incremental patch.
        setProps({ ...content(item?.previewProps ?? {}), interactive: true, ...content(event.data.props) });
      // A static iframe can finish before the parent hydrates. Reply to its
      // state handshake so a missed initial ready message cannot leave a mask.
      if (mounted.current)
        parent.postMessage(
          { type: "vfx:preview-ready", id: item?.id },
          location.origin,
        );
      if (mounted.current && measuredHeight.current)
        parent.postMessage(
          {
            type: "vfx:preview-size",
            id: item?.id,
            height: measuredHeight.current,
          },
          location.origin,
        );
    };
    addEventListener("message", listener);
    return () => removeEventListener("message", listener);
  }, []);
  if (!item || !Preview)
    return (
      <div className="preview-state" role="alert">
        Component not found.
      </div>
    );
  const full = ["Heroes", "Footers", "Blocks"].includes(item.category);
  const exhibit = params.get("presentation") === "exhibit";
  return (
    <main
      ref={stage}
      className={`preview-root ${full ? "preview-full" : "preview-contained"} ${exhibit ? "preview-exhibit" : ""}`}
      data-scheme={scheme}
    >
      <PreviewError>
        <Suspense
          fallback={
            <div className="preview-state" role="status">
              Loading preview…
            </div>
          }
        >
          <Preview {...props} scheme={scheme} />
          <Mounted onReady={ready} />
        </Suspense>
      </PreviewError>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
