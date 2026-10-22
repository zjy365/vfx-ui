"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CatalogComponent, Control } from "@/lib/catalog";
import { CopyButton } from "./copy-button";
export function ComponentDetail({
  item,
  variantId,
  fullscreen = false,
}: {
  item: CatalogComponent;
  variantId?: string;
  fullscreen?: boolean;
}) {
  const initialVariant = item.variants?.find((x) => x.id === variantId);
  const defaults = Object.fromEntries(
    (item.controls || [])
      .filter((x) => x.default !== undefined)
      .map((x) => [x.key, x.default]),
  );
  const [props, setProps] = useState<Record<string, unknown>>({
    ...defaults,
    ...initialVariant?.props,
  });
  const [scheme, setScheme] = useState("light"),
    [viewport, setViewport] = useState("desktop"),
    [panel, setPanel] = useState("preview"),
    [installation, setInstallation] = useState<"registry" | "package">(
      "registry",
    ),
    [running, setRunning] = useState(true),
    [reload, setReload] = useState(0),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null),
    panelRef = useRef<HTMLDivElement>(null);
  function send() {
    iframe.current?.contentWindow?.postMessage(
      { type: "vfx:preview", scheme, props },
      location.origin,
    );
  }
  useEffect(() => {
    send();
  }, [scheme, props, ready]);
  useEffect(() => {
    function listener(event: MessageEvent) {
      if (
        event.origin === location.origin &&
        event.source === iframe.current?.contentWindow &&
        (event.data?.type === "vfx:preview-ready" ||
          event.data?.type === "vfx:preview-error") &&
        event.data.id === item.id
      ) {
        setReady(event.data.type === "vfx:preview-ready");
        setFailed(event.data.type === "vfx:preview-error");
      }
    }
    addEventListener("message", listener);
    send();
    return () => removeEventListener("message", listener);
  }, [item.id]);
  useEffect(() => {
    if (!running || ready) return;
    const timer = setTimeout(() => setFailed(true), 20000);
    return () => clearTimeout(timer);
  }, [running, ready, reload]);
  function update(control: Control, value: unknown) {
    setProps((previous) => ({ ...previous, [control.key]: value }));
  }
  function openCode() {
    setPanel("code");
    requestAnimationFrame(() =>
      panelRef.current?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      }),
    );
  }
  const command =
    installation === "registry"
      ? `npx shadcn@latest add ${item.registryUsageIds.map((id) => `https://vfx-ui.com/r/${id}.json`).join(" ")}`
      : "npm install @vfx-ui/react";
  const example =
    installation === "registry" ? item.registrySourceCode : item.sourceCode;
  const preview = (
    <div
      className={"live-preview " + (viewport === "mobile" ? "narrow" : "")}
      data-scheme={scheme}
    >
      {running ? (
        <>
          <iframe
            key={reload}
            ref={iframe}
            title={item.title + " live preview"}
            src={`/preview-runtime/index.html?component=${encodeURIComponent(item.id)}&scheme=light`}
            sandbox="allow-scripts allow-same-origin"
            onLoad={send}
          />
          {!ready && (
            <div className="preview-loading" role="status">
              <img src={initialVariant?.thumbnail || item.thumbnail} alt="" />
              <span>
                {failed ? (
                  <>
                    <p>The preview is taking longer than expected.</p>
                    <button
                      onClick={() => {
                        setReady(false);
                        setFailed(false);
                        setReload((value) => value + 1);
                      }}
                    >
                      Reload
                    </button>
                  </>
                ) : (
                  "Starting live preview…"
                )}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src={initialVariant?.thumbnail || item.thumbnail}
            alt={item.title + " preview"}
            width="1312"
            height="580"
          />
          <button
            className="button"
            onClick={() => {
              setReady(false);
              setRunning(true);
            }}
          >
            Play live preview ↗
          </button>
        </>
      )}
    </div>
  );
  if (fullscreen)
    return (
      <main id="main" className="fullscreen-preview">
        {preview}
        <Link className="preview-back" href={item.path + "/"}>
          ← {item.title}
        </Link>
      </main>
    );
  return (
    <>
      <div className="component-product-heading">
        <div>
          <h1>{item.title}</h1>
          <p>{initialVariant?.description || item.description}</p>
        </div>
        <button className="button button-outline" onClick={openCode}>
          Get component ↗
        </button>
      </div>
      <div className="product-preview-tools">
        <span className="eyebrow">
          LIVE COMPONENT /{" "}
          {item.runtime === "webgpu"
            ? "WEBGPU"
            : item.runtime === "webgl"
              ? "WEBGL"
              : "DOM + CSS"}
        </span>
        <div className="preview-options">
          <button
            onClick={() => setScheme((x) => (x === "dark" ? "light" : "dark"))}
          >
            {scheme === "dark" ? "☀ Light" : "◐ Dark"}
          </button>
          <button
            aria-pressed={viewport === "mobile"}
            onClick={() =>
              setViewport((x) => (x === "desktop" ? "mobile" : "desktop"))
            }
          >
            {viewport === "desktop" ? "Mobile" : "Desktop"}
          </button>
          <button
            onClick={() => {
              setRunning((x) => !x);
              setReady(false);
            }}
          >
            {running ? "Pause" : "Play"}
          </button>
          <a
            href={"/preview/" + item.id + "/"}
            target="_blank"
            rel="noreferrer"
          >
            Fullscreen ↗
          </a>
        </div>
      </div>
      {preview}
      <div ref={panelRef} className="product-panel-anchor">
        <div className="product-action-bar">
          <div className="product-tabs" aria-label="Component options">
            {[
              ["preview", "Preview"],
              ["customize", "Customize ⚙"],
              ["code", "Usage & code ↗"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-expanded={panel === id && id !== "preview"}
                aria-pressed={panel === id}
                onClick={() => setPanel(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="eyebrow">REACT · TYPESCRIPT · FREE / MIT</span>
        </div>
        {panel === "customize" && (
          <section
            className="customize-surface"
            aria-label="Customize component"
          >
            <div className="customize-heading">
              <h2>Make it yours.</h2>
              <div className="customize-actions">
                <CopyButton
                  label="Copy props"
                  value={JSON.stringify(props, null, 2)}
                />
                <button
                  className="reset-controls"
                  onClick={() =>
                    setProps({ ...defaults, ...initialVariant?.props })
                  }
                >
                  Reset
                </button>
              </div>
            </div>
            {item.variants?.length ? (
              <div className="variant-list" aria-label="Presets">
                {item.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setProps({ ...defaults, ...variant.props })}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="customize-grid">
              {(item.controls || []).map((control) => (
                <label key={control.key} className="control-field">
                  <span>{control.label}</span>
                  {control.kind === "toggle" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(props[control.key])}
                      onChange={(e) => update(control, e.target.checked)}
                    />
                  ) : control.kind === "choice" ? (
                    <select
                      value={String(
                        props[control.key] ?? control.default ?? "",
                      )}
                      onChange={(e) => update(control, e.target.value)}
                    >
                      {control.options?.map((x) => (
                        <option value={x.value} key={x.value}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  ) : control.kind === "text" ? (
                    <textarea
                      value={String(props[control.key] ?? "")}
                      rows={2}
                      onChange={(e) => update(control, e.target.value)}
                    />
                  ) : control.kind === "color" ? (
                    <input
                      type="color"
                      value={String(props[control.key] ?? "#17191c")}
                      onChange={(e) => update(control, e.target.value)}
                    />
                  ) : (
                    <>
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={Number(
                          props[control.key] ?? control.default ?? 0,
                        )}
                        onChange={(e) =>
                          update(control, Number(e.target.value))
                        }
                      />
                      <output>
                        {String(props[control.key] ?? control.default ?? 0)}
                      </output>
                    </>
                  )}
                </label>
              ))}
            </div>
            <p className="license-note">
              Changes stay in your browser. Copy your props object and spread it
              onto the component in your project.
            </p>
          </section>
        )}
        {panel === "code" && (
          <section className="usage-surface" aria-label="Install component">
            <div>
              <h2>Start with the source.</h2>
              <div className="variant-list" aria-label="Installation method">
                <button
                  aria-pressed={installation === "registry"}
                  onClick={() => setInstallation("registry")}
                >
                  Registry source
                </button>
                <button
                  aria-pressed={installation === "package"}
                  onClick={() => setInstallation("package")}
                >
                  npm package
                </button>
              </div>
              <p>
                {installation === "registry"
                  ? "Install editable source with the shadcn registry. The example imports your local files using the default @/ alias."
                  : "Install the React package, then use the package import shown in this example."}{" "}
                No account required.
              </p>
              <div className="install-command">
                <code>{command}</code>
                <CopyButton value={command} />
              </div>
              <p className="license-note">
                {installation === "registry"
                  ? "Adjust the import path to your configured components directory. "
                  : ""}
                <Link href="/docs/installation/">Installation guide ↗</Link>
              </p>
            </div>
            <div className="code-panel">
              <CopyButton value={example} />
              <pre>
                <code>{example}</code>
              </pre>
            </div>
          </section>
        )}
      </div>
      <div className="component-reference">
        <details>
          <summary>
            Implementation notes & API <span>＋</span>
          </summary>
          <div>
            {item.agentNotes && <p>{item.agentNotes}</p>}
            {item.api?.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Notes / default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.api.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <code>{row.name}</code>
                        </td>
                        <td>
                          <code>{row.type}</code>
                        </td>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </details>
        <div className="component-source">
          <a
            href={
              "https://github.com/zjy365/vfx-ui/blob/main/" + item.sourcePath
            }
          >
            View source on GitHub ↗
          </a>
          <span>Free for commercial projects · MIT</span>
        </div>
      </div>
    </>
  );
}
