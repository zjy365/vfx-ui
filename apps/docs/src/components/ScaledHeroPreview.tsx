import { useEffect, useRef, useState, type ReactNode } from "react";

/** Render the whole composition at a real desktop size, then fit the stage. */
export function ScaledHeroPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1120, height: 640 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0)
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const logicalWidth = size.width < 500 ? 600 : 1120;
  const scale = size.width / logicalWidth;
  return (
    <div ref={ref} className="scaled-hero-preview">
      <div
        style={{
          width: logicalWidth,
          height: Math.max(560, size.height / scale),
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
