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
  const ready = useCallback(() => {
    mounted.current = true;
    parent.postMessage(
      { type: "vfx:preview-ready", id: item?.id },
      location.origin,
    );
  }, []);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        !event.data ||
        event.data.type !== "vfx:preview"
      )
        return;
      if (event.data.scheme === "light" || event.data.scheme === "dark")
        setScheme(event.data.scheme);
      if (
        event.data.props &&
        typeof event.data.props === "object" &&
        !Array.isArray(event.data.props)
      )
        setProps((previous) => ({ ...previous, ...event.data.props }));
      // A static iframe can finish before the parent hydrates. Reply to its
      // state handshake so a missed initial ready message cannot leave a mask.
      if (mounted.current)
        parent.postMessage(
          { type: "vfx:preview-ready", id: item?.id },
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
  return (
    <main
      className={`preview-root ${full ? "preview-full" : "preview-contained"}`}
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
