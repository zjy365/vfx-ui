"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Maximize2,
  Monitor,
  Moon,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  Sun,
} from "lucide-react";
import type { CatalogComponent, Control } from "@/lib/catalog";
import { CopyButton } from "./copy-button";
import { DetailCode } from "./detail-code";
import { usageWithProps } from "./detail-usage";
import "./detail-workbench.css";

function sharedSettings(controls: Control[]): Record<string, unknown> {
  const raw = new URLSearchParams(location.search).get("props");
  if (!raw || raw.length > 12000) return {};
  try {
    const input: unknown = JSON.parse(raw);
    if (!input || typeof input !== "object" || Array.isArray(input)) return {};
    const values = input as Record<string, unknown>,
      result: Record<string, unknown> = {};
    for (const control of controls) {
      const value = values[control.key];
      if (control.kind === "toggle" && typeof value === "boolean")
        result[control.key] = value;
      else if (
        control.kind === "color" &&
        typeof value === "string" &&
        /^#[0-9a-f]{6}$/i.test(value)
      )
        result[control.key] = value;
      else if (control.kind === "text" && typeof value === "string")
        result[control.key] = value.slice(0, 1000);
      else if (
        control.kind === "choice" &&
        typeof value === "string" &&
        control.options?.some((option) => option.value === value)
      )
        result[control.key] = value;
      else if (
        (!control.kind || control.kind === "range") &&
        typeof value === "number" &&
        Number.isFinite(value)
      )
        result[control.key] = Math.min(
          control.max ?? Infinity,
          Math.max(control.min ?? -Infinity, value),
        );
    }
    return result;
  } catch {
    return {};
  }
}

export function ComponentDetail({
  item,
  variantId,
  fullscreen = false,
}: {
  item: CatalogComponent;
  variantId?: string;
  fullscreen?: boolean;
}) {
  const initialVariant = item.variants?.find(
    (variant) => variant.id === variantId,
  );
  const defaults = useMemo(
    () =>
      Object.fromEntries(
        (item.controls || [])
          .filter((control) => control.default !== undefined)
          .map((control) => [control.key, control.default]),
      ),
    [item.controls],
  );
  const initialProps = useMemo(
    () => ({ ...defaults, ...initialVariant?.props }),
    [defaults, initialVariant],
  );
  const [props, setProps] = useState<Record<string, unknown>>(initialProps);
  const [preset, setPreset] = useState(variantId || "");
  const [previewScheme, setPreviewScheme] = useState("light");
  const hasSchemeControl = Boolean(item.controls?.some(control => control.key === "scheme"));
  const scheme = hasSchemeControl && (props.scheme === "light" || props.scheme === "dark")
    ? props.scheme : previewScheme;
  const [viewport, setViewport] = useState("desktop");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [installation, setInstallation] = useState<"registry" | "package">(
    "registry",
  );
  const [installOpen, setInstallOpen] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [running, setRunning] = useState(true);
  const [reload, setReload] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const naturalPreview =
    !fullscreen && ["Heroes", "Footers"].includes(item.category);
  const iframe = useRef<HTMLIFrameElement>(null);
  const usageRef = useRef<HTMLElement>(null);
  const controlsId = useId();
  const hasControls = Boolean(item.controls?.length || item.variants?.length);
  const selectedVariant = item.variants?.find(
    (variant) => variant.id === preset,
  );
  const unchangedPreset = selectedVariant && JSON.stringify(props) === JSON.stringify({ ...defaults, ...selectedVariant.props });
  const poster = selectedVariant?.thumbnail || item.thumbnail;
  const sourceUrl =
    "https://github.com/zjy365/vfx-ui/blob/main/" + item.sourcePath;
  const send = useCallback(() => {
    iframe.current?.contentWindow?.postMessage(
      { type: "vfx:preview", scheme, props },
      location.origin,
    );
  }, [scheme, props]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedPreset = item.variants?.find(variant => variant.id === params.get("preset"));
    const shared = sharedSettings(item.controls || []);
    const sharedScheme = params.get("scheme");
    const validScheme = sharedScheme === "light" || sharedScheme === "dark";
    // Preset values come from our catalog; URL overrides remain control-validated.
    setProps({ ...initialProps, ...sharedPreset?.props, ...shared,
      ...(hasSchemeControl && validScheme ? { scheme: sharedScheme } : {}) });
    setPreset(sharedPreset?.id || variantId || "");
    if (validScheme) setPreviewScheme(sharedScheme);
  }, [initialProps, item.controls, item.variants, variantId, hasSchemeControl]);
  useEffect(() => {
    send();
  }, [send, ready]);
  useEffect(() => {
    function listener(event: MessageEvent) {
      if (
        event.origin !== location.origin ||
        event.source !== iframe.current?.contentWindow ||
        event.data?.id !== item.id
      )
        return;
      if (event.data?.type === "vfx:preview-ready") {
        setReady(true);
        setFailed(false);
      }
      if (event.data?.type === "vfx:preview-error") {
        setReady(false);
        setFailed(true);
      }
      if (
        naturalPreview &&
        event.data?.type === "vfx:preview-size" &&
        typeof event.data.height === "number" &&
        Number.isFinite(event.data.height) &&
        event.data.height >= 100 &&
        event.data.height <= 3000
      ) {
        const height = Math.ceil(event.data.height);
        setPreviewHeight((previous) =>
          previous !== null && Math.abs(previous - height) <= 2
            ? previous
            : height,
        );
      }
    }
    addEventListener("message", listener);
    return () => removeEventListener("message", listener);
  }, [item.id, naturalPreview]);
  useEffect(() => {
    if (!running || ready) return;
    const timeout = setTimeout(() => setFailed(true), 20000);
    return () => clearTimeout(timeout);
  }, [running, ready, reload]);

  function update(control: Control, value: unknown) {
    setProps((previous) => ({ ...previous, [control.key]: value }));
    // Retain the base preset so fullscreen can restore its non-editable fields.
  }
  function changeScheme() {
    const next = scheme === "light" ? "dark" : "light";
    setPreviewScheme(next);
    if (hasSchemeControl) setProps(previous => ({ ...previous, scheme: next }));
  }
  function replay() {
    setReady(false);
    setFailed(false);
    setRunning(true);
    setReload((value) => value + 1);
  }
  function openCode() {
    setInstallOpen(true);
    requestAnimationFrame(() =>
      usageRef.current?.scrollIntoView({
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
  const example = useMemo(
    () =>
      usageWithProps(
        installation === "registry" ? item.registrySourceCode : item.sourceCode,
        item.componentName,
        props,
      ),
    [
      installation,
      item.registrySourceCode,
      item.sourceCode,
      item.componentName,
      props,
    ],
  );
  const longCode = example.split("\n").length > 12;
  const preview = (
    <div
      className="dw-preview"
      data-device={viewport}
      data-scheme={scheme}
      data-category={item.category}
    >
      {running ? (
        <>
          <iframe
            key={reload}
            ref={iframe}
            title={item.title + " live preview"}
            src={`/preview-runtime/index.html?component=${encodeURIComponent(item.id)}&scheme=light${item.category === "Backgrounds" ? "&presentation=exhibit" : ""}${naturalPreview ? "&resize=content" : ""}`}
            sandbox="allow-scripts allow-same-origin"
            onLoad={send}
          />
          {!ready && (
            <div className="dw-preview-poster" role="status">
              <img src={poster} alt="" />
              <div className="dw-preview-status">
                {failed ? (
                  <>
                    <span>The live preview could not start.</span>
                    <button type="button" onClick={replay}>
                      <RotateCcw size={14} />
                      Try again
                    </button>
                  </>
                ) : (
                  <>
                    <span className="dw-loading-dot" />
                    Starting live preview
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <img
            className="dw-paused-poster"
            src={poster}
            alt={item.title + " preview"}
          />
          <button
            type="button"
            className="dw-play"
            onClick={() => {
              setReady(false);
              setFailed(false);
              setRunning(true);
            }}
          >
            <Play size={15} />
            Play preview
          </button>
        </>
      )}
    </div>
  );
  if (fullscreen)
    return (
      <main id="main" className="dw-fullscreen">
        {preview}
        <Link className="dw-back" href={item.path + "/"}>
          <ArrowLeft size={15} />
          {item.title}
        </Link>
      </main>
    );

  return (
    <div className="detail-workbench">
      <div className="dw-heading">
        <div>
          <h1>{item.title}</h1>
          <p>{initialVariant?.description || item.description}</p>
        </div>
        <div className="dw-heading-actions">
          <a href={sourceUrl} className="dw-source">
            View source
            <ArrowUpRight size={14} />
          </a>
          <button type="button" className="dw-primary" onClick={openCode}>
            Get component
            <ArrowDown size={15} />
          </button>
        </div>
      </div>
      <section className="dw-workspace" aria-label={item.title + " playground"}>
        <div className="dw-toolbar">
          <span className="dw-preview-label">
            Preview
            <span className="dw-runtime">
              {item.runtime === "dom" ? "React" : item.runtime.toUpperCase()}
            </span>
          </span>
          <div className="dw-tools">
            <button
              type="button"
              title="Change preview theme"
              aria-label={`Preview theme: ${scheme}. Change preview theme`}
              onClick={changeScheme}
            >
              {scheme === "light" ? <Sun size={15} /> : <Moon size={15} />}
              <span>{scheme === "light" ? "Light" : "Dark"}</span>
            </button>
            <button
              type="button"
              aria-pressed={viewport === "mobile"}
              title="Change preview width"
              aria-label={`Preview width: ${viewport}. Change preview width`}
              onClick={() =>
                setViewport((value) =>
                  value === "desktop" ? "mobile" : "desktop",
                )
              }
            >
              {viewport === "desktop" ? (
                <Monitor size={15} />
              ) : (
                <Smartphone size={15} />
              )}
              <span>{viewport === "desktop" ? "Desktop" : "Mobile"}</span>
            </button>
            <button
              type="button"
              aria-label={running ? "Pause live preview" : "Play live preview"}
              onClick={() => {
                setRunning((value) => !value);
                setReady(false);
                setFailed(false);
              }}
            >
              {running ? <Pause size={14} /> : <Play size={14} />}
              <span>{running ? "Pause" : "Play"}</span>
            </button>
            <button
              type="button"
              title="Replay component"
              aria-label="Replay component"
              onClick={replay}
            >
              <RotateCcw size={14} />
            </button>
            <a
              title="Open fullscreen preview"
              aria-label="Open fullscreen preview"
              href={
                "/preview/" +
                item.id +
                "/?props=" +
                encodeURIComponent(JSON.stringify(props)) +
                (preset ? "&preset=" + encodeURIComponent(preset) : "") +
                "&scheme=" +
                scheme
              }
              target="_blank"
              rel="noreferrer"
            >
              <Maximize2 size={14} />
            </a>
            {hasControls && (
              <button
                type="button"
                className="dw-customize-toggle"
                aria-expanded={controlsOpen}
                aria-controls={controlsId}
                onClick={() => setControlsOpen((value) => !value)}
              >
                <SlidersHorizontal size={15} />
                <span>Customize</span>
              </button>
            )}
          </div>
        </div>
        <div
          className="dw-stage-layout"
          style={
            naturalPreview && previewHeight
              ? ({ "--dw-stage-height": `${previewHeight}px` } as CSSProperties)
              : undefined
          }
          data-controls={hasControls && controlsOpen ? "open" : "closed"}
        >
          <div className="dw-stage">{preview}</div>
          {hasControls && controlsOpen && (
            <aside
              id={controlsId}
              className="dw-controls"
              aria-label="Customize component"
            >
              <div className="dw-controls-heading">
                <h2>Make it yours</h2>
                <button
                  type="button"
                  onClick={() => {
                    setProps(initialProps);
                    setPreset(variantId || "");
                  }}
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
              {item.variants?.length ? (
                <div className="dw-presets" aria-label="Presets">
                  {item.variants.map((variant) => (
                    <button
                      type="button"
                      key={variant.id}
                      aria-pressed={preset === variant.id && Boolean(unchangedPreset)}
                      onClick={() => {
                        setProps({ ...defaults, ...variant.props });
                        setPreset(variant.id);
                      }}
                    >
                      {variant.label}
                      {preset === variant.id && unchangedPreset && <Check size={12} />}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="dw-control-list">
                {(item.controls || []).map((control) => (
                  <label
                    className={
                      "dw-control dw-control-" + (control.kind || "range")
                    }
                    key={control.key}
                  >
                    <span className="dw-control-label">
                      {control.label}
                      {(!control.kind || control.kind === "range") && (
                        <output>
                          {Number(
                            props[control.key] ?? control.default ?? 0,
                          ).toLocaleString("en-US", {
                            maximumFractionDigits: control.digits ?? 3,
                          })}
                        </output>
                      )}
                    </span>
                    {control.kind === "toggle" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(props[control.key])}
                        onChange={(event) =>
                          update(control, event.target.checked)
                        }
                      />
                    ) : control.kind === "choice" ? (
                      <select
                        value={String(
                          props[control.key] ?? control.default ?? "",
                        )}
                        onChange={(event) =>
                          update(control, event.target.value)
                        }
                      >
                        {control.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : control.kind === "text" ? (
                      <textarea
                        rows={2}
                        value={String(props[control.key] ?? "")}
                        onChange={(event) =>
                          update(control, event.target.value)
                        }
                      />
                    ) : control.kind === "color" ? (
                      <span className="dw-color-value">
                        <input
                          type="color"
                          value={String(props[control.key] ?? "#17191c")}
                          onChange={(event) =>
                            update(control, event.target.value)
                          }
                        />
                        <span>
                          {String(
                            props[control.key] ?? "#17191c",
                          ).toUpperCase()}
                        </span>
                      </span>
                    ) : (
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={Number(
                          props[control.key] ?? control.default ?? 0,
                        )}
                        onChange={(event) =>
                          update(control, Number(event.target.value))
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              <p className="dw-local-note">
                Your settings are reflected in the code below.
              </p>
            </aside>
          )}
        </div>
      </section>
      <section ref={usageRef} className="dw-usage" aria-label="Component usage">
        <div className="dw-usage-heading">
          <div className="dw-usage-tabs">
            <h2>Usage</h2>
            <button
              type="button"
              aria-pressed={installation === "registry"}
              onClick={() => setInstallation("registry")}
            >
              Registry source
            </button>
            <button
              type="button"
              aria-pressed={installation === "package"}
              onClick={() => setInstallation("package")}
            >
              npm package
            </button>
          </div>
          <CopyButton label="Copy code" value={example} />
        </div>
        <div
          className="dw-code"
          data-expanded={codeExpanded || !longCode ? "true" : "false"}
        >
          <pre tabIndex={0} aria-label="Usage code">
            <code>
              <DetailCode source={example} />
            </code>
          </pre>
          {longCode && (
            <button
              className="dw-expand-code"
              type="button"
              aria-expanded={codeExpanded}
              onClick={() => setCodeExpanded((value) => !value)}
            >
              <Code2 size={14} />
              {codeExpanded ? "Collapse code" : "Show full example"}
              <ChevronDown size={14} />
            </button>
          )}
        </div>
        <div className="dw-install">
          <button
            type="button"
            className="dw-install-toggle"
            aria-expanded={installOpen}
            onClick={() => setInstallOpen((value) => !value)}
          >
            <ChevronDown size={14} />
            Installation<span>Free, editable source. No account required.</span>
          </button>
          {installOpen && (
            <div className="dw-install-body">
              <div className="dw-command">
                <code>{command}</code>
                <CopyButton value={command} />
              </div>
              <p>
                {installation === "registry"
                  ? "Uses your configured components directory and @/ import alias. "
                  : "Imports components from the React package. "}
                <Link href="/docs/installation/">
                  Installation guide
                  <ArrowUpRight size={12} />
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="dw-reference" aria-label="Component reference">
        <details>
          <summary>
            Implementation notes & API
            <ChevronDown size={16} />
          </summary>
          <div>
            {item.agentNotes && <p>{item.agentNotes}</p>}
            {item.api?.length ? (
              <div className="dw-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Notes / default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.api.map((row, index) => (
                      <tr key={index}>
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
            ) : (
              <p>View the typed source for the full component API.</p>
            )}
          </div>
        </details>
        <div className="dw-license">
          <a href={sourceUrl}>
            View source on GitHub
            <ArrowUpRight size={13} />
          </a>
          <span>Free for commercial projects · MIT</span>
        </div>
      </section>
    </div>
  );
}
