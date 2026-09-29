import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Render a full-width block section at desktop width, then scale the whole
 * thing down into the fixed 16/10 stage. Unlike the hero variant, the stage
 * height follows the block's natural height, so tall sections are shown in
 * full rather than cropped.
 */
export function ScaledBlockPreview({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return undefined;
    const update = () => {
      const width = frame.clientWidth;
      const height = content.offsetHeight;
      if (width > 0 && height > 0) setSize({ width, height });
    };
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(content);
    update();
    return () => observer.disconnect();
  }, []);

  const logicalWidth = size.width < 500 ? 640 : 1120;
  const scale = size.width ? size.width / logicalWidth : 0;

  return (
    <div ref={frameRef} className="scaled-block-preview">
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: logicalWidth,
          transform: scale ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        style={scale ? { display: "block", height: size.height * scale } : undefined}
      />
    </div>
  );
}
