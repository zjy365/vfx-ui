"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";

const scenes = [
  {
    name: "Ocean",
    props: {
      from: "#102f49",
      to: "#327fbe",
      accent: "#92d7f0",
      speed: 0.6,
      warp: 2.2,
      scale: 1.7,
      interactive: true,
    },
  },
  {
    name: "Ember",
    props: {
      from: "#1b0f0f",
      to: "#6e3226",
      accent: "#e0a458",
      speed: 0.45,
      warp: 2.8,
      scale: 1.4,
      interactive: true,
    },
  },
  {
    name: "Orchid",
    props: {
      from: "#281c3d",
      to: "#8a4b9e",
      accent: "#e7b6e9",
      speed: 0.5,
      warp: 2.6,
      scale: 1.5,
      interactive: true,
    },
  },
];

export function LiveExhibit() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [poster, setPoster] = useState("/showcase/fluid-gradient.png");
  const [reload, setReload] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const current = scenes[scene];
  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      {
        type: "vfx:preview",
        scheme: "dark",
        props: {
          ...current.props,
          fallback: {
            type: "img",
            props: {
              src: "/showcase/fluid-gradient.png",
              alt: "Fluid Gradient still preview",
              style: { width: "100%", height: "100%", objectFit: "cover" },
            },
          },
        },
      },
      location.origin,
    );
  }, [current]);
  const capture = useCallback(() => {
    try {
      const canvas = frame.current?.contentDocument?.querySelector("canvas");
      if (canvas && canvas.width > 0 && canvas.height > 0)
        setPoster(canvas.toDataURL("image/png"));
    } catch {
      /* A static component poster remains available. */
    }
  }, []);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) capture();
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "80px" },
    );
    observer.observe(node);
    const sync = () => {
      if (document.hidden) capture();
      setVisible(
        !document.hidden &&
          node.getBoundingClientRect().bottom > -80 &&
          node.getBoundingClientRect().top < innerHeight + 80,
      );
    };
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [capture]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.id !== "fluid-gradient"
      )
        return;
      if (event.data.type === "vfx:preview-ready") {
        setReady(true);
        setFailed(false);
      }
      if (event.data.type === "vfx:preview-error") setFailed(true);
    };
    addEventListener("message", listener);
    send();
    return () => removeEventListener("message", listener);
  }, [send]);
  useEffect(() => {
    send();
  }, [send, ready]);
  useEffect(() => {
    if (!playing || !visible) {
      setReady(false);
      return;
    }
    if (ready) return;
    const timer = setTimeout(() => setFailed(true), 20000);
    return () => clearTimeout(timer);
  }, [playing, visible, reload, ready]);
  return (
    <div
      ref={stage}
      className="exhibit-live"
      data-scene={current.name.toLowerCase()}
    >
      <img
        className="exhibit-live-poster"
        src={poster}
        alt=""
        width={884}
        height={512}
        fetchPriority="high"
      />
      {playing && visible && !failed && (
        <iframe
          key={reload}
          className={ready ? "is-ready" : ""}
          ref={frame}
          title="Fluid Gradient interactive shader"
          src="/preview-runtime/index.html?component=fluid-gradient&scheme=dark&presentation=exhibit"
          sandbox="allow-scripts allow-same-origin"
          onLoad={send}
        />
      )}
      <div className="exhibit-live-content">
        <div className="exhibit-live-top">
          <span>Fluid Gradient</span>
          <div>
            <span className="exhibit-live-kind">Interactive shader</span>
            <button
              aria-label={
                playing ? "Pause shader animation" : "Play shader animation"
              }
              onClick={() => {
                if (playing) capture();
                setPlaying(!playing);
                setReady(false);
              }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>
        <p className="exhibit-live-type" aria-hidden="true">
          A little
          <br />
          more fluid.
        </p>
        <div className="exhibit-live-bottom">
          <div className="exhibit-scenes" aria-label="Shader palette">
            {scenes.map((entry, index) => (
              <button
                key={entry.name}
                aria-pressed={scene === index}
                onClick={() => setScene(index)}
              >
                {entry.name}
              </button>
            ))}
          </div>
          <Link
            href={
              "/backgrounds/fluid-gradient/?props=" +
              encodeURIComponent(JSON.stringify(current.props))
            }
          >
            Customize component <ArrowRight size={14} />
          </Link>
        </div>
        {failed && (
          <div className="exhibit-live-error" role="status">
            The live preview could not start.
            <button
              onClick={() => {
                setFailed(false);
                setReady(false);
                setReload((value) => value + 1);
              }}
            >
              Retry preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
