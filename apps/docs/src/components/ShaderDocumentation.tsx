import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, SetStateAction } from "react";
import type { ChoiceControl, RangeControl, ReadyShader, ShaderControl } from "../data/registry";
import { READY_SHADERS, VISIBLE_READY_SHADERS } from "../data/publicShaders";
import { readShaderMetrics, recordShaderCopy, recordShaderView } from "../shaderMetrics";
import { CheckIcon, ChevronIcon, CopyIcon, EyeIcon, RestartIcon, TocIcon } from "./icons";
import { INSTALL_COMMANDS, InstallationSteps } from "./InstallationSteps";
import { PreviewFpsMeter } from "./PreviewFpsMeter";
import { ShaderTags } from "./ShaderTags";
import { SyntaxHighlightedCode } from "./SyntaxHighlightedCode";
import { CheckpointSliderControl } from "./CheckpointSliderControl";

type SourceTab = "usage" | "agent" | "install";
type VariantEdgeMask = "none" | "left" | "right" | "both";
type PreviewSettings = Record<string, number | string>;

const SOURCE_TAB_LABELS: Record<SourceTab, string> = {
  usage: "Usage",
  agent: "Agent Notes",
  install: "Install",
};

const EMPTY_CONTROLS: readonly ShaderControl[] = [];

const TOC_ITEMS = [
  { id: "usage", label: "Usage" },
  { id: "props", label: "Props" },
  { id: "installation", label: "Installation" },
  { id: "agent", label: "Agent guide" },
] as const;

type TocSectionId = (typeof TOC_ITEMS)[number]["id"];

function defaultSettings(
  controls: readonly ShaderControl[],
  variantProps?: Readonly<Record<string, boolean | number | string | number[]>>,
): PreviewSettings {
  // Variant presets seed the controls they touch — otherwise the registry's
  // control defaults would silently override the variant's own values (e.g.
  // black-hole/interstellar framing at centerX 0.8 vs the control default 0).
  return Object.fromEntries(
    controls.map((control) => {
      const preset = variantProps?.[control.key];
      return [control.key, typeof preset === "number" || typeof preset === "string" ? preset : control.default];
    }),
  );
}

function isChoiceControl(control: ShaderControl): control is ChoiceControl {
  return control.kind === "choice";
}

function isRangeControl(control: ShaderControl): control is RangeControl {
  return control.kind === undefined || control.kind === "range";
}

function formatControlProp(control: ShaderControl, value: number | string) {
  if (!isRangeControl(control)) {
    return `        ${control.key}=${JSON.stringify(String(value))}`;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  return `        ${control.key}={${numeric.toFixed(control.digits)}}`;
}

function formatVariantProp(key: string, value: boolean | number | string) {
  if (typeof value === "string") return `        ${key}=${JSON.stringify(value)}`;
  return `        ${key}={${String(value)}}`;
}

function propsContractRows(controls: readonly ShaderControl[]) {
  return controls.map((control) => ({
    name: control.key,
    type: isRangeControl(control)
      ? "number"
      : control.kind === "color"
        ? "string (hex)"
        : control.kind === "text"
          ? "string"
          : control.kind === "checkpoint"
            ? "string"
            : "string",
    value: isRangeControl(control)
      ? `${control.min}–${control.max} (default ${control.default})`
      : control.kind === "choice" || control.kind === "checkpoint"
        ? control.options.map((option) => option.value).join(" | ")
        : String(control.default),
  }));
}

function controlPropLines(controls: readonly ShaderControl[], settings: PreviewSettings) {
  return controls.map((control) => formatControlProp(control, settings[control.key] ?? control.default));
}

function generatedExample(shader: ReadyShader, controls: readonly ShaderControl[], settings: PreviewSettings) {
  const controlProps = controlPropLines(controls, settings);
  const props = controlProps.join("\n");
  if (props) {
    return `import { ${shader.importName} } from "@vfx-ui/react";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">\n      <${shader.importName}\n${props}\n      />\n    </div>\n  );\n}`;
  }
  return `import { ${shader.importName} } from "@vfx-ui/react";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">\n      <${shader.importName} />\n    </div>\n  );\n}`;
}

function generatedInstallExample(shader: ReadyShader, controls: readonly ShaderControl[], settings: PreviewSettings) {
  const controlProps = controlPropLines(controls, settings);
  const props = controlProps.length ? `\n      <${shader.importName}\n${controlProps.join("\n")}\n      />` : `\n      <${shader.importName} />`;
  return `${INSTALL_COMMANDS.npm}\n\nimport { ${shader.importName} } from "@vfx-ui/react";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">${props}\n      </div>\n  );\n}`;
}

function buildPromptBundle(shader: ReadyShader, usage: string) {
  const lines = [
    `Add the vfx-ui component "${shader.label}" (${shader.importName}) from @vfx-ui/react to this project.`,
    "",
    "Install:",
    "",
    INSTALL_COMMANDS.npm,
    "",
    "Usage example:",
    "",
    usage,
  ];
  if (shader.agentNotes) {
    lines.push("", "Agent notes:", "", shader.agentNotes);
  }
  return lines.join("\n");
}

function buildSkillMarkdown(shader: ReadyShader, usage: string) {
  const slug = shader.id;
  const lines = [
    "---",
    `name: use-${slug}`,
    `description: "Use ${shader.label} from @vfx-ui/react: ${shader.description.replace(/"/g, "'")}"`,
    "---",
    "",
    `# Use ${shader.label}`,
    "",
    "## Description",
    "",
    shader.description,
    "",
    "## Install",
    "",
    "```bash",
    INSTALL_COMMANDS.npm,
    "```",
    "",
    "## Usage",
    "",
    "```tsx",
    usage,
    "```",
  ];
  if (shader.agentNotes) {
    lines.push("", "## Agent notes", "", shader.agentNotes);
  }
  return lines.join("\n");
}

type ShaderDocumentationProps = {
  shader: ReadyShader;
  activeVariantId?: string;
  onSearchTag: (tag: string) => void;
  onSelect: (id: ReadyShader["id"]) => void;
  onVariantSelect: (id: string) => void;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function ShaderDocumentation(props: ShaderDocumentationProps) {
  return <OpenShaderDocumentation {...props} />;
}

function OpenShaderDocumentation({ shader, activeVariantId, onSearchTag, onSelect, onVariantSelect }: ShaderDocumentationProps) {
  const activeVariant = shader.variants?.find((variant) => variant.id === activeVariantId) ?? shader.variants?.[0];
  const activeControls = activeVariant?.controls ?? shader.controls ?? EMPTY_CONTROLS;
  const [sourceTab, setSourceTab] = useState<SourceTab>("usage");
  const [restartKey, setRestartKey] = useState(0);
  const [toast, setToast] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const previewSettingsKey = `${shader.id}:${activeVariant?.id ?? "default"}`;
  const defaultPreviewSettings = useMemo(
    () => defaultSettings(activeControls, activeVariant?.props),
    [activeControls, activeVariant],
  );
  const [previewSettingsByComponent, setPreviewSettingsByComponent] = useState<Record<string, PreviewSettings>>({});
  const previewSettings = previewSettingsByComponent[previewSettingsKey] ?? defaultPreviewSettings;
  const [activeTocSection, setActiveTocSection] = useState<TocSectionId>("usage");
  const [metrics, setMetrics] = useState(() => readShaderMetrics(shader.id));
  const [variantEdgeMask, setVariantEdgeMask] = useState<VariantEdgeMask>("none");
  const docRef = useRef<HTMLElement>(null);
  const exportControlRef = useRef<HTMLDivElement>(null);
  const exportTriggerRef = useRef<HTMLButtonElement>(null);
  const promptFeedbackTimerRef = useRef<number | undefined>(undefined);
  const variantOptionsRef = useRef<HTMLDivElement>(null);
  const Preview = shader.component;
  const previewProps = { ...activeVariant?.props, ...previewSettings };
  const index = VISIBLE_READY_SHADERS.findIndex((item) => item.id === shader.id);
  const previous = index > 0 ? VISIBLE_READY_SHADERS[index - 1] : undefined;
  const next = index < VISIBLE_READY_SHADERS.length - 1 ? VISIBLE_READY_SHADERS[index + 1] : undefined;
  const activeTocIndex = Math.max(0, TOC_ITEMS.findIndex((item) => item.id === activeTocSection));
  const contractRows = useMemo(() => propsContractRows(activeControls), [activeControls]);

  const setPreviewSettings = (nextSettings: SetStateAction<PreviewSettings>) => {
    setPreviewSettingsByComponent((currentSettingsByComponent) => {
      const currentSettings = currentSettingsByComponent[previewSettingsKey] ?? defaultPreviewSettings;
      const resolvedSettings = typeof nextSettings === "function" ? nextSettings(currentSettings) : nextSettings;
      return { ...currentSettingsByComponent, [previewSettingsKey]: resolvedSettings };
    });
  };

  const settingsDirty = useMemo(
    () => activeControls.some((control) => previewSettings[control.key] !== defaultPreviewSettings[control.key]),
    [activeControls, previewSettings, defaultPreviewSettings],
  );

  const usageExample = useMemo(
    // Pristine: the curated example. Once the user touches the params panel the
    // code switches to the live-generated example so tweaks sync into the snippet.
    () => (shader.sourceCode && !settingsDirty ? shader.sourceCode : generatedExample(shader, activeControls, previewSettings)),
    // The generated example intentionally tracks live control values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shader, activeControls, previewSettings, settingsDirty],
  );

  const installExample = useMemo(
    () => generatedInstallExample(shader, activeControls, previewSettings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shader, activeControls, previewSettings],
  );

  useEffect(() => {
    setMetrics(readShaderMetrics(shader.id));
    const viewTimer = window.setTimeout(() => setMetrics(recordShaderView(shader.id)), 0);
    return () => window.clearTimeout(viewTimer);
  }, [shader.id]);

  useEffect(() => {
    const rail = variantOptionsRef.current;
    if (!rail) {
      setVariantEdgeMask("none");
      return undefined;
    }

    let animationFrame = 0;
    const updateEdgeMask = () => {
      animationFrame = 0;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const hasLeftOverflow = rail.scrollLeft > 1;
      const hasRightOverflow = rail.scrollLeft < maxScroll - 1;
      const nextMask: VariantEdgeMask = hasLeftOverflow
        ? hasRightOverflow ? "both" : "left"
        : hasRightOverflow ? "right" : "none";
      setVariantEdgeMask((current) => current === nextMask ? current : nextMask);
    };
    const scheduleEdgeMaskUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateEdgeMask);
    };
    const resizeObserver = new ResizeObserver(scheduleEdgeMaskUpdate);

    rail.addEventListener("scroll", scheduleEdgeMaskUpdate, { passive: true });
    resizeObserver.observe(rail);
    scheduleEdgeMaskUpdate();

    return () => {
      rail.removeEventListener("scroll", scheduleEdgeMaskUpdate);
      resizeObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [shader.id, shader.variants?.length]);

  useEffect(() => {
    const doc = docRef.current;
    const scroller = doc?.closest<HTMLElement>(".pane-scroll");
    if (!doc || !scroller) return undefined;

    let animationFrame = 0;
    const updateActiveSection = () => {
      animationFrame = 0;
      if (scroller.scrollTop <= 1) {
        setActiveTocSection("usage");
        return;
      }

      const activationLine = scroller.getBoundingClientRect().top + 40;
      let nextSection: TocSectionId = "usage";
      for (const item of TOC_ITEMS) {
        const section = doc.querySelector<HTMLElement>(`#${item.id}`);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextSection = item.id;
        }
      }
      setActiveTocSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
    };
    const scheduleActiveSection = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    scroller.addEventListener("scroll", scheduleActiveSection, { passive: true });
    window.addEventListener("hashchange", scheduleActiveSection);
    scheduleActiveSection();

    return () => {
      scroller.removeEventListener("scroll", scheduleActiveSection);
      window.removeEventListener("hashchange", scheduleActiveSection);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [shader.id]);

  const skillMarkdown = useMemo(() => buildSkillMarkdown(shader, usageExample), [shader, usageExample]);
  const promptBundle = useMemo(() => buildPromptBundle(shader, usageExample), [shader, usageExample]);

  const sourceText = useMemo(() => {
    if (sourceTab === "usage") return usageExample;
    if (sourceTab === "agent") return shader.agentNotes ?? "No agent notes are registered for this component yet.";
    return installExample;
  }, [installExample, shader.agentNotes, sourceTab, usageExample]);

  const sourceLanguage = sourceTab === "usage" ? "tsx" : sourceTab === "agent" ? "markdown" : "text";

  const viewLabel = `${metrics.views.toLocaleString()} ${metrics.views === 1 ? "view" : "views"}`;
  const copyLabel = `${metrics.copies.toLocaleString()} ${metrics.copies === 1 ? "prompt copy" : "prompt copies"}`;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1600);
  };

  const recordCopy = () => setMetrics(recordShaderCopy(shader.id));

  const copyExport = (text: string, message: string) => {
    setExportMenuOpen(false);
    copyText(text).then(() => notify(message));
  };

  const copyPromptBundle = async () => {
    if (exportBusy) return;
    if (promptFeedbackTimerRef.current !== undefined) {
      window.clearTimeout(promptFeedbackTimerRef.current);
      promptFeedbackTimerRef.current = undefined;
    }
    setPromptCopied(false);
    setExportMenuOpen(false);
    setExportBusy(true);
    try {
      await copyText(promptBundle);
      recordCopy();
      setPromptCopied(true);
      promptFeedbackTimerRef.current = window.setTimeout(() => {
        setPromptCopied(false);
        promptFeedbackTimerRef.current = undefined;
      }, 1600);
      notify("Reference prompt + agent notes copied");
    } catch (error) {
      console.error(error);
      notify("Copy prompt unavailable");
    } finally {
      setExportBusy(false);
    }
  };

  useEffect(() => () => {
    if (promptFeedbackTimerRef.current !== undefined) {
      window.clearTimeout(promptFeedbackTimerRef.current);
    }
  }, []);

  const copyUsageCode = async () => {
    if (exportBusy) return;
    setExportMenuOpen(false);
    setExportBusy(true);
    try {
      await copyText(usageExample);
      notify("Code copied");
    } catch (error) {
      console.error(error);
      notify("Code unavailable");
    } finally {
      setExportBusy(false);
    }
  };

  useEffect(() => {
    if (!exportMenuOpen) return undefined;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!exportControlRef.current?.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExportMenuOpen(false);
        exportTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [exportMenuOpen]);

  return (
    <>
      <div className="pane-inner">
        <main className="doc" id="doc" ref={docRef}>
          <div className="doc-intro">
            <div className="doc-topline">
              <h1>{shader.label}</h1>
              <div className="doc-actions">
                <div className="export-control" ref={exportControlRef}>
                  <button className="export-primary" disabled={exportBusy} onClick={copyPromptBundle}>
                    {promptCopied ? <><CheckIcon />Copied</> : <><CopyIcon />Copy Prompt</>}
                  </button>
                  <button
                    className="export-trigger"
                    ref={exportTriggerRef}
                    aria-label="More export options"
                    aria-haspopup="menu"
                    aria-expanded={exportMenuOpen}
                    aria-controls="shader-export-menu"
                    onClick={() => setExportMenuOpen((open) => !open)}
                  >
                    <ChevronIcon />
                  </button>
                  {exportMenuOpen ? (
                    <div className="export-menu card" id="shader-export-menu" role="menu">
                      <button role="menuitem" disabled={exportBusy} onClick={copyPromptBundle}>Copy Prompt</button>
                      <button role="menuitem" disabled={exportBusy} onClick={copyUsageCode}>Copy Code</button>
                      <button role="menuitem" onClick={() => copyExport(skillMarkdown, "SKILL.md copied")}>Copy SKILL.md</button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <p className="lede">
              <span>{shader.category}</span>
              <span aria-hidden="true"> • </span>
              {shader.description}
            </p>
            <div className="tagrow">
              <ShaderTags key={shader.id} tags={shader.tags} onSearch={onSearchTag} />
              <span className="metric-tag" title={viewLabel} aria-label={viewLabel}>
                <EyeIcon />{metrics.views.toLocaleString()}
              </span>
              <span className="metric-tag" title={copyLabel} aria-label={copyLabel}>
                <CopyIcon />{metrics.copies.toLocaleString()}
              </span>
            </div>
          </div>

          <section className="demo inset-shadow" id="usage" aria-label="Usage">
            <div className="stage-grid">
              <div
                className={`preview shader-preview ${shader.id}`}
                data-variant={activeVariant?.id}
              >
              <Suspense fallback={<div className="preview-loading" role="status">Loading renderer…</div>}>
                {Preview ? (
                  <Preview key={`${shader.id}-${activeVariant?.id ?? "default"}-${restartKey}`} {...previewProps} />
                ) : (
                  <div className="preview-loading" role="status">Renderer not available</div>
                )}
              </Suspense>
              <PreviewFpsMeter sampleKey={`${shader.id}-${activeVariant?.id ?? "default"}-${restartKey}`} />
              <div className="tools">
                <button
                  className="icon-btn inset-shadow"
                  onClick={() => setRestartKey((key) => key + 1)}
                  aria-label="Restart animation"
                >
                  <RestartIcon />
                </button>
              </div>
            </div>

            {shader.variants && shader.variants.length > 1 ? (
              <div className="variant-picker card" aria-label={`${shader.label} variants`}>
                <div className="variant-picker-head">{shader.variants.length} variants</div>
                <div
                  ref={variantOptionsRef}
                  className="variant-options"
                  role="radiogroup"
                  aria-label="Choose a variant"
                  data-edge-mask={variantEdgeMask}
                >
                  {shader.variants.map((variant) => {
                    const selected = variant.id === activeVariant?.id;
                    return (
                      <button
                        type="button"
                        className={`variant-option inset-shadow${selected ? " active" : ""}`}
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${variant.label}. ${variant.description}`}
                        key={variant.id}
                        onClick={(event) => {
                          onVariantSelect(variant.id);
                          event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        }}
                      >
                        <span className="variant-option-thumbnail">
                          <img src={variant.thumbnail} alt="" loading="lazy" />
                        </span>
                        <span className="variant-option-label">
                          <span>{variant.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="panel card">
              <div className="panel-head">
                <h2>{activeControls.length ? "Props" : "Renderer"}</h2>
                {activeControls.length ? (
                  <button
                    className="icon-btn inset-shadow"
                    aria-label={`Reset ${shader.label} props`}
                    onClick={() => setPreviewSettings(defaultSettings(activeControls, activeVariant?.props))}
                  >
                    <RestartIcon />
                  </button>
                ) : (
                  <span className="panel-ready"><span className="status-dot" />READY</span>
                )}
              </div>
              {activeControls.length ? (
                <div className="controls shader-controls">
                  {activeControls.map((control) => {
                    if (control.kind === "checkpoint") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      const id = `${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`;
                      return (
                        <CheckpointSliderControl
                          id={id}
                          key={control.key}
                          label={control.label}
                          options={control.options}
                          value={value}
                          onChange={(nextValue) => {
                            setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                          }}
                        />
                      );
                    }
                    if (control.kind === "color") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      const swatchValue = /^#[\da-f]{6}$/i.test(value) ? value : control.default;
                      const id = `${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`;
                      return (
                        <div className="control color-control inset-shadow" key={control.key}>
                          <label htmlFor={id}>{control.label}</label>
                          <div className="color-control-value">
                            <input
                              id={id}
                              className="color-swatch-input"
                              type="color"
                              value={swatchValue}
                              onChange={(event) => {
                                const nextValue = event.currentTarget.value;
                                setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                              }}
                            />
                            <input
                              className="color-hex-input"
                              type="text"
                              value={value.toUpperCase()}
                              maxLength={7}
                              aria-label={`${control.label} hex value`}
                              autoComplete="off"
                              spellCheck={false}
                              onChange={(event) => {
                                const nextValue = event.currentTarget.value;
                                setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                    if (isChoiceControl(control)) {
                      const value = String(previewSettings[control.key] ?? control.default);
                      return (
                        <div className="control choice-control inset-shadow" key={control.key}>
                          <span className="choice-label">{control.label}</span>
                          <div className="choice-options" role="group" aria-label={control.label}>
                            {control.options.map((option) => {
                              const selected = value === option.value;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  className={`choice-option${selected ? " active" : ""}`}
                                  aria-pressed={selected}
                                  onClick={() => setPreviewSettings((current) => ({ ...current, [control.key]: option.value }))}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (control.kind === "text") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      return (
                        <div className="control text-control inset-shadow" key={control.key}>
                          <label htmlFor={`${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`}>{control.label}</label>
                          <input
                            id={`${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`}
                            type="text"
                            value={value}
                            maxLength={control.maxLength}
                            placeholder={control.placeholder}
                            autoComplete="off"
                            spellCheck={false}
                            onChange={(event) => {
                              const nextValue = event.currentTarget.value;
                              setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                            }}
                          />
                        </div>
                      );
                    }
                    if (!isRangeControl(control)) return null;
                    const value = Number(previewSettings[control.key] ?? control.default);
                    const progress = (value - control.min) / (control.max - control.min);
                    const sliderStyle = { "--slider-progress": progress } as CSSProperties;
                    const setFromPointer = (clientX: number, element: HTMLDivElement) => {
                      const bounds = element.getBoundingClientRect();
                      const nextProgress = Math.min(1, Math.max(0, (clientX - bounds.left - 6) / (bounds.width - 12)));
                      const nextValue = control.min + nextProgress * (control.max - control.min);
                      const steppedValue = Math.round(nextValue / control.step) * control.step;
                      setPreviewSettings((current) => ({ ...current, [control.key]: steppedValue }));
                    };
                    return (
                      <div
                        className="control slider-control inset-shadow"
                        style={sliderStyle}
                        key={control.key}
                        onPointerDown={(event) => {
                          event.currentTarget.setPointerCapture(event.pointerId);
                          setFromPointer(event.clientX, event.currentTarget);
                        }}
                        onPointerMove={(event) => {
                          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                            setFromPointer(event.clientX, event.currentTarget);
                          }
                        }}
                        onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
                      >
                        <span className="slider-fill card"><span className="slider-knob" /></span>
                        <label htmlFor={`${shader.id}-${control.key}`}>{control.label}</label>
                        <span className="slider-value">{value.toFixed(control.digits)}</span>
                        <input
                          id={`${shader.id}-${control.key}`}
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={value}
                          aria-valuetext={value.toFixed(control.digits)}
                          onInput={(event) => {
                            const nextValue = Number(event.currentTarget.value);
                            setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="controls renderer-facts" aria-label="Renderer facts">
                <div className="control inset-shadow">
                  <span>Runtime</span><strong title={shader.runtime}>{shader.runtime === "webgl" ? "WebGL" : "WebGPU"}</strong>
                </div>
                <div className="control inset-shadow">
                  <span>Import</span><strong title={shader.importName}>{shader.importName}</strong>
                </div>
                <div className="control inset-shadow">
                  <span>Package</span><strong>@vfx-ui/react</strong>
                </div>
              </div>
            </div>
            </div>

            <div className="code-card card source-card">
              <div className="tabbar">
                <div className="tabs" role="tablist" aria-label="Source details">
                  {(["usage", "agent", "install"] as SourceTab[]).map((tab) => (
                    <button
                      className="tab"
                      role="tab"
                      aria-selected={sourceTab === tab}
                      key={tab}
                      onClick={() => setSourceTab(tab)}
                    >
                      {SOURCE_TAB_LABELS[tab]}
                    </button>
                  ))}
                </div>
                {sourceTab === "usage" && settingsDirty ? (
                  <span className="live-params-badge" title="Code reflects the current params panel values">Live params</span>
                ) : null}
                <button
                  className="icon-btn inset-shadow"
                  aria-label="Copy source"
                  onClick={() => {
                    if (sourceTab === "usage") recordCopy();
                    copyText(sourceText).then(() => notify("Copied"));
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
              {sourceTab === "agent" ? (
                <div className="source-filebar skill-filebar">
                  <span className="source-file-name">agent notes</span>
                  <span className="source-file-meta">
                    <strong>For AI coding agents</strong>
                    <span>plain text · {sourceText.split("\n").length} lines</span>
                  </span>
                </div>
              ) : null}
              <pre className={`code source-code${sourceTab === "agent" ? " skill-source" : ""}`}>
                <SyntaxHighlightedCode code={sourceText} language={sourceLanguage} />
              </pre>
            </div>
          </section>

          <h2 id="props">Props</h2>
          <div className="table-wrap card">
            <table>
              <thead><tr><th>Prop</th><th>Type</th><th className="col-default">Value</th></tr></thead>
              <tbody>
                {contractRows.map((row) => (
                  <tr key={row.name}>
                    <td><span className="mono-chip">{row.name}</span></td>
                    <td><span className="mono-chip">{row.type}</span></td>
                    <td className="col-default">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="installation">Installation</h2>
          <InstallationSteps importName={shader.importName} onNotify={notify} />

          <h2 id="agent">Agent guide</h2>
          <div className="integrity card">
            <span className="integrity-icon"><span className="status-dot" /></span>
            <div>
              <strong>Agent-ready by design</strong>
              <p>Every component ships machine-readable agent notes, a usage example, and copyable prompts so coding agents can integrate the effect without guesswork.</p>
            </div>
          </div>
          <div className="code-card card source-card">
            <div className="tabbar">
              <div className="tabs" role="tablist" aria-label="Agent notes">
                <span className="tab" role="tab" aria-selected="true">Agent Notes</span>
              </div>
              <button
                className="icon-btn inset-shadow"
                aria-label="Copy agent notes"
                onClick={() => copyText(shader.agentNotes ?? "").then(() => notify("Copied"))}
              >
                <CopyIcon />
              </button>
            </div>
            <pre className="code source-code skill-source">
              <SyntaxHighlightedCode code={shader.agentNotes ?? "No agent notes are registered for this component yet."} language="markdown" />
            </pre>
          </div>

          <nav className="pager" aria-label="Component pagination">
            {previous ? (
              <button className="card" onClick={() => onSelect(previous.id)}>
                <span className="k">Previous</span><span className="v">{previous.label}</span>
              </button>
            ) : <span />}
            {next ? (
              <button className="card next" onClick={() => onSelect(next.id)}>
                <span className="k">Next</span><span className="v">{next.label}</span>
              </button>
            ) : <span />}
          </nav>
        </main>

        <aside className="rail">
          <div className="toc-head"><TocIcon />On this page</div>
          <nav
            className="toc is-animated"
            aria-label="On this page"
            style={{ "--toc-active-index": activeTocIndex } as CSSProperties}
          >
            <span className="toc-active-line" aria-hidden="true" />
            <span className="toc-active-dot" aria-hidden="true" />
            {TOC_ITEMS.map(({ id, label }) => (
              <div className={`toc-item${activeTocSection === id ? " on" : ""}`} key={id}>
                <span className="rl" /><span className="dot" />
                <a
                  href={`#${id}`}
                  aria-current={activeTocSection === id ? "location" : undefined}
                  onClick={() => setActiveTocSection(id)}
                >
                  {label}
                </a>
              </div>
            ))}
          </nav>
        </aside>
      </div>
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
