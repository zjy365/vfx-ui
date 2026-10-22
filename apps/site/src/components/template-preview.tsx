"use client";

import { useState } from "react";

export function TemplatePreview({
  title,
  preview,
  thumbnail,
}: {
  title: string;
  preview: string;
  thumbnail: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [mobile, setMobile] = useState(false);
  return (
    <div className="template-live-preview">
      <div className="template-preview-toolbar">
        <span className="eyebrow">COMPLETE WEBSITE PREVIEW</span>
        <div className="preview-options">
          <button
            aria-pressed={mobile}
            onClick={() => setMobile((value) => !value)}
          >
            {mobile ? "Fit width" : "Mobile"}
          </button>
          <a href={preview} target="_blank" rel="noreferrer">
            Open website ↗
          </a>
        </div>
      </div>
      <div className={"template-browser " + (mobile ? "mobile" : "")}>
        {playing ? (
          <iframe
            src={preview}
            title={title + " complete website preview"}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <>
            <img
              src={thumbnail}
              alt={title + " website preview"}
              width="1440"
              height="1000"
            />
            <button className="gallery-play" onClick={() => setPlaying(true)}>
              Try the website ↗
            </button>
          </>
        )}
      </div>
    </div>
  );
}
